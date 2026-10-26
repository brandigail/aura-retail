import { formatMoney, formatZar } from "@/lib/money";

interface DualPriceProps {
  /** Integer USD cents. */
  cents: number;
  /** Rands per US dollar. */
  zarRate: number;
  className?: string;
}

/** An amount in US dollars with its Rand equivalent underneath. */
export function DualPrice({ cents, zarRate, className = "" }: DualPriceProps) {
  return (
    <span className={`flex flex-col ${className}`}>
      <span className="font-medium">{formatMoney(cents)}</span>
      <span className="text-xs text-muted">{formatZar(cents, zarRate)}</span>
    </span>
  );
}
