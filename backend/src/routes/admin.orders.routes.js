const router = require("express").Router();
//const prisma = require("../db/prisma");
const prisma = require("../prisma");


// IMPORTANT: koristi tvoje postojeće middleware-e
const { requireAuth, requireAdmin } = require("../middleware/auth");

// GET /admin/orders  -> lista svih narudžbi
router.get("/orders", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    res.json({ orders });
  } catch (err) {
    next(err);
  }
});

// PATCH /admin/orders/:id/status -> promijeni status
router.patch("/orders/:id/status", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["PENDING", "PAID", "SHIPPED", "CANCELLED", "CANCELED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // ako ti enum u schema kaže CANCELED, koristi to (ti imaš CANCELED)
    const normalized = status === "CANCELLED" ? "CANCELED" : status;

    const updated = await prisma.order.update({
      where: { id },
      data: { status: normalized },
    });

    res.json({ order: updated });
  } catch (err) {
    next(err);
  }
});

router.delete("/orders/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;

    // 1) obriši stavke narudžbe
    await prisma.orderItem.deleteMany({ where: { orderId: id } });

    // 2) obriši narudžbu
    await prisma.order.delete({ where: { id } });

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

router.delete("/orders", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

fetch("http://localhost:4000/admin/orders", {
  method: "DELETE",
  credentials: "include",
}).then(r => r.json()).then(console.log);

module.exports = router;