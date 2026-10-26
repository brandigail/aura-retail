"use client";

import { useActionState, useTransition, type FormEvent } from "react";
import { requestOrderList } from "./lookup-actions";
import { initialLookupState } from "./track-types";

const INPUT =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-base placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/** For customers who lost their order number: we email them a list of their orders. */
export function LookupForm() {
  const [state, formAction, pending] = useActionState(requestOrderList, initialLookupState);
  const [, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => formAction(data));
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="lookup-email" className="font-medium">Your email address</label>
        <input id="lookup-email" name="email" type="email" autoComplete="email" required className={INPUT} aria-describedby="lookup-message" />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-md border border-border px-6 font-semibold hover:bg-surface disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {pending ? "Sending…" : "Email me my orders"}
      </button>
      <div id="lookup-message" role={state.status === "error" ? "alert" : "status"} className="min-h-5 text-sm">
        {state.status === "error" && <p className="text-red-700 dark:text-red-300">{state.message}</p>}
        {state.status === "sent" && (
          <>
            <p className="font-medium text-accent">{state.message}</p>
            {!state.delivered && (
              <p className="mt-1 text-muted">Demo store: no mail provider is connected, so the message is kept in the owner&apos;s Emails inbox instead of being sent.</p>
            )}
          </>
        )}
      </div>
    </form>
  );
}
