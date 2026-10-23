import Link from "next/link";
import { notFound } from "next/navigation";
import { catalogHref } from "@/features/catalog/catalog-params";
import { formatMoney } from "@/lib/money";
import { getProductImages, getStockStatus, stockLabel } from "@/lib/product-display";
import { parseProductId } from "@/lib/product-id";
import { getProductById, getReviewsForProduct } from "@/lib/product-queries";
import { AddToCart } from "./add-to-cart";
import { ProductGallery } from "./product-gallery";
import { RatingBreakdown } from "./rating-breakdown";
import { summarizeRatings } from "./rating-summary";
import { ReviewForm } from "./review-form";
import { ReviewList } from "./review-list";
import { SpecsTable } from "./specs-table";

const STOCK_TEXT = {
  "in-stock": "text-emerald-700 dark:text-emerald-300",
  "low-stock": "text-amber-700 dark:text-amber-300",
  "out-of-stock": "text-red-700 dark:text-red-300",
} as const;

/** Awaits the params promise, so render it inside <Suspense>. */
export async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id: segment } = await params;
  const id = parseProductId(segment);
  if (id === null) notFound();

  const [product, reviews] = await Promise.all([getProductById(id), getReviewsForProduct(id)]);
  if (!product) notFound();

  const summary = summarizeRatings(reviews);
  const status = getStockStatus(product.stock);

  return (
    <article className="flex flex-col gap-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link href="/" className="hover:text-accent hover:underline">
              Shop
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href={catalogHref({ category: product.category, q: "", sort: "featured" })}
              className="hover:text-accent hover:underline"
            >
              {product.category}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <ProductGallery name={product.name} images={getProductImages(product)} />
        <div className="flex flex-col gap-5">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-muted">{product.category}</p>
            <h1 className="mt-1 text-3xl font-bold leading-tight tracking-tight">{product.name}</h1>
            {summary.average !== null && (
              <a href="#reviews" className="mt-2 inline-block text-sm text-muted hover:text-accent hover:underline">
                ★ {summary.average.toFixed(1)} · {summary.count} {summary.count === 1 ? "review" : "reviews"}
              </a>
            )}
          </div>
          <p className="text-3xl font-bold">{formatMoney(product.price)}</p>
          <p className={`font-medium ${STOCK_TEXT[status]}`}>{stockLabel(product.stock)}</p>
          <p className="leading-relaxed text-muted">{product.description}</p>
          <AddToCart product={product} />
        </div>
      </div>

      <SpecsTable specs={product.specs} />

      <section id="reviews" aria-labelledby="reviews-heading" className="scroll-mt-24">
        <h2 id="reviews-heading" className="mb-4 text-xl font-semibold">
          Customer reviews
        </h2>
        <div className="flex flex-col gap-8">
          <RatingBreakdown summary={summary} />
          <ReviewList reviews={reviews} />
          <ReviewForm productId={product.id} />
        </div>
      </section>
    </article>
  );
}
