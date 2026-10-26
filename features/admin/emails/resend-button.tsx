"use client";

import { Send } from "lucide-react";
import { useActionState } from "react";
import { resendEmailAction, type ResendState } from "./email-actions";

const initialState: ResendState = { status: "idle", message: "" };

export function ResendButton({ id, label }: { id: number; label: string }) {
  const [state, formAction, pending] = useActionState(resendEmailAction.bind(null, id), initialState);

  return (
    <form action={formAction} className="flex flex-col items-start gap-1">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-surface disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <Send aria-hidden className="size-4" />
        {pending ? "Sending…" : label}
      </button>
      {state.message && (
        <p role={state.status === "error" ? "alert" : "status"} className={`text-sm ${state.status === "error" ? "text-red-700 dark:text-red-300" : "text-muted"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
