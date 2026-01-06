"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export default function QtyAddToCart({ product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);

  function dec() {
    setQty((q) => Math.max(1, q - 1));
  }

  function inc() {
    setQty((q) => Math.min(product.stock || 99, q + 1));
  }

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center overflow-hidden rounded-xl border">
        <button onClick={dec} className="px-3 py-2 text-lg font-black hover:bg-zinc-50 !text-black">
          −
        </button>
        <div className="w-14 text-center font-extrabold !text-black">{qty}</div>
        <button onClick={inc} className="px-3 py-2 text-lg font-black hover:bg-zinc-50 !text-black">
          +
        </button>
      </div>

      <button
        onClick={() => {
          addToCart(product, qty);
          setDone(true);
          setTimeout(() => setDone(false), 900);
        }}
        className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-zinc-800"
      >
        {done ? "Dodano ✅" : "Dodaj u korpu"}
      </button>
    </div>
  );
}
