"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const SHIPPING_CENTS = 1100; // 11.00 KM

function money(cents) {
  return `${(Number(cents || 0) / 100).toFixed(2)} KM`;
}

const STATUS_LABEL = {
  PENDING: "NA ČEKANJU",
  PAID: "PLAĆENO",
  SHIPPED: "DOSTAVLJENO",
  CANCELED: "OTKAZANO",
};

function StatusBadge({ status }) {
  const cls = useMemo(() => {
    switch (status) {
      case "PAID":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "SHIPPED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "CANCELED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-zinc-50 text-zinc-700 border-zinc-200";
    }
  }, [status]);

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-extrabold ${cls}`}>
      {STATUS_LABEL[status] || status}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`${API_URL}/admin/orders`, {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data?.message || `Greška (${res.status}).`);
        setOrders([]);
        return;
      }

      setOrders(data.orders || []);
    } catch (e) {
      setMsg(String(e));
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  async function setStatus(id, status) {
    setMsg("");

    const res = await fetch(`${API_URL}/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data?.message || `Ne mogu promijeniti status (${res.status}).`);
      return;
    }
    await load();
  }

  // ✅ BRISANJE JEDNE NARUDŽBE
  async function deleteOrder(id) {
    if (!confirm("Obrisati ovu narudžbu?")) return;

    setMsg("");
    const res = await fetch(`${API_URL}/admin/orders/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data?.message || `Brisanje nije uspjelo (${res.status}).`);
      return;
    }

    await load();
  }

  // ✅ BRISANJE SVIH NARUDŽBI (probne)
  async function deleteAllOrders() {
    if (!confirm("OBRISATI SVE narudžbe? (Ovo briše i stavke narudžbi)")) return;

    setMsg("");
    const res = await fetch(`${API_URL}/admin/orders`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data?.message || `Brisanje nije uspjelo (${res.status}).`);
      return;
    }

    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      {/* HEADER */}
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight !text-black">Narudžbe</h1>
            <p className="mt-1 text-sm font-semibold text-zinc-600">
              Pregled, statusi i brisanje probnih narudžbi.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={load}
              className="rounded-2xl border bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:bg-zinc-50"
            >
              {loading ? "Osvježavam..." : "Osvježi"}
            </button>

            <button
              onClick={deleteAllOrders}
              className="rounded-2xl border bg-red-50 px-4 py-2 text-sm font-extrabold text-red-700 hover:bg-red-100"
            >
              Obriši sve
            </button>

            <Link
              href="/"
              className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-zinc-800"
            >
              Trgovina
            </Link>
          </div>
        </div>

        {msg ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
            {msg}
          </div>
        ) : null}
      </div>

      {/* LIST */}
      <div className="grid gap-4">
        {orders.map((o) => {
          const itemsTotal = Number(o.total || 0);
          const grandTotal = itemsTotal + SHIPPING_CENTS;

          return (
            <div key={o.id} className="rounded-3xl border bg-white p-5 shadow-sm">
              {/* TOP ROW */}
              <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
                {/* LEFT INFO */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">Narudžba</div>
                    <div className="font-mono text-xs text-zinc-700 break-all">{o.id}</div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <StatusBadge status={o.status} />

                    <div className="rounded-full border bg-zinc-50 px-3 py-1 text-xs font-extrabold text-zinc-800">
                      Proizvodi: {money(itemsTotal)}
                    </div>

                    <div className="rounded-full border bg-zinc-50 px-3 py-1 text-xs font-extrabold text-zinc-800">
                      Dostava: {money(SHIPPING_CENTS)}
                    </div>

                    <div className="rounded-full border bg-zinc-900 px-3 py-1 text-xs font-extrabold text-white">
                      Ukupno: {money(grandTotal)}
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-zinc-800">
                    <span className="font-extrabold">{o.name}</span> •{" "}
                    <span className="font-semibold">{o.phone}</span>
                  </div>
                  <div className="text-sm font-semibold text-zinc-600">{o.address}</div>
                </div>

                {/* RIGHT CONTROLS */}
                <div className="rounded-2xl border bg-zinc-50 p-4 space-y-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">
                      Promijeni status
                    </div>

                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value)}
                      className="mt-2 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-extrabold text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-200"
                    >
                      <option value="PENDING">NA ČEKANJU</option>
                      <option value="PAID">PLAĆENO</option>
                      <option value="SHIPPED">DOSTAVLJENO</option>
                      <option value="CANCELED">OTKAZANO</option>
                    </select>
                  </div>

                  <div className="text-xs font-semibold text-zinc-600">
                    Ukupno stavki:{" "}
                    <span className="font-extrabold text-zinc-900">
                      {o.items?.reduce((s, it) => s + (it.qty || 0), 0) || 0}
                    </span>
                  </div>

                  {/* ✅ DELETE BUTTON */}
                  <button
                    onClick={() => deleteOrder(o.id)}
                    className="w-full rounded-2xl border bg-white px-4 py-2 text-sm font-extrabold text-red-700 hover:bg-red-50"
                  >
                    Obriši narudžbu
                  </button>
                </div>
              </div>

              {/* ITEMS */}
              <div className="mt-4 rounded-2xl border bg-white">
                <div className="flex items-center justify-between border-b px-4 py-3">
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">Proizvodi</div>
                  <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">Iznos</div>
                </div>

                <div className="px-4 py-3 space-y-2">
                  {o.items?.map((it) => {
                    const name = it.product?.name || it.productId;
                    const qty = Number(it.qty || 0);
                    const unit = Number(it.price || 0);
                    const line = unit * qty;

                    return (
                      <div key={it.id} className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-extrabold text-zinc-900">{name}</div>
                          <div className="text-xs font-semibold text-zinc-600">
                            {qty} × {money(unit)}
                          </div>
                        </div>
                        <div className="shrink-0 text-sm font-black text-zinc-900">{money(line)}</div>
                      </div>
                    );
                  })}

                  {!o.items?.length ? (
                    <div className="text-sm font-semibold text-zinc-600">Nema stavki.</div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {orders.length === 0 && !loading ? (
        <div className="rounded-2xl border bg-white p-6 text-zinc-700 font-semibold">
          Nema narudžbi još.
        </div>
      ) : null}
    </main>
  );
}
