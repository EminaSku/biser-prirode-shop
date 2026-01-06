const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");

const adminProductRoutes = require("./routes/admin.products.routes");
const adminUploadRoutes = require("./routes/admin.upload.routes");
const adminOrdersRoutes = require("./routes/admin.orders.routes");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// public routes
app.get("/health", (req, res) => res.json({ ok: true, message: "API is healthy" }));
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// admin routes
app.use("/admin", adminProductRoutes);
app.use("/admin", adminUploadRoutes);
app.use("/admin", adminOrdersRoutes);

module.exports = app;
