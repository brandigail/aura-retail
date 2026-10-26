import type { OrderStatus } from "@/types/order";

/** What a customer reads for each order status. */
export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Waiting for payment",
  paid: "Paid, being packed",
  shipped: "On its way",
  cancelled: "Cancelled",
};
