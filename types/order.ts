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
  /** Integer cents: subtotal - discountCents + shippingCents. */
  total: number;
  /** Integer cents, before discount. 0 on orders placed before pricing was itemised. */
  subtotal: number;
  discountCents: number;
  discountCode: string | null;
  shippingCents: number;
  shippingMethod: string | null;
  /** The VAT contained in `total`. */
  vatCents: number;
  paymentMethod: string | null;
  paymentRef: string | null;
  status: OrderStatus;
  /** ISO 8601 string. */
  createdAt: string;
}

/** A message to the customer about an open order. */
export interface OrderNotice {
  id: number;
  kind: "product_removed";
  /** Name as it was when the notice was created; the product itself may be gone by now. */
  productName: string;
  /** ISO 8601 string, or null while the customer has not accepted it. */
  acknowledgedAt: string | null;
}
