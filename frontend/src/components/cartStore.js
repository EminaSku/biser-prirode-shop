export const CART_KEY = "minishop_cart_v1";

export function readCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function writeCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(product, qty = 1) {
  const items = readCart();
  const idx = items.findIndex((x) => x.productId === product.id);
  if (idx >= 0) items[idx].qty += qty;
  else items.push({ productId: product.id, name: product.name, price: product.price, imageUrl: product.imageUrl, qty });
  writeCart(items);
  return items;
}

export function removeFromCart(productId) {
  const items = readCart().filter((x) => x.productId !== productId);
  writeCart(items);
  return items;
}

export function setQty(productId, qty) {
  const items = readCart().map((x) => (x.productId === productId ? { ...x, qty } : x));
  writeCart(items);
  return items;
}

export function clearCart() {
  writeCart([]);
  return [];
}

export function cartCount(items) {
  return items.reduce((sum, x) => sum + x.qty, 0);
}

export function cartTotal(items) {
  return items.reduce((sum, x) => sum + x.price * x.qty, 0);
}
