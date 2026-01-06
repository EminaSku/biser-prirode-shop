"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const [done, setDone] = useState(false);

  return (
    <button
      onClick={() => {
        addToCart(product, 1);
        setDone(true);
        setTimeout(() => setDone(false), 800);
      }}
      style={{
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid #111",
        background: "#111",
        color: "white",
        fontWeight: 800,
        cursor: "pointer",
      }}
    >
      {done ? "Dodano ✅" : "Dodaj u korpu"}
    </button>
  );
}
