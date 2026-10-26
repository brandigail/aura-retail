import { and, asc, desc, eq, gte, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import type { Order, OrderStatus } from "@/types/order";

export interface AdminOrderRow {
  id: number;
  name: string;
  email: string;
  /** Integer cents. */
  total: number;
  status: OrderStatus;
  itemCount: number;
  createdAt: string;
}

export interface DailySales {
  /** YYYY-MM-DD. */
  day: string;
  orders: number;
  /** Integer cents. */
  revenue: number;
}

export interface TopProduct {
  productId: number;
  name: string;
  units: number;
  /** Integer cents. */
  revenue: number;
}

export interface SalesStats {
  days: number;
  /** Integer cents, cancelled orders excluded. */
  revenue: number;
  orders: number;
  /** Integer cents. */
  averageOrder: number;
  daily: DailySales[];
  topProducts: TopProduct[];
}

export async function listAdminOrders(): Promise<AdminOrderRow[]> {
  const rows = await db
    .select({
      id: orders.id,
      name: orders.name,
      email: orders.email,
      total: orders.total,
      status: orders.status,
      createdAt: orders.createdAt,
      itemCount: sql<number>`coalesce((select sum(${orderItems.qty}) from ${orderItems} where ${orderItems.orderId} = ${orders.id}), 0)::int`,
    })
    .from(orders)
    .orderBy(desc(orders.createdAt), desc(orders.id));
  return rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() }));
}

export async function getAdminOrder(id: number): Promise<Order | null> {
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) return null;
  const items = await db
    .select({ productId: orderItems.productId, name: orderItems.name, unitPrice: orderItems.unitPrice, qty: orderItems.qty })
    .from(orderItems)
    .where(eq(orderItems.orderId, id))
    .orderBy(asc(orderItems.id));
  return { ...order, items, createdAt: order.createdAt.toISOString() };
}

/** Revenue and order counts for the last `days` days (including today), cancelled orders excluded. */
export async function getSalesStats(days = 30): Promise<SalesStats> {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (days - 1));

  const [dailyRows, topRows] = await Promise.all([
    db
      .select({
        day: sql<string>`to_char(${orders.createdAt} at time zone 'UTC', 'YYYY-MM-DD')`,
        orders: sql<number>`count(*)::int`,
        revenue: sql<number>`coalesce(sum(${orders.total}), 0)::int`,
      })
      .from(orders)
      .where(and(gte(orders.createdAt, since), ne(orders.status, "cancelled")))
      .groupBy(sql`1`),
    db
      .select({
        productId: orderItems.productId,
        name: sql<string>`max(${orderItems.name})`,
        units: sql<number>`sum(${orderItems.qty})::int`,
        revenue: sql<number>`sum(${orderItems.qty} * ${orderItems.unitPrice})::int`,
      })
      .from(orderItems)
      .innerJoin(orders, eq(orders.id, orderItems.orderId))
      .where(and(gte(orders.createdAt, since), ne(orders.status, "cancelled")))
      .groupBy(orderItems.productId)
      .orderBy(sql`sum(${orderItems.qty} * ${orderItems.unitPrice}) desc`)
      .limit(5),
  ]);

  const byDay = new Map(dailyRows.map((r) => [r.day, r]));
  const daily: DailySales[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setUTCDate(since.getUTCDate() + i);
    const day = d.toISOString().slice(0, 10);
    daily.push({ day, orders: byDay.get(day)?.orders ?? 0, revenue: byDay.get(day)?.revenue ?? 0 });
  }

  const revenue = daily.reduce((sum, d) => sum + d.revenue, 0);
  const orderCount = daily.reduce((sum, d) => sum + d.orders, 0);
  return {
    days,
    revenue,
    orders: orderCount,
    averageOrder: orderCount === 0 ? 0 : Math.round(revenue / orderCount),
    daily,
    topProducts: topRows,
  };
}
