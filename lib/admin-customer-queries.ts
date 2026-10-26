import { desc, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";

export interface CustomerRow {
  email: string;
  name: string;
  orderCount: number;
  /** Integer cents across all non-cancelled orders. */
  spent: number;
  /** ISO 8601. */
  lastOrderAt: string;
}

/** Customers are the people behind orders: orders are grouped by email address, ignoring capital letters. */
export async function listCustomers(): Promise<CustomerRow[]> {
  const email = sql<string>`lower(${orders.email})`;
  const rows = await db
    .select({
      email,
      // The name used on their most recent order.
      name: sql<string>`(array_agg(${orders.name} order by ${orders.createdAt} desc))[1]`,
      orderCount: sql<number>`count(*)::int`,
      spent: sql<number>`coalesce(sum(${orders.total}) filter (where ${ne(orders.status, "cancelled")}), 0)::int`,
      lastOrderAt: sql<Date>`max(${orders.createdAt})`,
    })
    .from(orders)
    .groupBy(email)
    .orderBy(desc(sql`max(${orders.createdAt})`));

  return rows.map((r) => ({ ...r, lastOrderAt: new Date(r.lastOrderAt).toISOString() }));
}
