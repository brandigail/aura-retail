import { isNull } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getProductImages } from "@/lib/product-display";
import { getProductSummaries } from "@/lib/catalog-queries";
import type { ProductSummary } from "@/types/product";

export interface CategoryTile {
  category: string;
  count: number;
  /** Local image of the category's first product. */
  image: string;
}

export interface HomeSections {
  categories: CategoryTile[];
  /** Products currently on sale, biggest discount first. */
  onSale: ProductSummary[];
  topRated: ProductSummary[];
}

const ROW_SIZE = 4;

export async function getHomeSections(): Promise<HomeSections> {
  const [rows, ranked] = await Promise.all([
    db
      .select({ id: products.id, category: products.category, images: products.images })
      .from(products)
      .where(isNull(products.deletionRequestedAt))
      .orderBy(products.id),
    getProductSummaries({ category: null, q: "", sort: "rating" }),
  ]);

  const tiles = new Map<string, CategoryTile>();
  for (const row of rows) {
    const tile = tiles.get(row.category);
    if (tile) tile.count += 1;
    else tiles.set(row.category, { category: row.category, count: 1, image: getProductImages({ images: row.images })[0] });
  }

  return {
    categories: [...tiles.values()].sort((a, b) => a.category.localeCompare(b.category)),
    onSale: ranked
      .filter((p) => p.discountPercent > 0 && p.stock > 0)
      .sort((a, b) => b.discountPercent - a.discountPercent)
      .slice(0, ROW_SIZE),
    topRated: ranked.filter((p) => p.ratingAvg !== null && p.stock > 0).slice(0, ROW_SIZE),
  };
}
