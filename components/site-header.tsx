"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/features/cart/cart-provider";
import { ThemeToggle } from "@/features/theme/theme-toggle";

export function SiteHeader() {
  const { count, ready } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Aura Retail
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-2">
          <Link
            href="/cart"
            aria-label={ready && count > 0 ? `Cart, ${count} items` : "Cart"}
            className="relative inline-flex size-10 items-center justify-center rounded-md border border-border transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <ShoppingCart aria-hidden className="size-5" />
            {ready && count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
