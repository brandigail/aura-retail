import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { LookupForm } from "@/features/track/lookup-form";
import { TrackForm } from "@/features/track/track-form";

export const metadata: Metadata = { title: "Track your order", description: "Check the status of your order, or get a list of all your orders by email." };

export default function TrackPage() {
  return (
    <div className="mx-auto w-full max-w-xl flex-1 px-4 py-10">
      <PackageSearch aria-hidden className="size-10 text-accent" />
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight">Track your order</h1>
      <p className="mt-3 text-lg text-muted">
        Enter your order number and the email address you used at checkout. You will find the order number in your confirmation email.
      </p>
      <div className="mt-8">
        <TrackForm />
      </div>

      <section aria-labelledby="forgot-heading" className="mt-12 rounded-xl border border-border bg-surface p-6">
        <h2 id="forgot-heading" className="text-2xl font-bold tracking-tight">Forgot your order number?</h2>
        <p className="mt-2 text-muted">
          No problem. Enter your email address and we will send you a message with all of your orders and a link to each one.
        </p>
        <div className="mt-5">
          <LookupForm />
        </div>
      </section>
    </div>
  );
}
