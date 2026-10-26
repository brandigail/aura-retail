"use client";

import { useState } from "react";
import { useCart } from "@/features/cart/cart-provider";
import { EmptyCart } from "@/features/cart/empty-cart";
import { priceOrder, standardShippingFor, type PricingConfig, type ShippingMethod } from "@/lib/order-pricing";
import { CheckoutForm } from "./checkout-form";
import type { AppliedDiscount } from "./discount-code-box";
import { OrderSummary } from "./order-summary";

export interface CheckoutConfig extends PricingConfig {
  bankDetails: string;
}

export function CheckoutView({ config }: { config: CheckoutConfig }) {
  const { items, ready, subtotal } = useCart();
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  const [discount, setDiscount] = useState<AppliedDiscount | null>(null);

  if (!ready) return <div aria-busy="true" aria-label="Loading checkout" className="h-64 animate-pulse rounded-lg bg-surface" />;
  if (items.length === 0) return <EmptyCart />;

  // The same function the server uses when the order is placed, so this preview is what you will pay.
  const pricing = priceOrder(config, subtotal, shippingMethod, discount?.percent ?? 0);
  const discounted = pricing.subtotal - pricing.discountCents;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_26rem]">
      <CheckoutForm
        shippingMethod={shippingMethod}
        onShippingChange={setShippingMethod}
        standardShippingCents={standardShippingFor(config, discounted)}
        expressShippingCents={config.expressShippingCents}
        freeShippingOverCents={config.freeShippingOverCents}
        discountCode={discount?.code ?? ""}
        total={pricing.total}
        bankDetails={config.bankDetails}
      />
      <OrderSummary
        pricing={pricing}
        vatPercent={config.vatPercent}
        shippingLabel={shippingMethod === "express" ? "Express" : "Standard"}
        discount={discount}
        onDiscountChange={setDiscount}
      />
    </div>
  );
}
