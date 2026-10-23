import { slugify } from "@/features/admin/products/product-validation";
import type { RawSeedProduct, SeedProduct } from "../types";
import { craftsProducts } from "./crafts";
import { electronicsProducts } from "./electronics";
import { gardenProducts } from "./garden";
import { homeProducts } from "./home";
import { kitchenProducts } from "./kitchen";
import { outdoorsProducts } from "./outdoors";
import { petsProducts } from "./pets";
import { stationeryProducts } from "./stationery";
import { swimProducts } from "./swim";
import { toysProducts } from "./toys";

const categories: Array<{ name: string; products: RawSeedProduct[] }> = [
  { name: "Kitchen & Cooking", products: kitchenProducts },
  { name: "Toys & Games", products: toysProducts },
  { name: "Knitting & Crafts", products: craftsProducts },
  { name: "Swimming & Water Sports", products: swimProducts },
  { name: "Sports & Outdoors", products: outdoorsProducts },
  { name: "Home & Living", products: homeProducts },
  { name: "Garden & DIY", products: gardenProducts },
  { name: "Pet Supplies", products: petsProducts },
  { name: "Stationery & Office", products: stationeryProducts },
  { name: "Electronics", products: electronicsProducts },
];

/**
 * Interleaved by category, so the default "featured" order (by id) shows a mix of departments
 * on the first screen instead of a whole category at a time.
 */
function build(): SeedProduct[] {
  const rounds = Math.max(...categories.map((c) => c.products.length));
  const all: SeedProduct[] = [];
  for (let i = 0; i < rounds; i++) {
    for (const { name, products } of categories) {
      const raw = products[i];
      if (raw) all.push({ ...raw, category: name, slug: slugify(raw.name) });
    }
  }

  const slugs = new Set<string>();
  for (const { slug, name } of all) {
    if (slugs.has(slug)) throw new Error(`Duplicate seed slug "${slug}" (${name})`);
    slugs.add(slug);
  }
  return all;
}

export const seedProducts: SeedProduct[] = build();
