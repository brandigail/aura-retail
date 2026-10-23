/**
 * Draws two illustrations per seed product into public/products/<slug>/ (1.svg main, 2.svg detail card).
 * Run with `npm run images`. Replace the generated files with real photos whenever you have them.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { seedProducts } from "../db/seed-data/products";
import { illustrations } from "./illustrations";
import { renderDetail, renderMain } from "./illustrations/render";

const outRoot = join(process.cwd(), "public", "products");

const unknown = seedProducts.filter((p) => !illustrations[p.art]);
if (unknown.length > 0) {
  throw new Error(`No illustration for: ${unknown.map((p) => `${p.name} (art: ${p.art})`).join(", ")}`);
}

for (const product of seedProducts) {
  const draw = illustrations[product.art];
  const dir = join(outRoot, product.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "1.svg"), renderMain(product.name, product.hue, draw));
  writeFileSync(join(dir, "2.svg"), renderDetail(product.name, product.hue, draw, Object.entries(product.specs)));
}

const used = new Set(seedProducts.map((p) => p.art));
const spare = Object.keys(illustrations).filter((key) => !used.has(key));
console.log(`Wrote ${seedProducts.length * 2} images for ${seedProducts.length} products.`);
if (spare.length > 0) console.log(`Unused illustrations: ${spare.join(", ")}`);
