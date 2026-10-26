"use client";

import { useActionState } from "react";
import { sendContactMessage, type ContactFormState } from "./contact-actions";

const initialState: ContactFormState = { status: "idle", message: "", errors: {}, values: { name: "", email: "", message: "" } };

const INPUT =
  "w-full rounded-md border border-border bg-background px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function ContactForm() {
  const [state, formAction, submitting] = useActionState(sendContactMessage, initialState);
  const e = state.errors;

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      {/* Honeypot: hidden from people and assistive tech, tempting to bots. The odd name keeps browser autofill away from it. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="contact-hp">Leave this field empty</label>
        <input id="contact-hp" name="contact_hp_x7" tabIndex={-1} autoComplete="off" data-lpignore="true" data-1p-ignore />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="font-medium">Your name</label>
        <input id="name" name="name" autoComplete="name" defaultValue={state.values.name} required className={INPUT} aria-invalid={e.name ? true : undefined} aria-describedby={e.name ? "name-error" : undefined} />
        {e.name && <p id="name-error" role="alert" className="text-sm text-red-700 dark:text-red-300">{e.name}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="font-medium">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" defaultValue={state.values.email} required className={INPUT} aria-invalid={e.email ? true : undefined} aria-describedby={e.email ? "email-error" : undefined} />
        {e.email && <p id="email-error" role="alert" className="text-sm text-red-700 dark:text-red-300">{e.email}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="message" className="font-medium">How can we help?</label>
        <textarea id="message" name="message" rows={6} defaultValue={state.values.message} required className={INPUT} aria-invalid={e.message ? true : undefined} aria-describedby={e.message ? "message-error" : undefined} />
        {e.message && <p id="message-error" role="alert" className="text-sm text-red-700 dark:text-red-300">{e.message}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="h-12 rounded-md bg-accent px-6 font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {submitting ? "Sending…" : "Send message"}
        </button>
        {state.message && (
          <p role={state.status === "error" ? "alert" : "status"} className={state.status === "error" ? "text-red-700 dark:text-red-300" : "font-medium text-accent-text"}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
