import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { TrackForm } from "@/features/track/track-form";

export const metadata: Metadata = { title: "Track your order", description: "Check the status of your order." };

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
    </div>
  );
}
