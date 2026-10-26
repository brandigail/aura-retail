import { config } from "dotenv";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { sql } from "drizzle-orm";
import { buildSeedReviews } from "./seed-data/reviews";
import { seedProducts } from "./seed-data/products";

config({ path: ".env.local" });

/** The product's local photos (public/products/<slug>/photo-N.webp), in order. */
function productImages(slug: string): string[] {
  return readdirSync(join(process.cwd(), "public", "products", slug))
    .filter((file) => /^photo-d+.webp$/.test(file))
    .sort()
    .map((file) => `/products/${slug}/${file}`);
}

async function main(): Promise<void> {
  // Imported after dotenv so DATABASE_URL is set when the client is created.
  const { db } = await import("./index");
  const { orders, products, reviews } = await import("./schema");

  const existingOrders = await db.$count(orders);
  if (existingOrders > 0 && !process.argv.includes("--force")) {
    throw new Error(
      `Refusing to reseed: ${existingOrders} order(s) exist and would be deleted. Re-run with --force to wipe them.`,
    );
  }

  await db.execute(sql`truncate table order_notices, order_items, orders, reviews, products restart identity cascade`);

  const inserted = await db
    .insert(products)
    .values(
      seedProducts.map((p) => ({
        slug: p.slug,
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock,
        description: p.description,
        specs: p.specs,
        images: productImages(p.slug),
      })),
    )
    .returning({ id: products.id, slug: products.slug });
  const idBySlug = new Map(inserted.map((p) => [p.slug, p.id]));

  const reviewRows = buildSeedReviews(seedProducts).map(({ productSlug, ...review }) => {
    const productId = idBySlug.get(productSlug);
    if (productId === undefined) throw new Error(`No product for slug ${productSlug}`);
    return { ...review, productId };
  });
  await db.insert(reviews).values(reviewRows);

  console.log(`Seeded ${inserted.length} products and ${reviewRows.length} reviews.`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
