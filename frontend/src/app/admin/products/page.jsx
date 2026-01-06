"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function money(cents) {
  return `${(Number(cents || 0) / 100).toFixed(2)} KM`;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setMsg("");
    const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
    const data = await res.json().catch(() => []);
    if (!res.ok) setMsg("Ne mogu učitati proizvode.");
    setProducts(Array.isArray(data) ? data : data.products || []);
    setLoading(false);
  }

  async function remove(id) {
    if (!confirm("Obrisati ovaj proizvod?")) return;

    setMsg("");
    const res = await fetch(`${API_URL}/admin/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data?.message || "Brisanje nije uspjelo (da li si admin?).");
      return;
    }
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return products;
    return products.filter((p) =>
      [p.name, p.description, p.category].filter(Boolean).join(" ").toLowerCase().includes(t)
    );
  }, [products, q]);

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 space-y-6">
      {/* HEADER / TOOLBAR (VEĆI) */}
      <section className="rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight !text-black">Proizvodi</h1>
            <p className="mt-2 text-base font-semibold text-zinc-600">
              Kreirajte, uredite i brišite proizvode.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/orders"
              className="rounded-2xl border bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 hover:bg-zinc-50"
            >
              Narudžbe
            </Link>

            <Link
              href="/admin/products/new"
              className="rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-extrabold !text-white hover:bg-zinc-800"
            >
              + Novi proizvod
            </Link>

            <button
              onClick={load}
              className="rounded-2xl border bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 hover:bg-zinc-50"
            >
              {loading ? "Osvježavam..." : "Osvježi"}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Pretraži proizvode..."
            className="h-12 w-full rounded-2xl border bg-white px-4 text-base font-semibold text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-200 sm:max-w-xl"
          />
          <div className="text-sm font-semibold text-zinc-500">
            Ukupno: <span className="font-extrabold text-zinc-900">{filtered.length}</span>
          </div>
        </div>

        {msg ? (
          <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {msg}
          </div>
        ) : null}
      </section>

      {/* GRID (VEĆI KARTONI) */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-3xl border bg-white shadow-sm">
            {/* slika veća */}
            {p.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.imageUrl} alt={p.name} className="h-56 w-full object-cover" />
            ) : (
              <div className="h-56 w-full bg-zinc-100" />
            )}

            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate text-lg font-black text-zinc-900">{p.name}</div>
                  <div className="mt-1 line-clamp-2 text-sm font-semibold text-zinc-600">
                    {p.description || "—"}
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">Cijena</div>
                  <div className="text-lg font-black text-zinc-900">{money(p.price)}</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-full border bg-zinc-50 px-3 py-1 text-xs font-extrabold text-zinc-800">
                  Zalihe: {p.stock}
                </span>

                {p.category ? (
                  <span className="max-w-[60%] truncate text-xs font-bold text-zinc-500">
                    {p.category}
                  </span>
                ) : (
                  <span />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  className="rounded-2xl border bg-white px-4 py-3 text-center text-sm font-extrabold text-zinc-900 hover:bg-zinc-50"
                >
                  Uredi
                </Link>

                <button
                  onClick={() => remove(p.id)}
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-extrabold text-red-700 hover:bg-red-100"
                >
                  Obriši
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border bg-white p-8 text-zinc-700 font-semibold">
          Nema pronađenih proizvoda.
        </div>
      ) : null}
    </main>
  );
}
