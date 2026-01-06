"use client";

import { useCart } from "./CartProvider";
import Link from "next/link";

export default function ProductGrid({ products = [] }) {
  const { addToCart } = useCart();

  if (!products.length) {
    return (
      <div className="rounded-3xl border bg-white p-6 text-zinc-700">
        Nema proizvoda još.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <div key={p.id} className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          {p.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.imageUrl} alt={p.name} className="h-52 w-full object-cover" />
          ) : (
            <div className="h-52 w-full bg-emerald-50" />
          )}

          <div className="p-5 space-y-3">
            <div className="min-w-0">
              <div className="truncate text-lg font-extrabold !text-zinc-900">{p.name}</div>
              <div className="mt-1 line-clamp-2 text-sm text-zinc-600">
                {p.description || "—"}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-base font-black text-zinc-900">
                {(p.price / 100).toFixed(2)} KM
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border">
                Zalihe: {p.stock}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => addToCart(p, 1)}
                className="flex-1 rounded-2xl bg-emerald-700 px-4 py-2 text-sm font-extrabold text-white hover:bg-emerald-800"
              >
                Dodaj u korpu
              </button>

              <Link
                href={`/products/${p.id}`}
                className="rounded-2xl border bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:bg-zinc-50"
              >
                Detalji
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
