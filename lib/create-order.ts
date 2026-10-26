import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { discountCodes, orderItems, orders, products } from "@/db/schema";
import type { CheckoutConflict, CheckoutLine } from "@/features/checkout/checkout-types";
import { queueOrderEmail } from "@/lib/emails";
import { salePrice } from "@/lib/money";
import { priceOrder, type ShippingMethod } from "@/lib/order-pricing";
import { getSettings } from "@/lib/settings";

interface OrderCustomer {
  name: string;
  email: string;
  address: string;
}

/** Everything about an order that is not the customer's details or the items. */
export interface OrderOptions {
  shippingMethod: ShippingMethod;
  /** An already-validated code, or null. */
  discount: { code: string; percent: number } | null;
  payment: {
    /** Shown to the customer and the owner, e.g. "Card ending 4242 (demo)" or "EFT / bank transfer". */
    label: string;
    ref: string | null;
    /** Card payments are paid at once; bank transfers wait for the money to arrive. */
    status: "paid" | "pending";
  };
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
 * Creates an order and decrements stock atomically. Every amount is computed here from live prices and the
 * shop's current settings; nothing the browser sends about money is trusted.
 * The order, its items, every stock decrement and the discount-code use run in one `db.batch` (a single
 * transaction on Neon): if any decrement would push stock below zero, or a code is already fully used, a
 * database check fails and nothing is saved.
 */
export async function createOrder(customer: OrderCustomer, lines: CheckoutLine[], options: OrderOptions): Promise<CreateOrderResult> {
  const { priced, conflicts } = await priceLines(lines);
  if (conflicts.length > 0) return { ok: false, conflicts };

  const settings = await getSettings();
  const subtotal = priced.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
  const pricing = priceOrder(settings, subtotal, options.shippingMethod, options.discount?.percent ?? 0);

  // Reserve the id up front so the items can reference it inside the same batch.
  const [{ id: orderId }] = (await db.execute(
    sql`select nextval(pg_get_serial_sequence('orders', 'id'))::int as id`,
  )).rows as [{ id: number }];

  try {
    await db.batch([
      db.insert(orders).values({
        id: orderId,
        ...customer,
        total: pricing.total,
        subtotal: pricing.subtotal,
        discountCents: pricing.discountCents,
        discountCode: options.discount?.code ?? null,
        shippingCents: pricing.shippingCents,
        shippingMethod: options.shippingMethod,
        vatCents: pricing.vatCents,
        paymentMethod: options.payment.label,
        paymentRef: options.payment.ref,
        status: options.payment.status,
      }),
      db.insert(orderItems).values(priced.map((l) => ({ orderId, ...l }))),
      ...priced.map((l) =>
        db.update(products).set({ stock: sql`${products.stock} - ${l.qty}` }).where(eq(products.id, l.productId)),
      ),
      ...(options.discount
        ? [db.update(discountCodes).set({ usesCount: sql`${discountCodes.usesCount} + 1` }).where(eq(discountCodes.code, options.discount.code))]
        : []),
    ]);
  } catch (error) {
    // Most likely a concurrent buyer took the last units between our check and the write.
    const retry = await priceLines(lines);
    if (retry.conflicts.length > 0) return { ok: false, conflicts: retry.conflicts };
    throw error;
  }

  await queueOrderEmail(orderId, "order_confirmation");

  const [row] = await db.select({ token: orders.token }).from(orders).where(eq(orders.id, orderId));
  return { ok: true, token: row.token };
}
