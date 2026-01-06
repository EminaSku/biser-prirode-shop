import Link from "next/link";
import HeroParallax from "../components/HeroParallax";
import FeatureStrip from "../components/FeatureStrip";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default async function HomePage() {
  const res = await fetch(`${API_URL}/products`, { cache: "no-store" });
  const data = await res.json().catch(() => []);
  const products = Array.isArray(data) ? data : data.products || [];

  return (
    <main id="top" className="w-full">
      <HeroParallax />
      <FeatureStrip />

      {/* ✅ O NAMA (CENTER) */}
      <section id="about" className="mx-auto max-w-10xl px-9 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white/90 text-center">
            Biser Prirode
          </div>

          <p className="mt-6 max-w-3xl text-sm sm:text-base font-semibold leading-relaxed text-white/70 text-center">
            Dobro došli u Biser prirode, simbol porodične tradicije, kvaliteta i ljubavi prema prirodi. Nudimo zdrave napitke
            dobivene prirodnim uzgojem, pažljivim odabirom plodova i hladno cijeđenim procesom. Naša misija je da vam pružimo
            najčistiji okus prirode, bez dodataka i konzervansa. Uživajte u svakom gutljaju naših sokova, napravljenih s ljubavlju
            i pažnjom, baš kao što to činimo mi, porodica Hadžo.
          </p>
        </div>
      </section>

      {/* SHOP SECTION */}
      <section id="shop" className="mx-auto max-w-7xl px-6 py-12 text-white/90">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white drop-shadow">Trgovina</h2>
            <p className="mt-1 text-sm font-semibold text-white/90">Odaberi sok i dodaj u korpu.</p>
          </div>

          <Link
            href="/cart"
            className="rounded-2xl border bg-white px-4 py-2 text-sm font-extrabold text-zinc-900 hover:bg-zinc-50"
          >
            Idi na korpu →
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-3xl border bg-white shadow-sm !text-black">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt={p.name} className="h-48 w-full object-cover" />
              ) : (
                <div className="h-48 w-full bg-zinc-100" />
              )}

              <div className="p-4 space-y-2">
                <div className="text-base font-extrabold">{p.name}</div>
                <div className="text-sm font-semibold text-zinc-600 line-clamp-2">{p.description || "—"}</div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-lg font-black">{(p.price / 100).toFixed(2)} KM</div>
                  <div className="text-xs font-bold text-zinc-500">Zalihe: {p.stock}</div>
                </div>

                <div className="pt-3 flex gap-2">
                  <Link
                    href={`/products/${p.id}`}
                    className="flex-1 rounded-2xl border px-3 py-2 text-center text-sm font-extrabold hover:bg-zinc-50"
                  >
                    Detalji
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KONTAKT */}
      <section id="kontakt" className="mx-auto max-w-7xl px-6 pb-16">
        
          <h3 className="text-xl font-white items-center text-center">
            Kontakt
          </h3>

          <p className="mt-2 text-sm font-semibold font-white items-center text-center">
            Pišite nam ili nas zapratite:
          </p>

          <div className="mt-5 flex-wrap gap-6 items-center text-center">
            {/* Telefon */}
            <a
              href="tel:+38761196877"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold
                        bg-emerald-50 text-emerald-900 border-emerald-200
                        hover:bg-emerald-100 transition"
            >
              📞 061/196-877
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/p/Biser-Prirode-61580543527929/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold
                        bg-emerald-50 text-emerald-900 border-emerald-200
                        hover:bg-emerald-100 transition"
            >
              f Facebook
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/biserprirode.bih/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold
                        bg-emerald-50 text-emerald-900 border-emerald-200
                        hover:bg-emerald-100 transition"
            >
              ⌁ Instagram
            </a>

            {/* OLX */}
            <a
              href="https://olx.ba/artikal/55425386"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-extrabold
                        bg-emerald-50 text-emerald-900 border-emerald-200
                        hover:bg-emerald-100 transition"
            >
              🛒 OLX ponuda
            </a>
          </div>
        
      </section>

    </main>
  );
}
