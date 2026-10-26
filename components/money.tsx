"use client";

import { useZarRate } from "@/features/currency/currency-provider";
import { formatMoney, formatZar } from "@/lib/money";

interface MoneyProps {
  /** Integer USD cents. */
  cents: number;
  /** Puts the Rand amount on its own line under the dollars. Default is inline after them. */
  stacked?: boolean;
  className?: string;
}

/** A price in US dollars with its approximate Rand equivalent. Customers are charged in dollars. */
export function Money({ cents, stacked = false, className = "" }: MoneyProps) {
  const rand = formatZar(cents, useZarRate());

  if (stacked) {
    return (
      <span className={`inline-flex flex-col ${className}`}>
        <span>{formatMoney(cents)}</span>
        <span className="text-[0.75em] font-normal text-muted">{rand}</span>
      </span>
    );
  }
  return (
    <span className={className}>
      {formatMoney(cents)} <span className="text-[0.8em] font-normal text-muted">({rand})</span>
    </span>
  );
}
