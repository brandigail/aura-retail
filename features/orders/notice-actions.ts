"use server";

import { and, eq, inArray, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { orderNotices, orders } from "@/db/schema";
import { isOrderToken } from "@/lib/order-queries";

/**
 * The customer accepts a notice. Authorised by the order's secret token: the notice only updates if it
 * belongs to the order that token identifies, so one customer can't acknowledge another's.
 */
export async function acknowledgeNotice(token: string, noticeId: number): Promise<void> {
  if (!isOrderToken(token) || !Number.isInteger(noticeId) || noticeId < 1) return;

  await db
    .update(orderNotices)
    .set({ acknowledgedAt: new Date() })
    .where(
      and(
        eq(orderNotices.id, noticeId),
        isNull(orderNotices.acknowledgedAt),
        inArray(orderNotices.orderId, db.select({ id: orders.id }).from(orders).where(eq(orders.token, token))),
      ),
    );

  revalidatePath(`/orders/${token}`);
  revalidatePath("/admin/products");
}
