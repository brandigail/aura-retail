export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  /** Integer cents. */
  unitPrice: number;
  qty: number;
  /** Stock at the time the item was added; the server re-checks at checkout. */
  stock: number;
  /** Local path under /public, or null to show a placeholder. */
  image: string | null;
}
