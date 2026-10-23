import type { Metadata } from "next";
import { CartView } from "@/features/cart/cart-view";

export const metadata: Metadata = { title: "Your cart | Aura Retail" };

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Your cart</h1>
      <CartView />
    </div>
  );
}
