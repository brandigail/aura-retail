"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { formatMoney, formatZar } from "@/lib/money";
import {
  getCurrencyServerSnapshot,
  getCurrencySnapshot,
  setCurrencyMode,
  subscribeCurrency,
  type CurrencyMode,
} from "./currency-store";

/** A price ready to show: the main text, and a smaller companion amount in the other currency (or null). */
export interface FormattedPrice {
  main: string;
  alt: string | null;
}

interface CurrencyContextValue {
  /** Rands per US dollar. */
  rate: number;
  mode: CurrencyMode;
  setMode: (mode: CurrencyMode) => void;
  /** Formats integer USD cents according to the chosen mode. */
  format: (usdCents: number) => FormattedPrice;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

/** Supplies the Rands-per-dollar rate (read on the server) and the viewer's display choice. */
export function CurrencyProvider({ zarRate, children }: { zarRate: number; children: ReactNode }) {
  const mode = useSyncExternalStore(subscribeCurrency, getCurrencySnapshot, getCurrencyServerSnapshot);

  const value = useMemo<CurrencyContextValue>(
    () => ({
      rate: zarRate,
      mode,
      setMode: setCurrencyMode,
      format: (cents) => {
        if (mode === "zar") return { main: formatZar(cents, zarRate), alt: null };
        if (mode === "usd") return { main: formatMoney(cents), alt: null };
        return { main: formatMoney(cents), alt: formatZar(cents, zarRate) };
      },
    }),
    [zarRate, mode],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside <CurrencyProvider>.");
  return ctx;
}
