export interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  /** Integer cents. */
  price: number;
  stock: number;
  description: string;
  specs: Record<string, string>;
  /** Local paths under /public, e.g. /products/<slug>/1.webp. */
  images: string[];
}

/** A product plus its review aggregate, for catalog cards. */
export interface ProductSummary extends Product {
  /** Average rating rounded to one decimal; null when there are no reviews. */
  ratingAvg: number | null;
  ratingCount: number;
}
