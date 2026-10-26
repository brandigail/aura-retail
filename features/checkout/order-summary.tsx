"use client";

import Link from "next/link";
import { Money } from "@/components/money";
import { useCart } from "@/features/cart/cart-provider";
import { useCurrency } from "@/features/currency/currency-provider";
import { formatMoney } from "@/lib/money";
import type { OrderPricing } from "@/lib/order-pricing";
import { DiscountCodeBox, type AppliedDiscount } from "./discount-code-box";

interface OrderSummaryProps {
  pricing: OrderPricing;
  vatPercent: number;
  shippingLabel: string;
  discount: AppliedDiscount | null;
  onDiscountChange: (discount: AppliedDiscount | null) => void;
}

function Row({ label, children, strong = false }: { label: string; children: React.ReactNode; strong?: boolean }) {
  return (
    <div className={`flex items-start justify-between gap-3 ${strong ? "border-t border-border pt-3 text-lg font-bold" : "text-sm"}`}>
      <dt className={strong ? "" : "text-muted"}>{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  );
}

export function OrderSummary({ pricing, vatPercent, shippingLabel, discount, onDiscountChange }: OrderSummaryProps) {
  const { items, count } = useCart();
  const { mode } = useCurrency();

  return (
    <aside aria-labelledby="summary-heading" className="flex h-fit flex-col gap-4 rounded-lg border border-border p-5 lg:sticky lg:top-24">
      <h2 id="summary-heading" className="text-xl font-semibold">Order summary</h2>
      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li key={item.productId} className="flex justify-between gap-3 py-2.5 text-sm">
            <span>
              {item.name} <span className="text-muted">× {item.qty}</span>
            </span>
            <span className="shrink-0 text-right font-medium"><Money cents={item.qty * item.unitPrice} stacked className="items-end" /></span>
          </li>
        ))}
      </ul>

      <DiscountCodeBox applied={discount} onChange={onDiscountChange} />

      <div className="flex flex-col gap-2 border-t border-border pt-3">
        <dl className="flex flex-col gap-2">
          <Row label={`Subtotal (${count} ${count === 1 ? "item" : "items"})`}><Money cents={pricing.subtotal} /></Row>
          {pricing.discountCents > 0 && (
            <Row label={`Discount${discount ? ` (${discount.code})` : ""}`}>
              <span className="text-accent-text">-<Money cents={pricing.discountCents} /></span>
            </Row>
          )}
          <Row label={`Delivery (${shippingLabel})`}>
            {pricing.shippingCents === 0 ? <span className="font-medium text-accent-text">Free</span> : <Money cents={pricing.shippingCents} />}
          </Row>
          <Row label="Total" strong><Money cents={pricing.total} stacked className="items-end" /></Row>
        </dl>
        {mode === "zar" && (
          <p className="rounded-md bg-surface p-2 text-sm font-medium">You will be charged {formatMoney(pricing.total)} in US dollars. The Rand amount is a guide.</p>
        )}
        <p className="text-xs text-muted">Includes {vatPercent}% VAT of <Money cents={pricing.vatCents} />. Charged in US dollars; Rand amounts are approximate.</p>
      </div>

      <Link href="/cart" className="text-sm text-accent-text underline underline-offset-4">Edit cart</Link>
    </aside>
  );
}
