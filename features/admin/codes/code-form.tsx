"use client";

import { useActionState, type ReactNode } from "react";
import { createCode } from "./code-actions";
import { initialCodeState, type CodeFormValues } from "./code-types";

const INPUT =
  "w-full rounded-md border border-border bg-background px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[invalid=true]:border-red-600";

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">{label}</label>
      {children}
      {error ? <p id={`${id}-error`} role="alert" className="text-sm text-red-700 dark:text-red-300">{error}</p> : hint ? <p className="text-xs text-muted">{hint}</p> : null}
    </div>
  );
}

export function CodeForm() {
  const [state, formAction, pending] = useActionState(createCode, initialCodeState);
  const e = state.errors;
  const aria = (key: keyof CodeFormValues) => ({ "aria-invalid": e[key] ? true : undefined, "aria-describedby": e[key] ? `${key}-error` : undefined });

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4 rounded-lg border border-border p-5">
      <h2 className="text-xl font-semibold">Create a code</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field id="code" label="Code" hint="What customers type, like SUMMER20." error={e.code}>
          <input id="code" name="code" defaultValue={state.values.code} autoCapitalize="characters" autoComplete="off" maxLength={20} required className={`${INPUT} uppercase`} {...aria("code")} />
        </Field>
        <Field id="percent" label="Discount (%)" hint="1 to 90." error={e.percent}>
          <input id="percent" name="percent" type="number" inputMode="numeric" min={1} max={90} defaultValue={state.values.percent} required className={INPUT} {...aria("percent")} />
        </Field>
        <Field id="maxUses" label="Limit (optional)" hint="How many times it can be used." error={e.maxUses}>
          <input id="maxUses" name="maxUses" type="number" inputMode="numeric" min={1} defaultValue={state.values.maxUses} className={INPUT} {...aria("maxUses")} />
        </Field>
        <Field id="expires" label="Last day (optional)" hint="Works until the end of this day." error={e.expires}>
          <input id="expires" name="expires" type="date" defaultValue={state.values.expires} className={INPUT} {...aria("expires")} />
        </Field>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent px-5 py-2.5 font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {pending ? "Saving…" : "Create code"}
        </button>
        {state.message && (
          <p role={state.status === "error" ? "alert" : "status"} className={state.status === "error" ? "text-red-700 dark:text-red-300" : "font-medium text-accent"}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
