export interface WishlistProduct {
  id: number;
  slug: string;
  name: string;
  category: string;
  /** Integer cents, list price. */
  price: number;
  discountPercent: number;
  stock: number;
  image: string;
}

export interface WishlistState {
  status: "idle" | "ready" | "error";
  products: WishlistProduct[];
}

export const EMPTY_WISHLIST: WishlistState = { status: "idle", products: [] };
