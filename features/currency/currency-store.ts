/** How prices are shown: dollars with Rands beside them, dollars only, or Rands only. Customers are always charged in dollars. */
export type CurrencyMode = "both" | "usd" | "zar";

export const CURRENCY_MODES: readonly { value: CurrencyMode; label: string }[] = [
  { value: "both", label: "$ and R" },
  { value: "usd", label: "$ Dollars" },
  { value: "zar", label: "R Rands" },
];

const STORAGE_KEY = "currency-mode";
const listeners = new Set<() => void>();
let current: CurrencyMode | null = null;

function isMode(value: unknown): value is CurrencyMode {
  return value === "both" || value === "usd" || value === "zar";
}

function read(): CurrencyMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isMode(stored)) return stored;
  } catch {
    // Storage blocked: fall back to the default.
  }
  return "both";
}

export function subscribeCurrency(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      current = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getCurrencySnapshot(): CurrencyMode {
  current ??= read();
  return current;
}

/** The server and the first client render always show both currencies, so markup matches; the saved choice applies right after. */
export function getCurrencyServerSnapshot(): CurrencyMode {
  return "both";
}

export function setCurrencyMode(mode: CurrencyMode): void {
  current = mode;
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  listeners.forEach((listener) => listener());
}
