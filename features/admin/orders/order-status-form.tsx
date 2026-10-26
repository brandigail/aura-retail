"use client";

import { useActionState } from "react";
import type { OrderStatus } from "@/types/order";
import { updateOrderStatus, type OrderStatusState } from "./order-actions";

const initialState: OrderStatusState = { status: "idle", message: "" };

const LABELS: Record<OrderStatus, string> = {
  pending: "Mark as pending",
  paid: "Mark as paid",
  shipped: "Mark as shipped",
  cancelled: "Cancel order and restore stock",
};

/** One button per allowed next status; final orders show nothing to do. */
export function OrderStatusForm({ orderId, next }: { orderId: number; next: readonly OrderStatus[] }) {
  const [state, formAction, submitting] = useActionState(updateOrderStatus.bind(null, orderId), initialState);

  if (next.length === 0 && !state.message) return <p className="text-sm text-muted">This order is final; its status can&apos;t change.</p>;

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {next.map((status) => (
          <button
            key={status}
            type="submit"
            name="status"
            value={status}
            disabled={submitting}
            className={
              status === "cancelled"
                ? "rounded-md border border-red-600 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-surface disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent dark:text-red-300"
                : "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90 disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            }
          >
            {submitting ? "Saving…" : LABELS[status]}
          </button>
        ))}
      </div>
      {state.message && (
        <p role={state.status === "error" ? "alert" : "status"} className={`text-sm ${state.status === "error" ? "text-red-700 dark:text-red-300" : "text-muted"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
