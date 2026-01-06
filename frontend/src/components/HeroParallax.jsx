"use client";

import { useEffect, useRef } from "react";

function Drop({ className = "", style = {}, flip = false, rotate = 0 }) {
  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g
        stroke="rgba(255,255,255,0.72)"
        strokeWidth="3.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={[
          flip ? "translate(120,0) scale(-1,1)" : "",
          rotate ? `rotate(${rotate} 60 60)` : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {/* kapljica outline */}
        <path d="M60 12C60 12 34 44 34 70c0 18 12 34 26 38 14-4 26-20 26-38 0-26-26-58-26-58Z" />
        {/* highlight linija */}
        <path
          d="M50 78c2 9 9 16 18 18"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="2.6"
        />
      </g>
    </svg>
  );
}

export default function HeroParallax() {
  const wrapRef = useRef(null);
  const rafRef = useRef(null);
  const lastRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const update = () => {
      rafRef.current = null;

      const { x, y } = lastRef.current;
      const px = x * 18;
      const py = y * 12;

      const ry = x * 7;
      const rx = -y * 6;

      el.style.setProperty("--px", `${px}px`);
      el.style.setProperty("--py", `${py}px`);
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
    };

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;

      const dx = (e.clientX - cx) / (r.width / 2);
      const dy = (e.clientY - cy) / (r.height / 2);

      const x = Math.max(-1, Math.min(1, dx));
      const y = Math.max(-1, Math.min(1, dy));

      lastRef.current = { x, y };
      if (!rafRef.current) rafRef.current = requestAnimationFrame(update);
    };

    const onLeave = () => {
      lastRef.current = { x: 0, y: 0 };
      if (!rafRef.current) rafRef.current = requestAnimationFrame(update);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="bpHero" ref={wrapRef} aria-label="Hero">
      <div className="bpHeroVignette" aria-hidden="true" />

      <div className="bpHeroInner">
        <div className="bpHeroStage">
          {/* dekoracije (kapljice) */}
          <Drop className="bpHeroLeaf bpHeroLeaf--left" rotate={-10} />
          <Drop className="bpHeroLeaf bpHeroLeaf--right" flip rotate={10} />

          {/* centralna slika + halo iza */}
          <div className="bpHeroImageWrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/case.png" alt="Biser Prirode sokovi" className="bpHeroImg" />
          </div>

          {/* tekst preko slike */}
          <div className="bpHeroText">
            {/* Arc text: BISER PRIRODE u jednom redu, blago zaobljeno prema dole */}
            <svg
                className="bpHeroArc"
                viewBox="0 0 1000 240"
                aria-hidden="true"
            >
                <defs>
                {/* ✅ manji "bend": ako hoćeš jače savijanje, povećaj 185 -> 220 */}
                <path id="bpArcPath" d="M 80 170 Q 500 110 920 170" />

                </defs>

                <text className="bpHeroArcText">
                <textPath href="#bpArcPath" startOffset="50%" textAnchor="middle">
                    BISER PRIRODE
                </textPath>
                </text>
            </svg>

            <div className="bpHeroSubtitle">100% prirodni • hladno cijeđeni sokovi</div>
            </div>

        </div>
      </div>
    </section>

    
  );
}
