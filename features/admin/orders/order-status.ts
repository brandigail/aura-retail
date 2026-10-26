import type { OrderStatus } from "@/types/order";

/** Which statuses an order may move to from each status. Shipped and cancelled orders are final. */
export const NEXT_STATUSES: Record<OrderStatus, readonly OrderStatus[]> = {
  pending: ["paid", "cancelled"],
  paid: ["shipped", "cancelled"],
  shipped: [],
  cancelled: [],
};

export const ALL_STATUSES: readonly OrderStatus[] = ["pending", "paid", "shipped", "cancelled"];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ALL_STATUSES as readonly string[]).includes(value);
}
