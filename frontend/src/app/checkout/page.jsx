"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../components/CartProvider";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ✅ Dostava 11.00 KM (u centima)
const SHIPPING_CENTS = 1100;

function money(cents) {
  return (Number(cents || 0) / 100).toFixed(2) + " KM";
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cartTotal, clearCart } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const itemCount = useMemo(() => items.reduce((s, x) => s + (x.qty || 0), 0), [items]);

  // ✅ UKUPNO = proizvodi + dostava (ako ima artikala)
  const shipping = items.length ? SHIPPING_CENTS : 0;
  const totalWithShipping = (cartTotal ?? 0) + shipping;

  async function submit(e) {
    e.preventDefault();
    setErr("");

    if (!items.length) {
      setErr("Your cart is empty.");
      return;
    }
    if (name.trim().length < 2) return setErr("Name is too short.");
    if (phone.trim().length < 6) return setErr("Phone is too short.");
    if (address.trim().length < 5) return setErr("Address is too short.");

    const payload = {
      name,
      phone,
      address,
      items: items.map((it) => ({ productId: it.productId, qty: it.qty })),
      // (opcionalno) možeš poslati i totals ako želiš:
      // shippingCents: shipping,
      // totalCents: totalWithShipping,
    };

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErr(data?.message || "Order failed.");
        return;
      }

      const orderId = data?.order?.id;
      clearCart();
      router.push(`/order-success?id=${orderId}`);
    } catch (e2) {
      setErr(String(e2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      {/* HEADER (kao Korpa) */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Provjera narudžbe</h1>
          <p className="mt-1 text-sm text-white/80">Unesite detalje za dostavu i izvršite narudžbu.</p>
        </div>

        <Link
          href="/cart"
          className="rounded-2xl border bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:bg-zinc-50"
        >
          ← Nazad na korpu
        </Link>
      </div>

      {/* GRID (kao Korpa) */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* LEFT: form */}
        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-extrabold !text-black">Podaci za dostavu</h2>
          <p className="mt-1 text-sm text-zinc-600">Popunite osnovne informacije.</p>

          <form onSubmit={submit} className="mt-5 grid gap-4">
            <div>
              <label className="text-sm font-extrabold text-zinc-700">Ime i prezime</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-4 focus:ring-zinc-200"
                placeholder="npr. Selma ..."
              />
            </div>

            <div>
              <label className="text-sm font-extrabold text-zinc-700">Broj telefona</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-4 focus:ring-zinc-200"
                placeholder="npr. +387 61 123 456"
              />
            </div>

            <div>
              <label className="text-sm font-extrabold text-zinc-700">Adresa</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={5}
                className="mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-zinc-900 outline-none focus:ring-4 focus:ring-zinc-200"
                placeholder="Ulica, broj, grad"
              />
            </div>

            {err ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {err}
              </div>
            ) : null}

            <button
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-extrabold text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {loading ? "Placing order..." : "Napravite narudžbu"}
            </button>

            <div className="text-xs text-zinc-500">
              Vašu narudžbu će vidjeti admin. Uskoro ćemo Vas kontaktirati.
            </div>
          </form>
        </section>

        {/* RIGHT: order summary */}
        <aside className="h-fit lg:sticky lg:top-24 rounded-3xl border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-extrabold text-zinc-900">Sažetak narudžbe</h2>

          <div className="mt-4 space-y-3">
            {items.map((it) => (
              <div key={it.productId} className="flex items-start justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-extrabold text-zinc-900">{it.name}</div>
                  <div className="text-zinc-600">Količina: {it.qty}</div>
                </div>
                <div className="shrink-0 font-black text-zinc-900">{money(it.price * it.qty)}</div>
              </div>
            ))}

            <div className="flex justify-between border-t pt-3 text-sm text-zinc-600">
              <span>Proizvodi</span>
              <span>{itemCount}</span>
            </div>

            <div className="flex justify-between text-sm text-zinc-600">
              <span>Ukupno proizvodi</span>
              <span>{money(cartTotal ?? 0)}</span>
            </div>

            <div className="flex justify-between text-sm text-zinc-600">
              <span>Dostava</span>
              <span>{money(shipping)}</span>
            </div>

            {/* ✅ UKUPNO = PROIZVODI + DOSTAVA */}
            <div className="flex justify-between border-t pt-3 text-base font-extrabold text-zinc-900">
              <span>Ukupno</span>
              <span>{money(totalWithShipping)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
