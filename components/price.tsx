"use client";

import { useZarRate } from "@/features/currency/currency-provider";
import { formatMoney, formatZar, salePrice } from "@/lib/money";

interface PriceProps {
  /** List price in integer cents. */
  price: number;
  discountPercent: number;
  /** Larger text for the product page. */
  size?: "md" | "lg";
}

/** The price a customer pays in dollars and Rands; when discounted, also the struck-through list price and the percentage. */
export function Price({ price, discountPercent, size = "md" }: PriceProps) {
  const rate = useZarRate();
  const discounted = discountPercent > 0;
  const current = discounted ? salePrice(price, discountPercent) : price;

  return (
    <span className="flex flex-col">
      <span className="flex flex-wrap items-baseline gap-x-2">
        <span className={size === "lg" ? "text-3xl font-bold" : "text-lg font-bold"}>
          {discounted && <span className="sr-only">Sale price </span>}
          {formatMoney(current)}
        </span>
        {discounted && (
          <>
            <del className="text-sm text-muted">
              <span className="sr-only">Was </span>
              {formatMoney(price)}
            </del>
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
              -{discountPercent}%<span className="sr-only"> off</span>
            </span>
          </>
        )}
      </span>
      <span className={`text-muted ${size === "lg" ? "text-base" : "text-sm"}`}>
        {formatZar(current, rate)}
        {discounted && <del className="ml-2 text-xs">{formatZar(price, rate)}</del>}
      </span>
    </span>
  );
}
