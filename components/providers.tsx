"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/features/cart/cart-provider";
import { ThemeProvider } from "@/features/theme/theme-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <CartProvider>{children}</CartProvider>
    </ThemeProvider>
  );
}
