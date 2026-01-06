"use client";

import { useEffect } from "react";

export default function AdminShortcut() {
  useEffect(() => {
    function onKeyDown(e) {
      // Ctrl + Shift + A -> admin login
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        window.location.href = "/admin/login";
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}
