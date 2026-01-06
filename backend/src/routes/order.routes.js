const router = require("express").Router();
const { z } = require("zod");
const prisma = require("../db/prisma");


const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6),
  address: z.string().min(5),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        qty: z.number().int().min(1),
      })
    )
    .min(1),
});

router.post("/", async (req, res, next) => {
  try {
    const body = schema.parse(req.body);

    const products = await prisma.product.findMany({
      where: { id: { in: body.items.map((i) => i.productId) } },
    });

    const map = new Map(products.map((p) => [p.id, p]));

    let total = 0;
    for (const it of body.items) {
      const p = map.get(it.productId);
      if (!p) return res.status(400).json({ message: "Invalid productId", productId: it.productId });
      if (p.stock < it.qty) return res.status(400).json({ message: "Not enough stock", productId: it.productId });
      total += p.price * it.qty;
    }

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          name: body.name,
          phone: body.phone,
          address: body.address,
          total,
          items: {
            create: body.items.map((it) => ({
              productId: it.productId,
              qty: it.qty,
              price: map.get(it.productId).price,
            })),
          },
        },
        include: { items: true },
      });

      for (const it of body.items) {
        await tx.product.update({
          where: { id: it.productId },
          data: { stock: { decrement: it.qty } },
        });
      }

      return created;
    });

    res.status(201).json({ order });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
