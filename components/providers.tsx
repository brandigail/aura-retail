"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/features/cart/cart-provider";
import { CurrencyProvider } from "@/features/currency/currency-provider";
import { ThemeProvider } from "@/features/theme/theme-provider";

export function Providers({ zarRate, children }: { zarRate: number; children: ReactNode }) {
  return (
    <ThemeProvider>
      <CurrencyProvider zarRate={zarRate}>
        <CartProvider>{children}</CartProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
