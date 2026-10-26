"use client";

import { Money } from "@/components/money";
import type { ShippingMethod } from "@/lib/order-pricing";

interface ShippingOptionsProps {
  value: ShippingMethod;
  onChange: (method: ShippingMethod) => void;
  /** Integer cents; 0 means free. */
  standardCents: number;
  expressCents: number;
  /** Shown as a nudge when the customer is close to free delivery. */
  freeOverCents: number;
}

export function ShippingOptions({ value, onChange, standardCents, expressCents, freeOverCents }: ShippingOptionsProps) {
  const options: { id: ShippingMethod; title: string; time: string; cents: number }[] = [
    { id: "standard", title: "Standard delivery", time: "3 to 5 working days", cents: standardCents },
    { id: "express", title: "Express delivery", time: "1 to 2 working days", cents: expressCents },
  ];

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-1 text-xl font-semibold">Delivery method</legend>
      {/* The radios only drive the UI. What the server receives is this hidden field, which the browser's form reset can't undo. */}
      <input type="hidden" name="shippingMethod" value={value} />
      {options.map((option) => (
        <label
          key={option.id}
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border p-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
            value === option.id ? "border-accent bg-accent/5" : "border-border hover:bg-surface"
          }`}
        >
          <span className="flex items-center gap-3">
            <input type="radio" name="shipping-choice" value={option.id} checked={value === option.id} onChange={() => onChange(option.id)} className="size-4 accent-[#008080]" />
            <span>
              <span className="block font-medium">{option.title}</span>
              <span className="block text-sm text-muted">{option.time}</span>
            </span>
          </span>
          <span className="text-right font-semibold">
            {option.cents === 0 ? <span className="text-accent-text">Free</span> : <Money cents={option.cents} stacked className="items-end" />}
          </span>
        </label>
      ))}
      {freeOverCents > 0 && standardCents > 0 && (
        <p className="text-sm text-muted">Standard delivery is free on orders over <Money cents={freeOverCents} />.</p>
      )}
    </fieldset>
  );
}
