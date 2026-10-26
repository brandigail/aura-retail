"use client";

import { createContext, useContext, type ReactNode } from "react";

const ZarRateContext = createContext<number | null>(null);

/** Supplies the Rands-per-dollar display rate, read on the server so it never needs a public env var. */
export function CurrencyProvider({ zarRate, children }: { zarRate: number; children: ReactNode }) {
  return <ZarRateContext.Provider value={zarRate}>{children}</ZarRateContext.Provider>;
}

export function useZarRate(): number {
  const rate = useContext(ZarRateContext);
  if (rate === null) throw new Error("useZarRate must be used inside <CurrencyProvider>.");
  return rate;
}
