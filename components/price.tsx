"use client";

import { useCurrency } from "@/features/currency/currency-provider";
import { salePrice } from "@/lib/money";

interface PriceProps {
  /** List price in integer cents. */
  price: number;
  discountPercent: number;
  /** Larger text for the product page. */
  size?: "md" | "lg";
}

/** What a customer pays, in their chosen currency; when discounted, also the struck-through list price and the percentage. */
export function Price({ price, discountPercent, size = "md" }: PriceProps) {
  const { format } = useCurrency();
  const discounted = discountPercent > 0;
  const current = format(discounted ? salePrice(price, discountPercent) : price);
  const was = format(price);

  return (
    <span className="flex flex-col">
      <span className="flex flex-wrap items-baseline gap-x-2">
        <span className={size === "lg" ? "text-3xl font-bold" : "text-lg font-bold"}>
          {discounted && <span className="sr-only">Sale price </span>}
          {current.main}
        </span>
        {discounted && (
          <>
            <del className="text-sm text-muted">
              <span className="sr-only">Was </span>
              {was.main}
            </del>
            <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
              -{discountPercent}%<span className="sr-only"> off</span>
            </span>
          </>
        )}
      </span>
      {current.alt && (
        <span className={`text-muted ${size === "lg" ? "text-base" : "text-sm"}`}>
          {current.alt}
          {discounted && was.alt && <del className="ml-2 text-xs">{was.alt}</del>}
        </span>
      )}
    </span>
  );
}
