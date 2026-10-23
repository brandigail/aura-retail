import type { Product } from "@/types/product";

export const PLACEHOLDER_IMAGE = "/products/placeholder.svg";
export const LOW_STOCK_THRESHOLD = 5;

export type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return "out-of-stock";
  return stock <= LOW_STOCK_THRESHOLD ? "low-stock" : "in-stock";
}

export function stockLabel(stock: number): string {
  const status = getStockStatus(stock);
  if (status === "out-of-stock") return "Out of stock";
  return status === "low-stock" ? `Only ${stock} left` : "In stock";
}

/** Local images only; products without photos use the local placeholder. */
export function getProductImages(product: Pick<Product, "images">): string[] {
  return product.images.length > 0 ? product.images : [PLACEHOLDER_IMAGE];
}
