import { Heart, Leaf, X, Check } from "lucide-react";

const items = [
  { title: "Made in BiH", Icon: Heart },
  { title: "100% prirodno i domaće", Icon: Leaf },
  { title: "Bez aditiva", Icon: X },
  { title: "Kvalitet zagarantovan", Icon: Check }, // ✅ tačnica, nema Icon
];

export default function FeatureStrip() {
  return (
    <section className="mx-auto max-w-6xl px-4 -mt-10 sm:-mt-14">
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ title, Icon, dot }) => (
          <div
            key={title}
            className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-md px-5 py-6 text-center shadow-[0_18px_50px_rgba(0,0,0,.25)]"
          >
            {dot ? (
              <span className="mx-auto mb-3 block h-3.5 w-3.5 rounded-full bg-[#BDA881] shadow-[0_0_0_6px_rgba(189,168,129,0.12)]" />
            ) : Icon ? (
              <Icon className="mx-auto mb-3 h-12 w-12 text-[#BDA881]" strokeWidth={2.2} />
            ) : null}

            <div className="text-sm font-extrabold tracking-wide text-white">{title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
