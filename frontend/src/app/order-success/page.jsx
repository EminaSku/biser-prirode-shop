import Link from "next/link";

export default function OrderSuccess({ searchParams }) {
  const id = searchParams?.id;

  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm mx-auto max-w-6xl">
      <h1 className="text-3xl !text-black">✅ Narudžba je napravljena!</h1>
      <p className="mt-2 text-zinc-600">Primili smo Vašu narudžbu i uskoro ćemo je obraditi.</p>

      {id ? (
        <div className="mt-4 rounded-xl bg-zinc-50 p-4">
          <div className="text-sm text-zinc-600">Order ID</div>
          <div className="mt-1 break-all font-mono text-sm font-bold">{id}</div>
        </div>
      ) : null}

      <div className="mt-6 flex gap-3">
        <Link href="/" className="rounded-xl border px-4 py-2 text-sm font-bold hover:bg-zinc-50">
          Nazad na trgovinu
        </Link>
      </div>
    </div>
  );
}
