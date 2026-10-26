import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders, products } from "@/db/schema";
import type { CheckoutConflict, CheckoutLine } from "@/features/checkout/checkout-types";
import { salePrice } from "@/lib/money";

interface OrderCustomer {
  name: string;
  email: string;
  address: string;
}

export type CreateOrderResult =
  | { ok: true; token: string }
  | { ok: false; conflicts: CheckoutConflict[] };

interface PricedLine {
  productId: number;
  name: string;
  unitPrice: number;
  qty: number;
}

/** Compares the cart against live catalog data. Returns priced lines when everything matches. */
async function priceLines(
  lines: CheckoutLine[],
): Promise<{ priced: PricedLine[]; conflicts: CheckoutConflict[] }> {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      discountPercent: products.discountPercent,
      stock: products.stock,
      withdrawn: products.deletionRequestedAt,
    })
    .from(products)
    .where(inArray(products.id, lines.map((l) => l.productId)));
  const byId = new Map(rows.map((r) => [r.id, r]));

  const priced: PricedLine[] = [];
  const conflicts: CheckoutConflict[] = [];
  for (const line of lines) {
    const product = byId.get(line.productId);
    if (!product) {
      conflicts.push({
        productId: line.productId,
        name: "A product in your cart",
        reason: "unavailable",
        unitPrice: line.unitPrice,
        stock: 0,
        requested: line.qty,
      });
      continue;
    }
    const unitPrice = salePrice(product.price, product.discountPercent);
    const base = { productId: product.id, name: product.name, unitPrice, stock: product.stock, requested: line.qty };
    // A product being withdrawn can't be bought, otherwise its deletion would never finish.
    if (product.withdrawn) conflicts.push({ ...base, stock: 0, reason: "unavailable" });
    else if (product.stock < line.qty) conflicts.push({ ...base, reason: product.stock === 0 ? "unavailable" : "stock" });
    else if (unitPrice !== line.unitPrice) conflicts.push({ ...base, reason: "price" });
    else priced.push({ productId: product.id, name: product.name, unitPrice, qty: line.qty });
  }
  return { priced, conflicts };
}

/**
 * Creates an order and decrements stock atomically. The total is always computed from live prices.
 * The order, its items and every stock decrement run in one `db.batch` (a single transaction on Neon):
 * if any decrement would push stock below zero, the products_stock_nonneg check fails and nothing is saved.
 */
export async function createOrder(customer: OrderCustomer, lines: CheckoutLine[]): Promise<CreateOrderResult> {
  const { priced, conflicts } = await priceLines(lines);
  if (conflicts.length > 0) return { ok: false, conflicts };

  const total = priced.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);

  // Reserve the id up front so the items can reference it inside the same batch.
  const [{ id: orderId }] = (await db.execute(
    sql`select nextval(pg_get_serial_sequence('orders', 'id'))::int as id`,
  )).rows as [{ id: number }];

  try {
    await db.batch([
      db.insert(orders).values({ id: orderId, ...customer, total, status: "paid" }),
      db.insert(orderItems).values(priced.map((l) => ({ orderId, ...l }))),
      ...priced.map((l) =>
        db.update(products).set({ stock: sql`${products.stock} - ${l.qty}` }).where(eq(products.id, l.productId)),
      ),
    ]);
  } catch (error) {
    // Most likely a concurrent buyer took the last units between our check and the write.
    const retry = await priceLines(lines);
    if (retry.conflicts.length > 0) return { ok: false, conflicts: retry.conflicts };
    throw error;
  }

  const [row] = await db.select({ token: orders.token }).from(orders).where(eq(orders.id, orderId));
  return { ok: true, token: row.token };
}
