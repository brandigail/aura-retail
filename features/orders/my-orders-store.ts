const STORAGE_KEY = "aura-orders";
const MAX_REMEMBERED = 50;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMPTY: readonly string[] = [];
const listeners = new Set<() => void>();

let cache: { raw: string | null; tokens: readonly string[] } = { raw: null, tokens: EMPTY };

function parse(raw: string | null): readonly string[] {
  if (!raw) return EMPTY;
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return EMPTY;
    return data.filter((t): t is string => typeof t === "string" && UUID.test(t)).slice(0, MAX_REMEMBERED);
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

export function subscribeOrders(listener: () => void): () => void {
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

/** The private order links remembered on this device, newest first. Same array until the stored text changes. */
export function getOrdersSnapshot(): readonly string[] {
  const raw = readRaw();
  if (raw !== cache.raw) cache = { raw, tokens: parse(raw) };
  return cache.tokens;
}

export function getOrdersServerSnapshot(): readonly string[] {
  return EMPTY;
}

function write(tokens: readonly string[]): void {
  try {
    if (tokens.length === 0) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  } catch {
    // Storage blocked: orders simply aren't remembered on this device.
  }
  notify();
}

/** Remembers an order on this device so it shows up under "Your orders". Safe to call repeatedly. */
export function rememberOrder(token: string): void {
  if (!UUID.test(token)) return;
  const current = getOrdersSnapshot();
  if (current[0] === token) return;
  write([token, ...current.filter((t) => t !== token)].slice(0, MAX_REMEMBERED));
}

export function forgetOrder(token: string): void {
  write(getOrdersSnapshot().filter((t) => t !== token));
}

export function forgetAllOrders(): void {
  write(EMPTY);
}
