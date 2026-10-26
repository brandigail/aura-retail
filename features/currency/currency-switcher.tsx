"use client";

import { useId } from "react";
import { CURRENCY_MODES, type CurrencyMode } from "./currency-store";
import { useCurrency } from "./currency-provider";

/** Lets a shopper or the owner choose how prices are shown. The choice is remembered in this browser. */
export function CurrencySwitcher({ className = "" }: { className?: string }) {
  const { mode, setMode } = useCurrency();
  const id = useId();

  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">Show prices in</label>
      <select
        id={id}
        value={mode}
        onChange={(event) => setMode(event.target.value as CurrencyMode)}
        className="h-10 rounded-md border border-border bg-background px-2 text-sm font-medium hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {CURRENCY_MODES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
