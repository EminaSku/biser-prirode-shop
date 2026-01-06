"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AdminImageUpload({ value, onChange }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErr("");
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`${API_URL}/admin/upload`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.message || "Upload failed");
        return;
      }

      onChange(data.url); // backend vraća { url }
    } catch (e2) {
      setErr(String(e2));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-zinc-700">Image</label>

      {value ? (
        <div className="overflow-hidden rounded-2xl border bg-white">
          <img src={value} alt="product" className="h-48 w-full object-cover" />
        </div>
      ) : (
        <div className="h-48 w-full rounded-2xl border bg-zinc-50" />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <input type="file" accept="image/*" onChange={handleFile} />
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-xl border px-3 py-2 text-sm font-bold hover:bg-zinc-50"
          >
            Remove image
          </button>
        ) : null}
      </div>

      {loading ? <div className="text-sm text-zinc-600">Uploading...</div> : null}
      {err ? <div className="text-sm font-semibold text-red-700">{err}</div> : null}
    </div>
  );
}
