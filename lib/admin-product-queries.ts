import { and, asc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getProductImages } from "@/lib/product-display";

export interface AdminProductRow {
  id: number;
  slug: string;
  name: string;
  category: string;
  /** Integer cents. */
  price: number;
  /** Whole-percent sale discount off `price`. */
  discountPercent: number;
  stock: number;
  /** First product image, or the local placeholder. */
  image: string;
  imageCount: number;
  /** Set while the product is being withdrawn pending customer acknowledgments. */
  deletionRequestedAt: Date | null;
}

export async function listAdminProducts(): Promise<AdminProductRow[]> {
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
      deletionRequestedAt: products.deletionRequestedAt,
    })
    .from(products)
    .orderBy(asc(products.id));
  return rows.map(({ images, ...row }) => ({ ...row, image: getProductImages({ images })[0], imageCount: images.length }));
}

/** Includes products pending deletion, unlike the public lookup. */
export async function getAdminProduct(id: number) {
  const [row] = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return row ?? null;
}

export async function getAllCategories(): Promise<string[]> {
  const rows = await db.selectDistinct({ category: products.category }).from(products).orderBy(asc(products.category));
  return rows.map((r) => r.category);
}

export async function slugTaken(slug: string, exceptId?: number): Promise<boolean> {
  const condition = exceptId === undefined ? eq(products.slug, slug) : and(eq(products.slug, slug), ne(products.id, exceptId));
  const [row] = await db.select({ id: products.id }).from(products).where(condition).limit(1);
  return row !== undefined;
}
