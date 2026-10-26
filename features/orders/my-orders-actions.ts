"use server";

import { desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import { PLACEHOLDER_IMAGE, getProductImages } from "@/lib/product-display";
import type { MyOrder, MyOrdersState } from "./my-orders-types";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_TOKENS = 50;

/**
 * Loads the orders behind a list of private order links. Each link is an unguessable random value, so
 * presenting it is proof the visitor was given it (they placed the order, or opened the email link).
 * Nothing is returned for values that aren't real order links.
 */
export async function getMyOrders(tokens: string[]): Promise<MyOrdersState> {
  const valid = [...new Set(tokens.filter((t) => typeof t === "string" && UUID.test(t)))].slice(0, MAX_TOKENS);
  if (valid.length === 0) return { status: "ready", orders: [] };

  try {
    const rows = await db
      .select({ id: orders.id, token: orders.token, createdAt: orders.createdAt, status: orders.status, total: orders.total })
      .from(orders)
      .where(inArray(orders.token, valid))
      .orderBy(desc(orders.createdAt), desc(orders.id));
    if (rows.length === 0) return { status: "ready", orders: [] };

    const items = await db
      .select({ orderId: orderItems.orderId, name: orderItems.name, qty: orderItems.qty, images: products.images })
      .from(orderItems)
      .leftJoin(products, eq(products.id, orderItems.productId))
      .where(inArray(orderItems.orderId, rows.map((r) => r.id)));

    const byOrder = new Map<number, MyOrder["items"]>();
    for (const item of items) {
      const list = byOrder.get(item.orderId) ?? [];
      list.push({ name: item.name, qty: item.qty, image: item.images ? getProductImages({ images: item.images })[0] : PLACEHOLDER_IMAGE });
      byOrder.set(item.orderId, list);
    }

    return {
      status: "ready",
      orders: rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString(), items: byOrder.get(r.id) ?? [] })),
    };
  } catch {
    return { status: "error", orders: [] };
  }
}
