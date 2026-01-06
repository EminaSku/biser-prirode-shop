"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

function loadCart() {
  try {
    const raw = localStorage.getItem("minishop_cart");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items) {
  try {
    localStorage.setItem("minishop_cart", JSON.stringify(items));
  } catch {}
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const api = useMemo(() => {
    const addToCart = (product, qty = 1) => {
      setItems((prev) => {
        const idx = prev.findIndex((x) => x.productId === product.id);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
          return copy;
        }
        return [
          ...prev,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl || null,
            qty,
          },
        ];
      });
    };

    const removeFromCart = (productId) => {
      setItems((prev) => prev.filter((x) => x.productId !== productId));
    };

    const setQty = (productId, qty) => {
      setItems((prev) =>
        prev.map((x) => (x.productId === productId ? { ...x, qty: Math.max(1, qty) } : x))
      );
    };

    const clearCart = () => setItems([]);

    const cartCount = items.reduce((sum, x) => sum + x.qty, 0);
    const cartTotal = items.reduce((sum, x) => sum + x.price * x.qty, 0);

    return { items, setItems, addToCart, removeFromCart, setQty, clearCart, cartCount, cartTotal };
  }, [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider />");
  return ctx;
}

export default CartProvider;
