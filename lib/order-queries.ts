import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orderNotices, orders } from "@/db/schema";
import type { Order, OrderNotice } from "@/types/order";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isOrderToken(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export async function getOrderByToken(token: string): Promise<Order | null> {
  if (!isOrderToken(token)) return null;

  const [order] = await db.select().from(orders).where(eq(orders.token, token)).limit(1);
  if (!order) return null;

  const items = await db
    .select({
      productId: orderItems.productId,
      name: orderItems.name,
      unitPrice: orderItems.unitPrice,
      qty: orderItems.qty,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id))
    .orderBy(asc(orderItems.id));

  return { ...order, items, createdAt: order.createdAt.toISOString() };
}

export async function getNoticesForOrder(orderId: number): Promise<OrderNotice[]> {
  const rows = await db
    .select({
      id: orderNotices.id,
      kind: orderNotices.kind,
      productName: orderNotices.productName,
      acknowledgedAt: orderNotices.acknowledgedAt,
    })
    .from(orderNotices)
    .where(eq(orderNotices.orderId, orderId))
    .orderBy(asc(orderNotices.id));
  return rows.map((row) => ({ ...row, acknowledgedAt: row.acknowledgedAt?.toISOString() ?? null }));
}
