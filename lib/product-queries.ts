import { and, desc, eq, isNull } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import type { Product } from "@/types/product";
import type { Rating, Review } from "@/types/review";

/** The public `Product` shape; internal columns like deletionRequestedAt never leave the server. */
export const productColumns = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  category: products.category,
  price: products.price,
  stock: products.stock,
  description: products.description,
  specs: products.specs,
  images: products.images,
};

function isRating(value: number): value is Rating {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

/**
 * Public lookup: products being withdrawn count as not found.
 * Deduped per request, so generateMetadata and the page share one query.
 */
export const getProductById = cache(async (id: number): Promise<Product | null> => {
  const [row] = await db
    .select(productColumns)
    .from(products)
    .where(and(eq(products.id, id), isNull(products.deletionRequestedAt)))
    .limit(1);
  return row ?? null;
});

export async function getReviewsForProduct(productId: number): Promise<Review[]> {
  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt), desc(reviews.id));

  return rows.flatMap((row) =>
    isRating(row.rating) ? [{ ...row, rating: row.rating, createdAt: row.createdAt.toISOString() }] : [],
  );
}
