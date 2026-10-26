export interface SeedProduct {
  slug: string;
  name: string;
  category: string;
  /** Integer cents. */
  price: number;
  stock: number;
  description: string;
  specs: Record<string, string>;
}

/** Seed files list products without a slug; it is derived from the name. */
export type RawSeedProduct = Omit<SeedProduct, "slug" | "category">;
