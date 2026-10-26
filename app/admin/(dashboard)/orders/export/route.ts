import { and, asc, eq, gte, inArray, lt, type SQL } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { centsToDecimal, toCsv } from "@/lib/csv";
import { isOrderStatus } from "@/features/admin/orders/order-status";
import { getSettings } from "@/lib/settings";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;

const HEADER = [
  "Order number",
  "Placed (South Africa time)",
  "Status",
  "Customer",
  "Email",
  "Items",
  "Subtotal (USD)",
  "Discount code",
  "Discount (USD)",
  "Delivery",
  "Delivery (USD)",
  "VAT included (USD)",
  "VAT included (ZAR, approx.)",
  "Total (USD)",
  "Total (ZAR, approx.)",
  "Payment",
  "Payment reference",
  "Delivery address",
];

const PLACED = new Intl.DateTimeFormat("sv-SE", { dateStyle: "short", timeStyle: "short", timeZone: "Africa/Johannesburg" });

/** Start of a South African calendar day as a moment in time. */
function startOfDay(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00+02:00`);
}

/** Downloads the owner's orders as a CSV file. Optional ?status=, ?from=YYYY-MM-DD and ?to=YYYY-MM-DD filters. */
export async function GET(request: Request): Promise<Response> {
  await requireAdmin();

  const params = new URL(request.url).searchParams;
  const status = params.get("status");
  const from = params.get("from");
  const to = params.get("to");

  const conditions: SQL[] = [];
  if (status && status !== "all") {
    if (!isOrderStatus(status)) return new Response("Unknown status.", { status: 400 });
    conditions.push(eq(orders.status, status));
  }
  if (from) {
    if (!DATE_ONLY.test(from) || Number.isNaN(startOfDay(from).getTime())) return new Response("Invalid start date.", { status: 400 });
    conditions.push(gte(orders.createdAt, startOfDay(from)));
  }
  if (to) {
    if (!DATE_ONLY.test(to) || Number.isNaN(startOfDay(to).getTime())) return new Response("Invalid end date.", { status: 400 });
    // The end date is included in full, so the limit is the start of the next day.
    conditions.push(lt(orders.createdAt, new Date(startOfDay(to).getTime() + DAY_MS)));
  }

  const [rows, settings] = await Promise.all([
    db.select().from(orders).where(conditions.length ? and(...conditions) : undefined).orderBy(asc(orders.createdAt), asc(orders.id)),
    getSettings(),
  ]);
  const rate = settings.zarPerUsdHundredths / 100;

  const items = rows.length
    ? await db.select({ orderId: orderItems.orderId, name: orderItems.name, qty: orderItems.qty }).from(orderItems).where(inArray(orderItems.orderId, rows.map((r) => r.id))).orderBy(asc(orderItems.id))
    : [];
  const itemText = new Map<number, string[]>();
  for (const item of items) itemText.set(item.orderId, [...(itemText.get(item.orderId) ?? []), `${item.qty} x ${item.name}`]);

  const csv = toCsv(
    HEADER,
    rows.map((o) => [
      o.id,
      PLACED.format(o.createdAt),
      o.status,
      o.name,
      o.email,
      (itemText.get(o.id) ?? []).join("; "),
      o.subtotal > 0 ? centsToDecimal(o.subtotal) : "",
      o.discountCode,
      centsToDecimal(o.discountCents),
      o.shippingMethod,
      centsToDecimal(o.shippingCents),
      centsToDecimal(o.vatCents),
      ((o.vatCents / 100) * rate).toFixed(2),
      centsToDecimal(o.total),
      ((o.total / 100) * rate).toFixed(2),
      o.paymentMethod,
      o.paymentRef,
      o.address.replace(/\r?\n/g, ", "),
    ]),
  );

  const today = PLACED.format(new Date()).slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
