import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import NavBar from "../components/NavBar";
import { CartProvider } from "../components/CartProvider";
import AdminShortcut from "../components/AdminShortcut";
import AdminDot from "../components/AdminDot";

export const metadata: Metadata = {
  title: "MiniShop",
  description: "MiniShop",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;600;700&family=Poppins:wght@300;400;500;600&family=Sacramento&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <CartProvider>
          <NavBar />

          {/* ✅ OVO DVOJE MORA BITI TU */}
          <AdminShortcut />
          <AdminDot />

          {children}
        </CartProvider>
      </body>
    </html>
  );
}
