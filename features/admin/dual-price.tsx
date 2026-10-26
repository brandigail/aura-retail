"use client";

import { useCurrency } from "@/features/currency/currency-provider";

interface DualPriceProps {
  /** Integer USD cents. */
  cents: number;
  className?: string;
}

/** An amount in the owner's chosen currency; with both selected, dollars with Rands underneath. */
export function DualPrice({ cents, className = "" }: DualPriceProps) {
  const { main, alt } = useCurrency().format(cents);
  return (
    <span className={`flex flex-col ${className}`}>
      <span className="font-medium">{main}</span>
      {alt && <span className="text-xs text-muted">{alt}</span>}
    </span>
  );
}
