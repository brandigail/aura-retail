import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { MyOrders } from "@/features/orders/my-orders";
import { LookupForm } from "@/features/track/lookup-form";
import { TrackForm } from "@/features/track/track-form";

export const metadata: Metadata = { title: "Your orders", description: "See your orders and follow their progress." };

export default function TrackPage() {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      <h1 className="text-4xl font-extrabold tracking-tight">Your orders</h1>
      <p className="mt-2 text-lg text-muted">Every order you place on this device appears here automatically, with its progress.</p>

      <div className="mt-8">
        <MyOrders />
      </div>

      <details className="group mt-12 rounded-xl border border-border bg-surface">
        <summary className="flex cursor-pointer items-center justify-between gap-3 p-5 text-lg font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
          Can&apos;t see an order? It may have been placed on another device
          <ChevronDown aria-hidden className="size-5 shrink-0 transition-transform group-open:rotate-180" />
        </summary>
        <div className="grid gap-10 border-t border-border p-5 md:grid-cols-2">
          <section aria-labelledby="by-number-heading" className="flex flex-col gap-3">
            <h2 id="by-number-heading" className="text-xl font-bold">I have my order number</h2>
            <p className="text-muted">Enter it with the email you used at checkout, and we will open the order.</p>
            <TrackForm />
          </section>
          <section aria-labelledby="forgot-heading" className="flex flex-col gap-3">
            <h2 id="forgot-heading" className="text-xl font-bold">I forgot my order number</h2>
            <p className="text-muted">Enter your email and we will send you a message with all your orders and a link to each one.</p>
            <LookupForm />
          </section>
        </div>
      </details>
    </div>
  );
}
