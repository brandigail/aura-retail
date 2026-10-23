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
