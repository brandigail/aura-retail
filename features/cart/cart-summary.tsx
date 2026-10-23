"use client";

import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { useCart } from "./cart-provider";

export function CartSummary({ onNavigate }: { onNavigate?: () => void }) {
  const { subtotal, count } = useCart();

  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-baseline justify-between text-lg">
        <span>
          Subtotal <span className="text-sm text-muted">({count} {count === 1 ? "item" : "items"})</span>
        </span>
        <span className="font-bold">{formatMoney(subtotal)}</span>
      </p>
      <p className="text-sm text-muted">Demo store: no real payment is taken at checkout.</p>
      <Link
        href="/checkout"
        onClick={onNavigate}
        className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-6 font-semibold text-accent-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Checkout
      </Link>
    </div>
  );
}
