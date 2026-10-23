import { and, asc, eq, inArray, isNotNull, notExists, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orderNotices, orders, products } from "@/db/schema";
import type { OrderStatus } from "@/types/order";

/** Orders that still depend on the product: paid or awaiting payment, not yet shipped or cancelled. */
export const OPEN_ORDER_STATUSES: OrderStatus[] = ["pending", "paid"];

export interface AffectedOrder {
  orderId: number;
  token: string;
  name: string;
  email: string;
  status: OrderStatus;
  acknowledged: boolean;
}

export type DeletionOutcome =
  | { status: "deleted" }
  | { status: "awaiting"; total: number; acknowledged: number }
  | { status: "not_found" };

const productRemoved = "product_removed" as const;

/** Open orders containing the product, with whether each customer has accepted the removal notice. */
export async function getAffectedOrders(productId: number): Promise<AffectedOrder[]> {
  const rows = await db
    .select({
      orderId: orders.id,
      token: orders.token,
      name: orders.name,
      email: orders.email,
      status: orders.status,
      acknowledgedAt: orderNotices.acknowledgedAt,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orders.id, orderItems.orderId))
    .leftJoin(
      orderNotices,
      and(
        eq(orderNotices.orderId, orders.id),
        eq(orderNotices.productId, productId),
        eq(orderNotices.kind, productRemoved),
      ),
    )
    .where(and(eq(orderItems.productId, productId), inArray(orders.status, OPEN_ORDER_STATUSES)))
    .orderBy(asc(orders.id));

  const byOrder = new Map<number, AffectedOrder>();
  for (const { acknowledgedAt, ...row } of rows) {
    byOrder.set(row.orderId, { ...row, acknowledged: acknowledgedAt !== null });
  }
  return [...byOrder.values()];
}

/**
 * Starts or finishes deleting a product.
 *
 * - No open orders: the product is deleted straight away.
 * - Open orders: the product is hidden (no new orders), each affected customer gets a notice, and the
 *   delete is refused until every one of them has acknowledged it. Calling this again later retries.
 *
 * The delete itself is one guarded statement, so it cannot succeed while an unacknowledged open order
 * exists, even if an order slips in between our check and the write.
 */
export async function attemptProductDeletion(productId: number): Promise<DeletionOutcome> {
  const [product] = await db
    .select({ id: products.id, name: products.name, deletionRequestedAt: products.deletionRequestedAt })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);
  if (!product) return { status: "not_found" };

  const affected = await getAffectedOrders(productId);
  if (affected.length > 0) {
    await db.batch([
      db
        .update(products)
        .set({ deletionRequestedAt: product.deletionRequestedAt ?? new Date() })
        .where(eq(products.id, productId)),
      db
        .insert(orderNotices)
        .values(affected.map((o) => ({ orderId: o.orderId, productId, productName: product.name, kind: productRemoved })))
        .onConflictDoNothing(),
    ]);
  }

  const acknowledgedForOrder = db
    .select({ one: sql`1` })
    .from(orderNotices)
    .where(
      and(
        eq(orderNotices.orderId, orders.id),
        eq(orderNotices.productId, productId),
        eq(orderNotices.kind, productRemoved),
        isNotNull(orderNotices.acknowledgedAt),
      ),
    );
  const blockingOrders = db
    .select({ one: sql`1` })
    .from(orderItems)
    .innerJoin(orders, eq(orders.id, orderItems.orderId))
    .where(
      and(
        eq(orderItems.productId, productId),
        inArray(orders.status, OPEN_ORDER_STATUSES),
        notExists(acknowledgedForOrder),
      ),
    );

  const deleted = await db
    .delete(products)
    .where(and(eq(products.id, productId), notExists(blockingOrders)))
    .returning({ id: products.id });
  if (deleted.length > 0) return { status: "deleted" };

  const after = await getAffectedOrders(productId);
  return { status: "awaiting", total: after.length, acknowledged: after.filter((o) => o.acknowledged).length };
}

/** Puts a product that was pending deletion back on sale and withdraws its notices. */
export async function cancelProductDeletion(productId: number): Promise<void> {
  await db.batch([
    db.update(products).set({ deletionRequestedAt: null }).where(eq(products.id, productId)),
    db.delete(orderNotices).where(and(eq(orderNotices.productId, productId), eq(orderNotices.kind, productRemoved))),
  ]);
}
