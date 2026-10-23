"use client";

import { Trash2 } from "lucide-react";
import { CartLineItem } from "./cart-line-item";
import { useCart } from "./cart-provider";
import { CartSummary } from "./cart-summary";
import { EmptyCart } from "./empty-cart";

export function CartView() {
  const { items, ready, clearCart } = useCart();

  // The cart lives in localStorage, so there is nothing to show until after hydration.
  if (!ready) return <div aria-busy="true" aria-label="Loading cart" className="h-64 animate-pulse rounded-lg bg-surface" />;
  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <section aria-label="Cart items">
        <ul className="divide-y divide-border border-y border-border">
          {items.map((item) => (
            <CartLineItem key={item.productId} item={item} />
          ))}
        </ul>
        <button
          type="button"
          onClick={clearCart}
          className="mt-4 inline-flex items-center gap-1 rounded text-sm text-muted hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:hover:text-red-300"
        >
          <Trash2 aria-hidden className="size-4" />
          Clear cart
        </button>
      </section>
      <aside aria-label="Order summary" className="h-fit rounded-lg border border-border p-5 lg:sticky lg:top-24">
        <CartSummary />
      </aside>
    </div>
  );
}
