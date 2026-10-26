import type { OrderStatus } from "@/types/order";

export interface MyOrderItem {
  name: string;
  qty: number;
  /** Local image path of the product, or the placeholder if the product no longer exists. */
  image: string;
}

/** What the "Your orders" list needs about one order. */
export interface MyOrder {
  id: number;
  token: string;
  /** ISO 8601. */
  createdAt: string;
  status: OrderStatus;
  /** Integer cents. */
  total: number;
  items: MyOrderItem[];
}

export interface MyOrdersState {
  status: "idle" | "ready" | "error";
  orders: MyOrder[];
}

export const initialMyOrdersState: MyOrdersState = { status: "idle", orders: [] };
