"use client";

import Link from "next/link";
import { useCart } from "@/features/cart/cart-provider";
import { EmptyCart } from "@/features/cart/empty-cart";
import { formatMoney } from "@/lib/money";
import { CheckoutForm } from "./checkout-form";

export function CheckoutView() {
  const { items, ready, subtotal, count } = useCart();

  if (!ready) return <div aria-busy="true" aria-label="Loading checkout" className="h-64 animate-pulse rounded-lg bg-surface" />;
  if (items.length === 0) return <EmptyCart />;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <CheckoutForm />
      <aside aria-labelledby="summary-heading" className="h-fit rounded-lg border border-border p-5 lg:sticky lg:top-24">
        <h2 id="summary-heading" className="mb-3 text-xl font-semibold">
          Order summary
        </h2>
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-3 py-2.5 text-sm">
              <span>
                {item.name} <span className="text-muted">× {item.qty}</span>
              </span>
              <span className="shrink-0 font-medium">{formatMoney(item.qty * item.unitPrice)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex items-baseline justify-between border-t border-border pt-3 text-lg">
          <span>
            Total <span className="text-sm text-muted">({count} {count === 1 ? "item" : "items"})</span>
          </span>
          <span className="font-bold">{formatMoney(subtotal)}</span>
        </p>
        <Link href="/cart" className="mt-3 inline-block text-sm text-accent underline underline-offset-4">
          Edit cart
        </Link>
      </aside>
    </div>
  );
}
