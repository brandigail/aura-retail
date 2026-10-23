export interface SeedProduct {
  slug: string;
  name: string;
  category: string;
  /** Integer cents. */
  price: number;
  stock: number;
  description: string;
  specs: Record<string, string>;
  /** Which illustration in scripts/illustrations to draw for this product. */
  art: string;
  /** Colour hue (0-360) used to tint that illustration. */
  hue: number;
}

/** Seed files list products without a slug; it is derived from the name. */
export type RawSeedProduct = Omit<SeedProduct, "slug" | "category">;
