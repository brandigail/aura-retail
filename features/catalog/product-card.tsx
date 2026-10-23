import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { formatMoney } from "@/lib/money";
import { getProductImages, getStockStatus, stockLabel, type StockStatus } from "@/lib/product-display";
import type { ProductSummary } from "@/types/product";

const STOCK_STYLES: Record<StockStatus, string> = {
  "in-stock": "border-border text-muted",
  "low-stock": "border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-300",
  "out-of-stock": "border-red-600 text-red-700 dark:border-red-400 dark:text-red-300",
};

export function ProductCard({ product, priority = false }: { product: ProductSummary; priority?: boolean }) {
  const status = getStockStatus(product.stock);
  const [image] = getProductImages(product);

  return (
    <li>
      <Link
        href={`/products/${product.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <div className="relative aspect-[4/3] bg-surface">
          <Image
            src={image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className={`object-cover ${status === "out-of-stock" ? "opacity-60" : ""}`}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{product.category}</p>
          <h2 className="text-base font-semibold leading-snug group-hover:text-accent">{product.name}</h2>
          <p className="flex items-center gap-1 text-sm text-muted">
            {product.ratingAvg !== null ? (
              <>
                <Star aria-hidden className="size-4 fill-amber-400 text-amber-400" />
                <span>
                  <span className="sr-only">Rated </span>
                  {product.ratingAvg.toFixed(1)}
                  <span className="sr-only"> out of 5,</span> ({product.ratingCount}
                  <span className="sr-only"> reviews</span>)
                </span>
              </>
            ) : (
              <span>No reviews yet</span>
            )}
          </p>
          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <span className="text-lg font-bold">{formatMoney(product.price)}</span>
            <span className={`whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium ${STOCK_STYLES[status]}`}>
              {stockLabel(product.stock)}
            </span>
          </div>
        </div>
      </Link>
    </li>
  );
}
