const express = require("express");
const { z } = require("zod");
const prisma = require("../prisma");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

const createProductSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().int().nonnegative(), // centi
  stock: z.number().int().nonnegative(),
  category: z.string().optional(),
  imageUrl: z.string().url().optional().nullable(),
});

router.post("/products", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = createProductSchema.parse(req.body);

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description ?? null,
        price: data.price,
        stock: data.stock,
        category: data.category ?? null,
        imageUrl: data.imageUrl ?? null,
      },
    });

    res.status(201).json(product);
  } catch (e) {
    next(e);
  }
});

router.put("/products/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = createProductSchema.partial().parse(req.body);

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data,
    });

    res.json(product);
  } catch (e) {
    next(e);
  }
});

router.delete("/products/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
