import Link from "next/link";
import QtyAddToCart from "../../../components/QtyAddToCart";

async function fetchProduct(id) {
  const url = `http://127.0.0.1:4000/products/${encodeURIComponent(id)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  return await res.json();
}

export default async function ProductPage({ params }) {
  // ✅ radi i ako je params slučajno Promise
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;

  const product = await fetchProduct(id);

  if (!product) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-4">
        <h2 className="text-2xl font-black text-white">Proizvod nije pronađen.</h2>
        <Link href="/" className="font-semibold text-white/80 hover:underline">
          ← Nazad
        </Link>
      </main>
    );
  }

  return (
    // ✅ OVO JE GLAVNO: container koji “suzi” sve
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <Link href="/#shop" className="text-sm font-semibold !text-white/80 hover:underline">
        ← Nazad na trgovinu
      </Link>

      {/* ✅ OVO JE DRUGO GLAVNO: normalan odnos širina kolona */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-start">
        {/* IMAGE */}
        <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-[380px] w-full object-cover lg:h-[440px]"
            />
          ) : (
            <div className="h-[380px] w-full bg-zinc-100 lg:h-[440px]" />
          )}
        </div>

        {/* INFO */}
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-black tracking-tight !text-zinc-900">{product.name}</h1>
          <p className="mt-2 text-sm font-semibold text-zinc-600">
            {product.description || "No description."}
          </p>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wide text-zinc-500">Cijena</div>
              <div className="text-2xl font-black text-zinc-900">
                {(product.price / 100).toFixed(2)} KM
              </div>
            </div>

            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-extrabold text-zinc-700">
              Zalihe: {product.stock}
            </span>
          </div>

          <QtyAddToCart product={product} />

          <div className="mt-6 grid gap-2 text-sm text-zinc-600">
            <div className="flex justify-between border-t pt-3">
              <span>Kategorija</span>
              <span className="font-semibold text-zinc-900">{product.category || "—"}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span>ID Proizvoda</span>
              <span className="font-mono text-xs text-zinc-700">{product.id}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
