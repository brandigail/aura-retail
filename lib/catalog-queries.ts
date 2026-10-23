import { and, asc, desc, eq, getTableColumns, ilike, isNull, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import type { CatalogFilters } from "@/features/catalog/catalog-params";
import type { ProductSummary } from "@/types/product";

/** Escapes LIKE wildcards so user input is matched literally. */
function escapeLike(input: string): string {
  return input.replace(/[\\%_]/g, "\\$&");
}

export async function getCategories(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ category: products.category })
    .from(products)
    .where(isNull(products.deletionRequestedAt))
    .orderBy(asc(products.category));
  return rows.map((row) => row.category);
}

export async function getProductSummaries(filters: CatalogFilters): Promise<ProductSummary[]> {
  const ratings = db
    .select({
      productId: reviews.productId,
      avg: sql<number>`round(avg(${reviews.rating}), 1)::float8`.as("rating_avg"),
      count: sql<number>`count(*)::int`.as("rating_count"),
    })
    .from(reviews)
    .groupBy(reviews.productId)
    .as("ratings");

  // Products being withdrawn are hidden from the store.
  const conditions: SQL[] = [isNull(products.deletionRequestedAt)];
  if (filters.category) conditions.push(eq(products.category, filters.category));
  if (filters.q) {
    const pattern = `%${escapeLike(filters.q)}%`;
    const match = or(
      ilike(products.name, pattern),
      ilike(products.description, pattern),
      ilike(products.category, pattern),
    );
    if (match) conditions.push(match);
  }

  const orderBy = {
    featured: [asc(products.id)],
    "price-asc": [asc(products.price), asc(products.id)],
    "price-desc": [desc(products.price), asc(products.id)],
    rating: [sql`coalesce(${ratings.avg}, 0) desc`, desc(ratings.count), asc(products.id)],
    name: [asc(products.name)],
  }[filters.sort];

  const rows = await db
    .select({ ...getTableColumns(products), ratingAvg: ratings.avg, ratingCount: ratings.count })
    .from(products)
    .leftJoin(ratings, eq(ratings.productId, products.id))
    .where(and(...conditions))
    .orderBy(...orderBy);

  return rows.map((row) => ({ ...row, ratingCount: row.ratingCount ?? 0 }));
}
