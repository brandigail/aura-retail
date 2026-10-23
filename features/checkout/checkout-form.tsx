"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useCart } from "@/features/cart/cart-provider";
import { formatMoney } from "@/lib/money";
import { placeOrder } from "./place-order";
import { initialCheckoutState, type CheckoutConflict, type CheckoutField } from "./checkout-types";
import { CHECKOUT_LIMITS } from "./checkout-validation";

const inputClass =
  "w-full rounded-md border border-border bg-background px-3 py-2.5 text-base placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[invalid=true]:border-red-600 dark:aria-[invalid=true]:border-red-400";

function conflictText(c: CheckoutConflict): string {
  switch (c.reason) {
    case "unavailable":
      return `${c.name} is no longer available and will be removed.`;
    case "stock":
      return `${c.name}: only ${c.stock} in stock (you wanted ${c.requested}).`;
    case "price":
      return `${c.name}: the price is now ${formatMoney(c.unitPrice)}.`;
  }
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, clearCart, reconcileItems } = useCart();
  const [state, formAction, pending] = useActionState(placeOrder, initialCheckoutState);
  const [resolved, setResolved] = useState<typeof state | null>(null);

  useEffect(() => {
    if (state.status !== "success" || !state.token) return;
    clearCart();
    router.push(`/orders/${state.token}`);
  }, [state, clearCart, router]);

  const { values, errors } = state;
  const showConflicts = state.status === "conflict" && resolved !== state;
  const cartPayload = JSON.stringify(items.map(({ productId, qty, unitPrice }) => ({ productId, qty, unitPrice })));

  function fieldProps(field: CheckoutField) {
    return {
      id: `checkout-${field}`,
      name: field,
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": errors[field] ? `checkout-${field}-error` : undefined,
    } as const;
  }

  function error(field: CheckoutField) {
    return errors[field] ? (
      <p id={`checkout-${field}-error`} className="mt-1 text-sm text-red-700 dark:text-red-300">
        {errors[field]}
      </p>
    ) : null;
  }

  function applyConflicts(): void {
    reconcileItems(state.conflicts.map(({ productId, unitPrice, stock }) => ({ productId, unitPrice, stock })));
    setResolved(state);
  }

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold">Delivery details</h2>

      {showConflicts && (
        <div role="alert" className="rounded-lg border border-amber-600 bg-amber-50 p-4 text-amber-900 dark:border-amber-400 dark:bg-amber-950 dark:text-amber-100">
          <p className="font-semibold">{state.message}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {state.conflicts.map((c) => (
              <li key={c.productId}>{conflictText(c)}</li>
            ))}
          </ul>
          <button
            type="button"
            onClick={applyConflicts}
            className="mt-3 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Update my cart
          </button>
        </div>
      )}

      <div>
        <label htmlFor="checkout-name" className="mb-1 block text-sm font-medium">
          Full name
        </label>
        <input
          {...fieldProps("name")}
          type="text"
          autoComplete="name"
          maxLength={CHECKOUT_LIMITS.name.max}
          defaultValue={values.name}
          className={inputClass}
        />
        {error("name")}
      </div>

      <div>
        <label htmlFor="checkout-email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          {...fieldProps("email")}
          type="email"
          autoComplete="email"
          maxLength={CHECKOUT_LIMITS.email.max}
          defaultValue={values.email}
          className={inputClass}
        />
        {error("email")}
      </div>

      <div>
        <label htmlFor="checkout-address" className="mb-1 block text-sm font-medium">
          Delivery address
        </label>
        <textarea
          {...fieldProps("address")}
          rows={4}
          autoComplete="street-address"
          maxLength={CHECKOUT_LIMITS.address.max}
          placeholder={"Street and number\nCity, postal code\nCountry"}
          defaultValue={values.address}
          className={inputClass}
        />
        {error("address")}
      </div>

      <input type="hidden" name="items" value={cartPayload} />
      {/* Honeypot for bots; hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label htmlFor="checkout-website">Leave this empty</label>
        <input id="checkout-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={pending || state.status === "success"}
          className="h-12 rounded-md bg-accent px-6 font-semibold text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {pending || state.status === "success" ? "Placing order…" : "Place order"}
        </button>
        <p role={state.status === "error" ? "alert" : "status"} className="min-h-5 text-sm text-red-700 dark:text-red-300">
          {state.status === "error" ? state.message : ""}
        </p>
        <p className="text-sm text-muted">Demo store: no payment is taken and no email is sent.</p>
      </div>
    </form>
  );
}
