export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";

export interface OrderItem {
  productId: number;
  name: string;
  /** Integer cents, snapshotted at purchase time. */
  unitPrice: number;
  qty: number;
}

export interface Order {
  id: number;
  /** Unguessable handle used in the public confirmation URL. */
  token: string;
  name: string;
  email: string;
  /** Multi-line delivery address. */
  address: string;
  items: OrderItem[];
  /** Integer cents. */
  total: number;
  status: OrderStatus;
  /** ISO 8601 string. */
  createdAt: string;
}
