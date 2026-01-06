"use client";

import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  // ✅ Login bez ikakvog admin wrappera
  if (isLogin) return <>{children}</>;

  // ✅ Admin stranice bez sidebara (jer već imaš admin menu gore u headeru)
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      {children}
    </div>
  );
}
