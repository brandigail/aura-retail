"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useTransition, type FormEvent } from "react";
import { trackOrder } from "./track-actions";
import { initialTrackState } from "./track-types";

const INPUT =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-base placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function TrackForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(trackOrder, initialTrackState);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (state.status === "found" && state.token) router.push(`/orders/${state.token}`);
  }, [state, router]);

  /** Submitted by hand so React never resets the fields while the customer is still typing. */
  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="orderNumber" className="font-medium">Order number</label>
        <input id="orderNumber" name="orderNumber" inputMode="numeric" autoComplete="off" placeholder="e.g. 1042" required className={INPUT} />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="track-email" className="font-medium">Email used at checkout</label>
        <input id="track-email" name="email" type="email" autoComplete="email" required className={INPUT} />
      </div>
      <button
        type="submit"
        disabled={pending || state.status === "found"}
        className="h-12 rounded-md bg-accent px-6 font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {pending || state.status === "found" ? "Looking it up…" : "Track my order"}
      </button>
      <p role={state.status === "error" ? "alert" : "status"} className="min-h-5 text-sm text-red-700 dark:text-red-300">
        {state.status === "error" ? state.message : ""}
      </p>
    </form>
  );
}
