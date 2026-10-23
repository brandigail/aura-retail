import type { CartItem } from "@/types/cart";

const STORAGE_KEY = "aura-cart";
const EMPTY: readonly CartItem[] = [];
const listeners = new Set<() => void>();

let cache: { raw: string | null; items: readonly CartItem[] } = { raw: null, items: EMPTY };

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    Number.isInteger(v.productId) &&
    typeof v.slug === "string" &&
    typeof v.name === "string" &&
    Number.isInteger(v.unitPrice) &&
    Number.isInteger(v.qty) &&
    (v.qty as number) > 0 &&
    Number.isInteger(v.stock) &&
    (v.image === null || typeof v.image === "string")
  );
}

function parse(raw: string | null): readonly CartItem[] {
  if (!raw) return EMPTY;
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isCartItem) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

/** Referentially stable between changes, as useSyncExternalStore requires. */
export function getCartSnapshot(): readonly CartItem[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return cache.items;
  }
  if (raw !== cache.raw) cache = { raw, items: parse(raw) };
  return cache.items;
}

export function getCartServerSnapshot(): readonly CartItem[] {
  return EMPTY;
}

export function subscribeCart(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function write(items: readonly CartItem[]): void {
  const raw = items.length > 0 ? JSON.stringify(items) : null;
  try {
    if (raw) localStorage.setItem(STORAGE_KEY, raw);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked: keep the cart in memory for this page view.
  }
  cache = { raw, items: items.length > 0 ? items : EMPTY };
  notify();
}

function clamp(qty: number, stock: number): number {
  return Math.max(0, Math.min(qty, stock));
}

export function addItem(item: Omit<CartItem, "qty">, qty = 1): void {
  const current = getCartSnapshot();
  const existing = current.find((i) => i.productId === item.productId);
  if (!existing) {
    const next = clamp(qty, item.stock);
    if (next > 0) write([...current, { ...item, qty: next }]);
    return;
  }
  const next = clamp(existing.qty + qty, item.stock);
  write(current.map((i) => (i.productId === item.productId ? { ...i, stock: item.stock, qty: next } : i)));
}

export function setItemQty(productId: number, qty: number): void {
  const current = getCartSnapshot();
  write(
    current.flatMap((i) => {
      if (i.productId !== productId) return [i];
      const next = clamp(qty, i.stock);
      return next > 0 ? [{ ...i, qty: next }] : [];
    }),
  );
}

export function removeItem(productId: number): void {
  write(getCartSnapshot().filter((i) => i.productId !== productId));
}

export function clearCart(): void {
  write(EMPTY);
}
