import { isPaymentMethod, type PaymentMethod } from "@/lib/demo-payment";
import { isShippingMethod, type ShippingMethod } from "@/lib/order-pricing";
import type { CheckoutField, CheckoutLine } from "./checkout-types";

export const CHECKOUT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 254 },
  address: { min: 10, max: 300 },
  maxLines: 50,
  maxQtyPerLine: 99,
} as const;

// Pragmatic email check: one @, no spaces, a dot in the domain. Real verification needs a confirmation email.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type CheckoutValidation =
  | {
      ok: true;
      value: {
        name: string;
        email: string;
        address: string;
        lines: CheckoutLine[];
        shippingMethod: ShippingMethod;
        paymentMethod: PaymentMethod;
        /** The code as typed (already applied in the summary), or an empty string. */
        discountCode: string;
      };
    }
  | { ok: false; errors: Partial<Record<CheckoutField, string>>; values: Record<CheckoutField, string>; message: string };

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isPositiveInt(value: unknown, max: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= max;
}

/** Parses the cart JSON, merging duplicate products. Returns null if malformed or empty. */
export function parseLines(raw: string): CheckoutLine[] | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(data) || data.length === 0 || data.length > CHECKOUT_LIMITS.maxLines) return null;

  const merged = new Map<number, CheckoutLine>();
  for (const entry of data as unknown[]) {
    if (typeof entry !== "object" || entry === null) return null;
    const { productId, qty, unitPrice } = entry as Record<string, unknown>;
    if (!isPositiveInt(productId, 2_147_483_647) || !isPositiveInt(qty, CHECKOUT_LIMITS.maxQtyPerLine)) return null;
    if (typeof unitPrice !== "number" || !Number.isInteger(unitPrice) || unitPrice < 0) return null;
    const existing = merged.get(productId);
    const total = (existing?.qty ?? 0) + qty;
    if (total > CHECKOUT_LIMITS.maxQtyPerLine) return null;
    merged.set(productId, { productId, qty: total, unitPrice });
  }
  return [...merged.values()];
}

export function validateCheckout(formData: FormData): CheckoutValidation {
  const values: Record<CheckoutField, string> = {
    name: text(formData, "name"),
    email: text(formData, "email"),
    address: text(formData, "address"),
  };
  const { name, email, address } = CHECKOUT_LIMITS;
  const errors: Partial<Record<CheckoutField, string>> = {};

  if (values.name.length < name.min) errors.name = values.name ? `Name must be at least ${name.min} characters.` : "Name is required.";
  else if (values.name.length > name.max) errors.name = `Name must be at most ${name.max} characters.`;

  if (!values.email) errors.email = "Email is required.";
  else if (values.email.length > email.max || !EMAIL_PATTERN.test(values.email)) errors.email = "Enter a valid email address.";

  if (values.address.length < address.min) errors.address = values.address ? "Enter your full delivery address." : "Address is required.";
  else if (values.address.length > address.max) errors.address = `Address must be at most ${address.max} characters.`;

  const lines = parseLines(text(formData, "items"));
  if (!lines) return { ok: false, errors, values, message: "Your cart is empty or invalid. Please review your cart." };
  if (Object.keys(errors).length > 0) return { ok: false, errors, values, message: "Please fix the highlighted fields." };

  const shippingMethod = text(formData, "shippingMethod");
  const paymentMethod = text(formData, "paymentMethod");
  if (!isShippingMethod(shippingMethod)) return { ok: false, errors, values, message: "Choose a delivery option." };
  if (!isPaymentMethod(paymentMethod)) return { ok: false, errors, values, message: "Choose a payment method." };

  return { ok: true, value: { ...values, lines, shippingMethod, paymentMethod, discountCode: text(formData, "discountCode") } };
}
