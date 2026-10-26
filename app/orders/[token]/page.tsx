import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmation } from "@/features/orders/order-confirmation";

// Order pages hold personal details and are reachable only by their unguessable link.
export const metadata: Metadata = { title: "Order confirmation", robots: { index: false, follow: false } };

export default function OrderPage({ params }: PageProps<"/orders/[token]">) {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <Suspense fallback={<div aria-busy="true" aria-label="Loading order" className="mx-auto h-96 max-w-2xl animate-pulse rounded-lg bg-surface" />}>
        <OrderConfirmation params={params} />
      </Suspense>
    </div>
  );
}
