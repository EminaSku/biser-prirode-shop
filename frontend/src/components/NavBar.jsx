"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import CartBadge from "./CartBadge";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function FbIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H16.7V5.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V11H7.5v3H10v8h3.5z" />
    </svg>
  );
}

function IgIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm9 2h-9A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9A3.5 3.5 0 0 0 20 16.5v-9A3.5 3.5 0 0 0 16.5 4z" />
      <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2.1a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8z" />
      <path d="M17.6 6.4a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
    </svg>
  );
}

/** ✅ Admin pill actions (ljepše od krugova) */
function AdminActions({ logout }) {
  const pathname = usePathname();

  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold " +
    "!text-white transition border backdrop-blur-md";

  const active =
    "bg-white/20 border-white/35 shadow-[0_12px_28px_rgba(0,0,0,.20)]";

  const idle =
    "bg-white/10 border-white/22 hover:bg-white/16 hover:border-white/32";

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/admin/products"
        className={`${base} ${pathname?.startsWith("/admin/products") ? active : idle}`}
      >
        Proizvodi
      </Link>

      <Link
        href="/admin/orders"
        className={`${base} ${pathname?.startsWith("/admin/orders") ? active : idle}`}
      >
        Narudžbe
      </Link>

      <button
        onClick={logout}
        className={`${base} bg-white/12 border-white/24 hover:bg-white/18 hover:border-white/34`}
        type="button"
      >
        Logout
      </button>
    </div>
  );
}


export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(null);

  const checkAdmin = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        setIsAdmin(false);
        return;
      }

      const data = await res.json().catch(() => ({}));
      const role = data?.user?.role || data?.role;
      setIsAdmin(role === "ADMIN");
    } catch {
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    checkAdmin();

    const onAuthChanged = () => checkAdmin();
    const onFocus = () => checkAdmin();
    const onVis = () => {
      if (document.visibilityState === "visible") checkAdmin();
    };

    window.addEventListener("auth-changed", onAuthChanged);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      window.removeEventListener("auth-changed", onAuthChanged);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [checkAdmin]);

  useEffect(() => {
    checkAdmin();
  }, [pathname, checkAdmin]);

  async function logout() {
    await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
    setIsAdmin(false);
    router.push("/");
    router.refresh();
    window.dispatchEvent(new Event("auth-changed"));
  }

  // ✅ Hash linkovi (scroll na istoj stranici)
  const nav = useMemo(
    () => [
      { label: "Početna", href: "/#top" },
      { label: "O nama", href: "/#about" },
      { label: "Trgovina", href: "/#shop" },
      { label: "Kontakt", href: "/#kontakt" },
    ],
    []
  );

  return (
    <header className="bpHeader">
      <div className="bpHeaderGlow" aria-hidden="true" />

      <div className="bpHeaderInner">
        {/* TOP ROW */}
        <div className="bpTopRow">
          {/* Left */}
          <div className="bpFollow">
            <span className="bpFollowText">Pratite nas</span>
            <span className="bpDash">—</span>

            <a
              className="bpIcon"
              href="https://www.facebook.com/p/Biser-Prirode-61580543527929/"
              aria-label="Facebook"
              target="_blank"
              rel="noreferrer"
            >
              <FbIcon />
            </a>

            <a
              className="bpIcon"
              href="https://www.instagram.com/biserprirode.bih/"
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
            >
              <IgIcon />
            </a>
          </div>

          {/* Center: logo */}
          <div className="bpLogoWrap">
            <Link href="/" className="bpLogoLink" aria-label="Početna">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/bp2.png" alt="Biser Prirode" className="bpLogo" />
            </Link>
          </div>

          {/* Right */}
          <div className="bpRight">
            <CartBadge />

            {isAdmin === true ? (
              <AdminActions logout={logout} />
            ) : null}
          </div>
        </div>

        {/* NAV ROW */}
        <nav className="bpNav" aria-label="Glavna navigacija">
          {nav.map((item) => (
            <a key={item.href} className="bpNavLink" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
