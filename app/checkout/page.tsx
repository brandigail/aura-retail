import type { Metadata } from "next";
import { CheckoutView } from "@/features/checkout/checkout-view";

export const metadata: Metadata = { title: "Checkout | Aura Retail" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Checkout</h1>
      <CheckoutView />
    </div>
  );
}
