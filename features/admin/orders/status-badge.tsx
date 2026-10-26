import type { OrderStatus } from "@/types/order";

const STYLES: Record<OrderStatus, string> = {
  pending: "border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-300",
  paid: "border-accent text-accent",
  shipped: "border-green-700 text-green-700 dark:border-green-400 dark:text-green-300",
  cancelled: "border-red-600 text-red-700 dark:border-red-400 dark:text-red-300",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${STYLES[status]}`}>{status}</span>;
}
