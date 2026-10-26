"use client";

import { useCurrency } from "@/features/currency/currency-provider";

interface MoneyProps {
  /** Integer USD cents. */
  cents: number;
  /** Puts the second currency on its own line under the first. Default is inline after it. */
  stacked?: boolean;
  className?: string;
}

/** A price shown in the viewer's chosen currency (dollars, Rands, or both). Customers are charged in dollars. */
export function Money({ cents, stacked = false, className = "" }: MoneyProps) {
  const { main, alt } = useCurrency().format(cents);

  if (alt === null) return <span className={className}>{main}</span>;
  if (stacked) {
    return (
      <span className={`inline-flex flex-col ${className}`}>
        <span>{main}</span>
        <span className="text-[0.75em] font-normal text-muted">{alt}</span>
      </span>
    );
  }
  return (
    <span className={className}>
      {main} <span className="text-[0.8em] font-normal text-muted">({alt})</span>
    </span>
  );
}
