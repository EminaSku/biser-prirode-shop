"use client";

import Link from "next/link";
import { useCart } from "../../components/CartProvider";

function money(cents) {
  return ((Number(cents || 0) / 100).toFixed(2)) + " KM";
}

export default function CartPage() {
  const { items, cartTotal, setQty, removeFromCart, clearCart } = useCart();
  const deliveryFee = 1100; // 11.00 KM u feningima
  const grandTotal = (cartTotal ?? 0) + deliveryFee;


  return (
    <main className="mx-auto max-w-7xl px-6 py-15">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Korpa</h1>
          <p className="mt-1 text-sm text-white">Pregledajte proizvode prije plaćanja.</p>
        </div>

        <Link href="/#shop" className="rounded-2xl border bg-white px-4 py-2 text-sm font-extrabold hover:bg-zinc-50">
          ← Nastavite kupovinu
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="mt-8 rounded-3xl border bg-white p-8">
          <div className="text-lg font-extrabold">Vaša korpa je prazna.</div>
          <p className="mt-2 text-zinc-600">Dodajte proizvod iz trgovine i on će se pojaviti ovdje.</p>
          <Link
            href="/#shop"
            className="mt-5 inline-flex rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-extrabold text-white hover:bg-zinc-800"
          >
            Idi na trgovinu
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* ITEMS */}
          <div className="space-y-4">
            {items.map((it) => (
              <div key={it.productId} className="rounded-3xl border bg-white p-4 shadow-sm">
                <div className="flex gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-2xl border bg-zinc-50 shrink-0">
                    {it.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.imageUrl} alt={it.name} className="h-full w-full object-cover" />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-base font-extrabold">{it.name}</div>
                        <div className="mt-1 text-sm text-zinc-600">{money(it.price)} svaki</div>
                      </div>

                      <button
                        onClick={() => removeFromCart(it.productId)}
                        className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-extrabold text-red-700 hover:bg-red-100"
                      >
                        Ukloni
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="inline-flex items-center gap-2 rounded-2xl border bg-white p-1">
                        <button
                          onClick={() => setQty(it.productId, it.qty - 1)}
                          className="h-9 w-9 rounded-xl border bg-white !text-black hover:bg-zinc-50"
                        >
                          −
                        </button>
                        <input
                          value={it.qty}
                          onChange={(e) => setQty(it.productId, Number(e.target.value || 1))}
                          type="number"
                          min={1}
                          className="w-16 rounded-xl border bg-white px-2 py-2 text-center text-sm text-black"
                        />
                        <button
                          onClick={() => setQty(it.productId, it.qty + 1)}
                          className="h-9 w-9 rounded-xl border bg-white !text-black hover:bg-zinc-50"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-sm !text-black">
                        Ukupno: <span className="text-zinc-900">{money(it.price * it.qty)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="rounded-2xl border bg-white px-4 py-2 text-sm font-extrabold !text-black hover:bg-zinc-50"
              >
                Ispraznite korpu
              </button>
            </div>
          </div>

          {/* SUMMARY */}
          <aside className="h-fit rounded-3xl border bg-white p-5 shadow-sm">
            <div className="text-lg font-extrabold text-black">Sažetak narudžbe</div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Proizvodi</span>
                <span>{items.reduce((s, x) => s + x.qty, 0)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Ukupno</span>
                <span>{money(cartTotal ?? 0)}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Dostava</span>
                <span>11.00 KM</span>
              </div>
              <div className="mt-3 border-t pt-3 flex justify-between text-base !text-black">
                <span>Ukupno</span>
                <span>{money(grandTotal)}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-5 inline-flex !text-white w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-emerald-700"
            >
              Naruči
            </Link>


            <div className="mt-3 text-xs text-zinc-500">
              Vašu narudžbu će vidjeti admin. Uskoro ćemo Vas kontaktirati.
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
