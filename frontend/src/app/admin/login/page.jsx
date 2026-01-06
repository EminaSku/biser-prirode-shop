"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@minishop.com");
  const [password, setPassword] = useState("Admin123!");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function login(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.message || "Login failed");
        return;
      }

      // ✅ refresh navbar/admin state
      window.dispatchEvent(new Event("auth-changed"));

      // ✅ idi direktno na admin orders
      router.replace("/admin/orders");
      router.refresh();
    } catch (e2) {
      setErr(String(e2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="min-h-[65vh] grid place-items-center">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border bg-white shadow-sm">
          <div className="bg-linear-to-r from-zinc-50 to-zinc-100 px-6 py-5">
            <h1 className="text-2xl font-black tracking-tight !text-black">Admin Panel</h1>
            <p className="mt-1 text-sm font-semibold text-zinc-600">Prijavite se za upravljanje narudžbama.</p>
          </div>

          <form onSubmit={login} className="p-6 space-y-4">
            <div>
              <label className="text-sm font-bold text-zinc-700">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-black px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                placeholder="admin@minishop.com"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-zinc-700">Šifra</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-black px-3 py-2 outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                placeholder="••••••••"
                type="password"
              />
            </div>

            {err ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
                {err}
              </div>
            ) : null}

            <button
              disabled={loading}
              className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-zinc-800 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center text-sm text-zinc-600">
              <Link href="/" className="font-semibold hover:underline">
                ← Nazad na trgovinu
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
