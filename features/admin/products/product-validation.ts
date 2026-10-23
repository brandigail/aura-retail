import { dollarsToCents } from "@/lib/money";

export const PRODUCT_LIMITS = {
  name: { min: 2, max: 120 },
  slug: { max: 80 },
  category: { min: 2, max: 40 },
  maxPriceCents: 10_000_000,
  maxStock: 100_000,
  description: { max: 2000 },
  maxSpecs: 20,
  specKey: { max: 40 },
  specValue: { max: 120 },
  maxImages: 8,
} as const;

export const PRODUCT_FIELDS = ["name", "slug", "category", "price", "stock", "description", "specs", "images"] as const;
export type ProductField = (typeof PRODUCT_FIELDS)[number];

export interface ProductInput {
  name: string;
  slug: string;
  category: string;
  /** Integer cents. */
  price: number;
  stock: number;
  description: string;
  specs: Record<string, string>;
  images: string[];
}

export type ProductValidation =
  | { ok: true; value: ProductInput }
  | { ok: false; errors: Partial<Record<ProductField, string>>; values: Record<ProductField, string> };

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
/** Local files only, per project rules: no external URLs, no path tricks. */
const LOCAL_IMAGE_PATTERN = /^\/products\/(?:[a-z0-9][a-z0-9_-]*\/)*[a-z0-9][a-z0-9_.-]*\.(?:webp|png|jpe?g|avif|svg)$/i;

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, PRODUCT_LIMITS.slug.max)
    .replace(/-+$/, "");
}

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

/** One `Key: Value` per line. Returns an error message instead of specs when a line is malformed. */
export function parseSpecs(raw: string): Record<string, string> | string {
  const specs: Record<string, string> = {};
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length > PRODUCT_LIMITS.maxSpecs) return `At most ${PRODUCT_LIMITS.maxSpecs} specifications.`;
  for (const line of lines) {
    const colon = line.indexOf(":");
    const key = colon > 0 ? line.slice(0, colon).trim() : "";
    const value = colon > 0 ? line.slice(colon + 1).trim() : "";
    if (!key || !value) return `"${line.slice(0, 40)}" must look like "Name: value".`;
    if (key.length > PRODUCT_LIMITS.specKey.max) return `Spec names must be at most ${PRODUCT_LIMITS.specKey.max} characters.`;
    if (value.length > PRODUCT_LIMITS.specValue.max) return `Spec values must be at most ${PRODUCT_LIMITS.specValue.max} characters.`;
    if (key in specs) return `"${key}" is listed twice.`;
    specs[key] = value;
  }
  return specs;
}

/** One local image path per line. */
export function parseImages(raw: string): string[] | string {
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length > PRODUCT_LIMITS.maxImages) return `At most ${PRODUCT_LIMITS.maxImages} images.`;
  for (const line of lines) {
    if (!LOCAL_IMAGE_PATTERN.test(line) || line.includes("..")) {
      return `"${line.slice(0, 50)}" is not a local image path. Use a file under /products/, e.g. /products/my-product/1.webp.`;
    }
  }
  return [...new Set(lines)];
}

/** The trimmed text of every product field, used to refill the form after an error. */
export function readProductValues(formData: FormData): Record<ProductField, string> {
  return {
    name: text(formData, "name"),
    slug: text(formData, "slug"),
    category: text(formData, "category"),
    price: text(formData, "price"),
    stock: text(formData, "stock"),
    description: text(formData, "description"),
    specs: text(formData, "specs"),
    images: text(formData, "images"),
  };
}

export function validateProduct(formData: FormData): ProductValidation {
  const values = readProductValues(formData);
  const errors: Partial<Record<ProductField, string>> = {};
  const L = PRODUCT_LIMITS;

  if (values.name.length < L.name.min || values.name.length > L.name.max) {
    errors.name = `Name must be ${L.name.min} to ${L.name.max} characters.`;
  }

  const slug = values.slug || slugify(values.name);
  if (!slug || slug.length > L.slug.max || !SLUG_PATTERN.test(slug)) {
    errors.slug = "Use lowercase letters, numbers and single hyphens, e.g. my-product.";
  }

  if (values.category.length < L.category.min || values.category.length > L.category.max) {
    errors.category = `Category must be ${L.category.min} to ${L.category.max} characters.`;
  }

  const price = dollarsToCents(values.price);
  if (price === null || price > L.maxPriceCents) errors.price = "Enter a price like 49.99 (at most $100,000).";

  const stock = /^\d{1,6}$/.test(values.stock) ? Number(values.stock) : null;
  if (stock === null || stock > L.maxStock) errors.stock = `Enter a whole number from 0 to ${L.maxStock}.`;

  if (values.description.length > L.description.max) {
    errors.description = `Description must be at most ${L.description.max} characters.`;
  }

  const specs = parseSpecs(values.specs);
  if (typeof specs === "string") errors.specs = specs;

  const images = parseImages(values.images);
  if (typeof images === "string") errors.images = images;

  if (
    Object.keys(errors).length > 0 ||
    price === null ||
    stock === null ||
    typeof specs === "string" ||
    typeof images === "string"
  ) {
    return { ok: false, errors, values };
  }
  return { ok: true, value: { name: values.name, slug, category: values.category, price, stock, description: values.description, specs, images } };
}
