"use server";

import { eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { queueOrderEmail } from "@/lib/emails";
import { NEXT_STATUSES, isOrderStatus } from "./order-status";

export interface OrderStatusState {
  status: "idle" | "ok" | "error";
  message: string;
}

export async function updateOrderStatus(orderId: number, _previous: OrderStatusState, formData: FormData): Promise<OrderStatusState> {
  await requireAdmin();

  const next = formData.get("status");
  if (!isOrderStatus(next)) return { status: "error", message: "Choose a status." };

  try {
    const [order] = await db.select({ status: orders.status }).from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) return { status: "error", message: "That order no longer exists." };
    if (!NEXT_STATUSES[order.status].includes(next)) {
      return { status: "error", message: `An order that is ${order.status} can't be marked ${next}.` };
    }

    if (next === "cancelled") {
      // Stock goes back on the shelf in the same transaction as the status change.
      const items = await db.select({ productId: orderItems.productId, qty: orderItems.qty }).from(orderItems).where(eq(orderItems.orderId, orderId));
      const existing = items.length === 0 ? [] : await db.select({ id: products.id }).from(products).where(inArray(products.id, items.map((i) => i.productId)));
      const live = new Set(existing.map((p) => p.id));
      await db.batch([
        db.update(orders).set({ status: next }).where(eq(orders.id, orderId)),
        ...items
          .filter((i) => live.has(i.productId))
          .map((i) => db.update(products).set({ stock: sql`${products.stock} + ${i.qty}` }).where(eq(products.id, i.productId))),
      ]);
    } else {
      await db.update(orders).set({ status: next }).where(eq(orders.id, orderId));
    }

    if (next === "shipped") await queueOrderEmail(orderId, "order_shipped");
    if (next === "cancelled") await queueOrderEmail(orderId, "order_cancelled");

    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    if (next === "cancelled") revalidatePath("/");
    return { status: "ok", message: next === "cancelled" ? "Order cancelled and stock restored." : `Order marked ${next}.` };
  } catch {
    return { status: "error", message: "We couldn't update the order. Please try again." };
  }
}
