"use client";

import { useState } from "react";

export default function AdminDot() {
  const [hover, setHover] = useState(false);

  // svijetlo zelena (mint)
  const dotColor = "rgba(120, 255, 196, 1)";

  return (
    <a
      href="/admin/login"
      aria-label="admin"
      title="Admin"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "fixed",
        bottom: 14,
        right: 14,
        width: 18,
        height: 18,
        borderRadius: 999,

        // ✅ boja + jačina preko opacity
        background: dotColor,
        opacity: hover ? 0.55 : 0.28,

        // ✅ mali glow da izgleda premium na tamnoj pozadini
        boxShadow: hover
          ? "0 0 0 6px rgba(120,255,196,0.12), 0 0 18px rgba(120,255,196,0.35)"
          : "0 0 0 4px rgba(120,255,196,0.10), 0 0 10px rgba(120,255,196,0.22)",

        zIndex: 9999,
        cursor: "pointer",
        transition: "opacity 150ms ease, transform 150ms ease, box-shadow 150ms ease",
        transform: hover ? "scale(1.12)" : "scale(1)",
      }}
    />
  );
}
