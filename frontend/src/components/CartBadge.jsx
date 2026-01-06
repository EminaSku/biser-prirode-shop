"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartBadge() {
  const cart = useCart();

  const items =
    cart?.items ||
    cart?.cartItems ||
    cart?.cart ||
    [];

  const count =
    typeof cart?.count === "number"
      ? cart.count
      : Array.isArray(items)
      ? items.reduce((sum, it) => {
          const q = it?.qty ?? it?.quantity ?? 1;
          return sum + (Number.isFinite(q) ? q : 1);
        }, 0)
      : 0;

  return (
    <Link
      href="/cart"
      className="inline-flex items-center gap-2 font-extrabold font-[var(--font-headers)] !text-white hover:!text-[var(--second)]"
    >
      {/* Ikonica */}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
        <path
          d="M6 7h15l-2 8H8L6 7Zm0 0L5.3 4.5H3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <span>Korpa</span>

      {/* Badge */}
      <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-white/25 bg-white/10 px-1.5 text-[11px] font-black text-white">
        {count ?? 0}
      </span>
    </Link>
  );
}
