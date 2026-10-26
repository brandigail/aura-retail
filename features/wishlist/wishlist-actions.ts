"use server";

import { and, inArray, isNull } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getProductImages } from "@/lib/product-display";
import type { WishlistState } from "./wishlist-types";

const MAX_IDS = 100;

/** Looks up the saved products that are still for sale, in the order they were saved. */
export async function getWishlistProducts(ids: number[]): Promise<WishlistState> {
  const valid = [...new Set(ids.filter((id) => Number.isInteger(id) && id > 0))].slice(0, MAX_IDS);
  if (valid.length === 0) return { status: "ready", products: [] };

  try {
    const rows = await db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        category: products.category,
        price: products.price,
        discountPercent: products.discountPercent,
        stock: products.stock,
        images: products.images,
      })
      .from(products)
      .where(and(inArray(products.id, valid), isNull(products.deletionRequestedAt)));

    const byId = new Map(rows.map((r) => [r.id, r]));
    const ordered = valid.flatMap((id) => {
      const row = byId.get(id);
      if (!row) return [];
      const { images, ...rest } = row;
      return [{ ...rest, image: getProductImages({ images })[0] }];
    });
    return { status: "ready", products: ordered };
  } catch {
    return { status: "error", products: [] };
  }
}
