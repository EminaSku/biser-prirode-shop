"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// ✅ promijeni samo ovo ako ti je backend ruta drugačija:
const UPLOAD_ENDPOINT = "/admin/upload";

function toCents(kmStringOrNumber) {
  const n =
    typeof kmStringOrNumber === "number"
      ? kmStringOrNumber
      : Number(String(kmStringOrNumber).replace(",", "."));
  if (!Number.isFinite(n)) return 0;
  return Math.round(n * 100);
}

function fromCents(cents) {
  const n = Number(cents || 0) / 100;
  return String(n.toFixed(2));
}

export default function AdminProductForm({ mode = "create", productId = null }) {
  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceKM, setPriceKM] = useState("0.00");
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // ✅ upload state
  const [uploading, setUploading] = useState(false);
  const [uploadNote, setUploadNote] = useState("");

  const imageOk = useMemo(() => {
    if (!imageUrl) return true;
    try {
      new URL(imageUrl);
      return true;
    } catch {
      return false;
    }
  }, [imageUrl]);

  async function loadProduct() {
    if (!isEdit || !productId) return;

    setLoading(true);
    setMsg("");

    const res = await fetch(`${API_URL}/products/${encodeURIComponent(productId)}`, {
      cache: "no-store",
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMsg(data?.message || "Failed to load product.");
      setLoading(false);
      return;
    }

    const p = data?.product || data; // zavisi kako vraćaš na backendu
    setName(p?.name || "");
    setDescription(p?.description || "");
    setPriceKM(fromCents(p?.price || 0));
    setStock(Number(p?.stock || 0));
    setCategory(p?.category || "");
    setImageUrl(p?.imageUrl || "");

    setLoading(false);
  }

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // ✅ Upload slike (file -> backend -> url)
  async function uploadFile(file) {
    setUploadNote("");
    setMsg("");

    if (!file) return;
    if (!file.type?.startsWith("image/")) {
      setUploadNote("Please select an image file.");
      return;
    }

    // 5MB limit (promijeni ako želiš)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadNote("Image is too large (max 5MB).");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();

      // ✅ najčešći naziv polja je "file" ili "image"
      // ako backend očekuje npr. "image", promijeni ovdje:
      fd.append("file", file);

      const res = await fetch(`${API_URL}${UPLOAD_ENDPOINT}`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setUploadNote(data?.message || "Upload failed (check admin login / upload route).");
        setUploading(false);
        return;
      }

      // ✅ backend nekad vraća { imageUrl }, nekad { url }…
      const url = data?.imageUrl || data?.url || data?.publicUrl || data?.path;

      if (!url) {
        setUploadNote("Upload OK but response has no URL. Check backend response.");
        setUploading(false);
        return;
      }

      setImageUrl(url);
      setUploadNote("Uploaded ✅");
      setTimeout(() => setUploadNote(""), 1200);
    } catch (e) {
      setUploadNote(String(e));
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (name.trim().length < 2) return setMsg("Name is too short.");
    if (!imageOk) return setMsg("Image URL is not a valid URL.");
    const price = toCents(priceKM);
    if (price < 0) return setMsg("Price must be >= 0.");
    if (!Number.isInteger(Number(stock)) || Number(stock) < 0)
      return setMsg("Stock must be a non-negative integer.");

    setSaving(true);

    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      price,
      stock: Number(stock),
      category: category.trim() || undefined,
      imageUrl: imageUrl.trim() ? imageUrl.trim() : null,
    };

    const url = isEdit
      ? `${API_URL}/admin/products/${encodeURIComponent(productId)}`
      : `${API_URL}/admin/products`;

    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMsg(data?.message || "Save failed (are you logged in as admin?)");
      setSaving(false);
      return;
    }

    setSaving(false);

    // nakon create, odvedi na edit ili nazad na listu
    if (!isEdit) {
      const created = data?.product || data;
      const id = created?.id;
      if (id) window.location.href = `/admin/products/${id}/edit`;
      else window.location.href = `/admin/products`;
    } else {
      setMsg("Saved ✅");
      setTimeout(() => setMsg(""), 1200);
    }
  }

  async function onDelete() {
    if (!isEdit || !productId) return;
    if (!confirm("Delete this product?")) return;

    setMsg("");
    const res = await fetch(`${API_URL}/admin/products/${encodeURIComponent(productId)}`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data?.message || "Delete failed.");
      return;
    }

    window.location.href = "/admin/products";
  }

  if (loading) {
    return (
      <div className="rounded-3xl border bg-white p-6">
        <div className="text-sm font-bold !text-zinc-600">Učitavanje…</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-white tracking-tight">
            {isEdit ? "Uredi proizvod" : "Novi proizvod"}
          </h1>
          <p className="mt-1 text-sm !text-white">
            {isEdit ? "Ažurirajte detalje proizvoda i sačuvajte." : "Kreirajte novi proizvod za svoju trgovinu."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className="rounded-xl border bg-white px-4 py-2 text-sm font-bold hover:bg-zinc-50"
          >
            ← Nazad
          </Link>

          {isEdit ? (
            <button
              onClick={onDelete}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-extrabold text-red-700 hover:bg-red-100"
            >
              Obriši
            </button>
          ) : null}
        </div>
      </div>

      {msg ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
          {msg}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border bg-white p-5 space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wide !text-black">Naziv</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-zinc-200 !text-black"
              placeholder="npr. Sok od jabuke"
            />
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wide !text-black">Opis</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-zinc-200 !text-black"
              rows={4}
              placeholder="Kratak opis…"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide !text-black">Cijena (KM)</div>
              <input
                value={priceKM}
                onChange={(e) => setPriceKM(e.target.value)}
                className="mt-2 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-zinc-200 !text-black"
                placeholder="99.99"
              />
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wide !text-black">Zalihe</div>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="mt-2 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-zinc-200 !text-black"
                min={0}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide !text-black">Kategorija</div>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-zinc-200 !text-black"
                placeholder="npr. Sokovi"
              />
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wide !text-black">
                Slika (Učitaj ili URL)
              </div>

              {/* ✅ Upload button */}
              <div className="mt-2 flex items-center gap-2">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border bg-white px-3 py-2 text-sm font-extrabold hover:bg-zinc-50 !text-black">
                  {uploading ? "Učitavanje..." : "Učitaj sliku"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => uploadFile(e.target.files?.[0])}
                  />
                </label>

                {uploadNote ? (
                  <span className="text-xs font-bold !text-black">{uploadNote}</span>
                ) : null}
              </div>

              {/* ✅ OR paste URL */}
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="mt-2 w-full rounded-2xl border bg-white px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-zinc-200 !text-black"
                placeholder="https://..."
              />
              {!imageOk ? <div className="mt-1 text-xs text-red-600">Nepostojeći URL</div> : null}
            </div>
          </div>

          <button
            disabled={saving}
            type="submit"
            className="mt-2 w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-zinc-800 disabled:opacity-60"
          >
            {saving ? "Spremanje..." : isEdit ? "Spremi promjene" : "Kreiraj proizvod"}
          </button>
        </div>

        <div className="rounded-3xl border bg-white p-5">
          <div className="text-xs font-bold uppercase tracking-wide text-black">Pregled</div>
          <div className="mt-3 overflow-hidden rounded-3xl border bg-zinc-50">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={name || "preview"} className="h-72 w-full object-cover" />
            ) : (
              <div className="h-72 w-full bg-zinc-100" />
            )}
            <div className="p-4">
              <div className="text-lg font-extrabold !text-black">{name || "Naziv proizvoda"}</div>
              <div className="mt-1 text-sm !text-black">{description || "Opis…"}</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-sm font-black !text-black">{Number(priceKM || 0).toFixed(2)} KM</div>
                <div className="text-xs font-bold !text-black">Zalihe: {Number(stock || 0)}</div>
              </div>
              {category ? (
                <div className="mt-2 inline-flex rounded-full bg-zinc-200 px-3 py-1 text-xs font-bold text-zinc-700">
                  {category}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
