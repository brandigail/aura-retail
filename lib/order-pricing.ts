export type ShippingMethod = "standard" | "express";

export const SHIPPING_METHODS: readonly ShippingMethod[] = ["standard", "express"];

export function isShippingMethod(value: unknown): value is ShippingMethod {
  return value === "standard" || value === "express";
}

/** The shop settings that affect an order's price. */
export interface PricingConfig {
  vatPercent: number;
  /** Integer cents. */
  standardShippingCents: number;
  expressShippingCents: number;
  /** Standard delivery is free once the discounted subtotal reaches this. 0 turns free shipping off. */
  freeShippingOverCents: number;
}

export interface OrderPricing {
  /** Integer cents, before discount. */
  subtotal: number;
  discountCents: number;
  shippingCents: number;
  /** What the customer pays: subtotal - discount + shipping. */
  total: number;
  /** The VAT contained in `total` (prices are VAT-inclusive). */
  vatCents: number;
}

/** The standard shipping charge for a given discounted subtotal. */
export function standardShippingFor(config: PricingConfig, discountedSubtotal: number): number {
  const free = config.freeShippingOverCents > 0 && discountedSubtotal >= config.freeShippingOverCents;
  return free ? 0 : config.standardShippingCents;
}

/**
 * The single source of truth for what an order costs. The checkout page uses it for the live summary and the
 * server uses it again when the order is placed, so the two can never disagree. All amounts are integer cents.
 */
export function priceOrder(config: PricingConfig, subtotal: number, shippingMethod: ShippingMethod, discountPercent: number): OrderPricing {
  const discountCents = Math.round((subtotal * discountPercent) / 100);
  const discounted = subtotal - discountCents;
  const shippingCents = shippingMethod === "express" ? config.expressShippingCents : standardShippingFor(config, discounted);
  const total = discounted + shippingCents;
  const vatCents = Math.round((total * config.vatPercent) / (100 + config.vatPercent));
  return { subtotal, discountCents, shippingCents, total, vatCents };
}
