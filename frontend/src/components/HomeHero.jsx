import Link from "next/link";

export default function HomeHero() {
  return (
    <section id="home" className="relative">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="h-[520px] w-full bg-gradient-to-br from-emerald-50 via-white to-emerald-100" />
        <div className="absolute inset-0 opacity-80">
          {/* soft blobs */}
          <div className="absolute left-[-120px] top-[60px] h-[320px] w-[320px] rounded-full bg-emerald-200/40 blur-3xl" />
          <div className="absolute right-[-120px] top-[120px] h-[360px] w-[360px] rounded-full bg-lime-200/35 blur-3xl" />
          <div className="absolute left-[35%] top-[240px] h-[260px] w-[260px] rounded-full bg-emerald-300/20 blur-3xl" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-12">
        {/* Top small strip like "Pratite nas" vibe */}
        <div className="flex items-center justify-between text-xs font-bold text-zinc-600">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500">Pratite nas</span>
            <span className="text-zinc-400">—</span>
            <span className="rounded-full bg-white px-3 py-1 border">FB</span>
            <span className="rounded-full bg-white px-3 py-1 border">IG</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="rounded-full bg-white px-3 py-1 border">100% prirodno</span>
            <span className="rounded-full bg-white px-3 py-1 border">Hladno cijeđeno</span>
          </div>
        </div>

        {/* Hero card */}
        <div className="mt-6 overflow-hidden rounded-[32px] border bg-white/70 shadow-sm backdrop-blur">
          <div className="grid gap-8 p-8 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-xs font-black text-emerald-800">
                BISER PRIRODE
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                Prirodni sokovi
              </div>

              <h1 className="mt-4 text-5xl font-black tracking-tight text-zinc-900 md:text-6xl">
                Priroda u boci.
              </h1>

              <p className="mt-4 text-base leading-relaxed text-zinc-600">
                100% prirodni hladno cijeđeni sokovi — bez šećera, vode i aditiva.
                Čisto, svježe i ukusno.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#shop"
                  className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-extrabold text-white hover:bg-emerald-800"
                >
                  Pogledaj proizvode
                </a>

                <a
                  href="#about"
                  className="rounded-2xl border bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 hover:bg-zinc-50"
                >
                  O nama
                </a>

                <a
                  href="#contact"
                  className="rounded-2xl border bg-white px-5 py-3 text-sm font-extrabold text-zinc-900 hover:bg-zinc-50"
                >
                  Kontakt
                </a>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <Badge title="Bez šećera" sub="0 dodataka" />
                <Badge title="Bez vode" sub="čist sok" />
                <Badge title="Bez aditiva" sub="prirodno" />
              </div>
            </div>

            {/* Right visual */}
            <div className="relative">
              <div className="absolute -right-10 -top-10 h-52 w-52 rounded-full bg-emerald-200/50 blur-2xl" />
              <div className="absolute -left-10 -bottom-10 h-52 w-52 rounded-full bg-lime-200/40 blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-emerald-50 to-white p-6">
                <div className="text-xs font-black uppercase tracking-widest text-emerald-700">
                  MiniShop demo
                </div>
                <div className="mt-2 text-sm text-zinc-600">
                  Full-stack primjer: Next.js + Express + Prisma + Postgres.
                </div>

                <div className="mt-6 grid gap-3">
                  <Feature>Brz checkout</Feature>
                  <Feature>Korpa + localStorage</Feature>
                  <Feature>Admin panel (sakriven)</Feature>
                </div>

                <div className="mt-6 rounded-2xl border bg-white p-4">
                  <div className="text-xs font-black uppercase tracking-widest text-zinc-500">
                    Tip
                  </div>
                  <div className="mt-2 text-sm text-zinc-700">
                    Ako želiš “sliku hero-a” kao mesnica (velika foto),
                    ubaci je u <b>/public/hero.jpg</b> i ja ti dam verziju sa pozadinom.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spacer to resemble full hero height */}
        <div className="h-10" />
      </div>
    </section>
  );
}

function Badge({ title, sub }) {
  return (
    <div className="rounded-2xl border bg-white p-3">
      <div className="text-sm font-extrabold text-zinc-900">{title}</div>
      <div className="mt-1 text-xs font-bold text-zinc-500">{sub}</div>
    </div>
  );
}

function Feature({ children }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border bg-white px-4 py-3 text-sm font-bold text-zinc-800">
      <span className="h-2 w-2 rounded-full bg-emerald-600" />
      {children}
    </div>
  );
}
