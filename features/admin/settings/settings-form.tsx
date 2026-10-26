"use client";

import { useActionState, type ReactNode } from "react";
import type { StoreSettings } from "@/lib/settings";
import { saveSettings, type SettingsFormState } from "./settings-actions";

const initialState: SettingsFormState = { status: "idle", message: "", errors: {} };

const INPUT =
  "w-full rounded-md border border-border bg-background px-3 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

function Field({ id, label, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-medium">{label}</label>
      {children}
      {hint && !error && <p id={`${id}-hint`} className="text-sm text-muted">{hint}</p>}
      {error && <p id={`${id}-error`} role="alert" className="text-sm text-red-700 dark:text-red-300">{error}</p>}
    </div>
  );
}

function dollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [state, formAction, submitting] = useActionState(saveSettings, initialState);
  const e = state.errors;
  const aria = (id: string) => ({ "aria-invalid": e[id] ? true : undefined, "aria-describedby": e[id] ? `${id}-error` : undefined });

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-8">
      <fieldset className="flex flex-col gap-4 rounded-lg border border-border p-5">
        <legend className="px-2 text-lg font-semibold">Your store</legend>
        <Field id="storeName" label="Store name" error={e.storeName}>
          <input id="storeName" name="storeName" defaultValue={settings.storeName} required className={INPUT} {...aria("storeName")} />
        </Field>
        <Field id="tagline" label="Tagline" hint="Shown in the footer and in search results." error={e.tagline}>
          <input id="tagline" name="tagline" defaultValue={settings.tagline} className={INPUT} {...aria("tagline")} />
        </Field>
        <Field id="announcement" label="Announcement bar" hint="A banner above every page, for sales or notices. Leave empty to hide it." error={e.announcement}>
          <input id="announcement" name="announcement" defaultValue={settings.announcement} className={INPUT} {...aria("announcement")} />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4 rounded-lg border border-border p-5">
        <legend className="px-2 text-lg font-semibold">Contact details</legend>
        <Field id="contactEmail" label="Email" hint="Customers see this in the footer and on the contact page." error={e.contactEmail}>
          <input id="contactEmail" name="contactEmail" type="email" defaultValue={settings.contactEmail} required className={INPUT} {...aria("contactEmail")} />
        </Field>
        <Field id="contactPhone" label="Phone" error={e.contactPhone}>
          <input id="contactPhone" name="contactPhone" type="tel" defaultValue={settings.contactPhone} className={INPUT} {...aria("contactPhone")} />
        </Field>
        <Field id="address" label="Address" error={e.address}>
          <input id="address" name="address" defaultValue={settings.address} className={INPUT} {...aria("address")} />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4 rounded-lg border border-border p-5">
        <legend className="px-2 text-lg font-semibold">Tax and shipping</legend>
        <Field id="vatPercent" label="VAT (%)" hint="Prices already include VAT. This sets the VAT amount shown on receipts." error={e.vatPercent}>
          <input id="vatPercent" name="vatPercent" type="number" min={0} max={30} step={1} defaultValue={settings.vatPercent} required className={`${INPUT} sm:w-40`} {...aria("vatPercent")} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="standardShipping" label="Standard shipping ($)" error={e.standardShipping}>
            <input id="standardShipping" name="standardShipping" inputMode="decimal" defaultValue={dollars(settings.standardShippingCents)} required className={INPUT} {...aria("standardShipping")} />
          </Field>
          <Field id="expressShipping" label="Express shipping ($)" error={e.expressShipping}>
            <input id="expressShipping" name="expressShipping" inputMode="decimal" defaultValue={dollars(settings.expressShippingCents)} required className={INPUT} {...aria("expressShipping")} />
          </Field>
          <Field id="freeShippingOver" label="Free standard shipping over ($)" hint="0 turns this off." error={e.freeShippingOver}>
            <input id="freeShippingOver" name="freeShippingOver" inputMode="decimal" defaultValue={dollars(settings.freeShippingOverCents)} required className={INPUT} {...aria("freeShippingOver")} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 rounded-lg border border-border p-5">
        <legend className="px-2 text-lg font-semibold">Bank transfer (EFT)</legend>
        <Field id="bankDetails" label="Your bank details" hint="Customers who choose EFT see this after checkout and in their order email. Include the account holder, bank, account number and branch code." error={e.bankDetails}>
          <textarea id="bankDetails" name="bankDetails" rows={4} defaultValue={settings.bankDetails} className={INPUT} {...aria("bankDetails")} />
        </Field>
      </fieldset>

      <fieldset className="flex flex-col gap-4 rounded-lg border border-border p-5">
        <legend className="px-2 text-lg font-semibold">Currency</legend>
        <Field id="zarRate" label="Rands per US dollar" hint="Used to show Rand prices next to dollar prices. Customers are charged in dollars." error={e.zarRate}>
          <input id="zarRate" name="zarRate" inputMode="decimal" defaultValue={(settings.zarPerUsdHundredths / 100).toFixed(2)} required className={`${INPUT} sm:w-40`} {...aria("zarRate")} />
        </Field>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-accent px-6 py-2.5 font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {submitting ? "Saving…" : "Save settings"}
        </button>
        {state.message && (
          <p role={state.status === "error" ? "alert" : "status"} className={state.status === "error" ? "text-red-700 dark:text-red-300" : "text-muted"}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
