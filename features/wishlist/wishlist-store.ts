const STORAGE_KEY = "aura-wishlist";
const MAX_SAVED = 100;
const EMPTY: readonly number[] = [];
const listeners = new Set<() => void>();

let cache: { raw: string | null; ids: readonly number[] } = { raw: null, ids: EMPTY };

function parse(raw: string | null): readonly number[] {
  if (!raw) return EMPTY;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return EMPTY;
    return data.filter((id): id is number => Number.isInteger(id) && id > 0).slice(0, MAX_SAVED);
  } catch {
    return EMPTY;
  }
}

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeWishlist(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Saved product ids, newest first. The same array until the stored text changes. */
export function getWishlistSnapshot(): readonly number[] {
  const raw = readRaw();
  if (raw !== cache.raw) cache = { raw, ids: parse(raw) };
  return cache.ids;
}

export function getWishlistServerSnapshot(): readonly number[] {
  return EMPTY;
}

function write(ids: readonly number[]): void {
  try {
    if (ids.length === 0) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage blocked: the wishlist can't be kept on this device.
  }
  notify();
}

export function toggleWishlist(productId: number): void {
  const current = getWishlistSnapshot();
  if (current.includes(productId)) write(current.filter((id) => id !== productId));
  else write([productId, ...current].slice(0, MAX_SAVED));
}

export function removeFromWishlist(productId: number): void {
  write(getWishlistSnapshot().filter((id) => id !== productId));
}
