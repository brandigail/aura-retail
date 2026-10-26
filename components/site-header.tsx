"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Heart, Menu, ShoppingCart, X } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { CartDrawer } from "@/features/cart/cart-drawer";
import { useCart } from "@/features/cart/cart-provider";
import { CurrencySwitcher } from "@/features/currency/currency-switcher";
import { ThemeToggle } from "@/features/theme/theme-toggle";
import { getWishlistServerSnapshot, getWishlistSnapshot, subscribeWishlist } from "@/features/wishlist/wishlist-store";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const ICON_BUTTON = `inline-flex size-10 items-center justify-center rounded-md border border-border transition-colors hover:bg-surface ${FOCUS}`;

export function SiteHeader({ storeName }: { storeName: string }) {
  const { count, ready } = useCart();
  const saved = useSyncExternalStore(subscribeWishlist, getWishlistSnapshot, getWishlistServerSnapshot).length;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className={`rounded text-xl font-bold tracking-tight text-accent-text ${FOCUS}`}>
          {storeName}
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <SiteNav layout="bar" />
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/wishlist"
            aria-label={ready && saved > 0 ? `Wishlist, ${saved} saved` : "Wishlist"}
            className={`relative ${ICON_BUTTON}`}
          >
            <Heart aria-hidden className={`size-5 ${ready && saved > 0 ? "fill-accent text-accent-text" : ""}`} />
            {ready && saved > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-accent-foreground">
                {saved}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-haspopup="dialog"
            aria-label={ready && count > 0 ? `Open cart, ${count} items` : "Open cart"}
            className={`relative ${ICON_BUTTON}`}
          >
            <ShoppingCart aria-hidden className="size-5" />
            {ready && count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-semibold text-accent-foreground">
                {count}
              </span>
            )}
          </button>
          <CurrencySwitcher className="hidden md:block" />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className={`${ICON_BUTTON} md:hidden`}
          >
            {menuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Mobile" className="border-t border-border px-4 py-3 md:hidden">
          <SiteNav layout="stack" onNavigate={() => setMenuOpen(false)} />
          <div className="mt-2 flex items-center gap-3 border-t border-border pt-3">
            <span className="text-sm text-muted">Show prices in</span>
            <CurrencySwitcher />
          </div>
        </nav>
      )}
      <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
