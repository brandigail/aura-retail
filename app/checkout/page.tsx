import type { Metadata } from "next";
import { CheckoutView } from "@/features/checkout/checkout-view";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const s = await getSettings();

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Checkout</h1>
      <CheckoutView
        config={{
          vatPercent: s.vatPercent,
          standardShippingCents: s.standardShippingCents,
          expressShippingCents: s.expressShippingCents,
          freeShippingOverCents: s.freeShippingOverCents,
          bankDetails: s.bankDetails,
        }}
      />
    </div>
  );
}
