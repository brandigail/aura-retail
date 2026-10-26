import { db } from "@/db";
import { emailOutbox } from "@/db/schema";
import { getAdminOrder } from "@/lib/admin-order-queries";
import { formatMoney } from "@/lib/money";
import { getSettings, type StoreSettings } from "@/lib/settings";
import type { Order } from "@/types/order";

export type OrderEmailKind = "order_confirmation" | "order_shipped" | "order_cancelled";

interface BuiltEmail {
  subject: string;
  body: string;
}

function siteUrl(): string {
  return (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}

function itemLines(order: Order): string {
  return order.items.map((i) => `  ${i.qty} x ${i.name}  ${formatMoney(i.qty * i.unitPrice)}`).join("\n");
}

function totals(order: Order, settings: StoreSettings): string {
  const rows: string[] = [];
  if (order.subtotal > 0) {
    rows.push(`  Subtotal: ${formatMoney(order.subtotal)}`);
    if (order.discountCents > 0) rows.push(`  Discount${order.discountCode ? ` (${order.discountCode})` : ""}: -${formatMoney(order.discountCents)}`);
    rows.push(`  Shipping${order.shippingMethod ? ` (${order.shippingMethod})` : ""}: ${order.shippingCents === 0 ? "Free" : formatMoney(order.shippingCents)}`);
  }
  rows.push(`  Total: ${formatMoney(order.total)}`);
  if (order.vatCents > 0) rows.push(`  Includes ${settings.vatPercent}% VAT of ${formatMoney(order.vatCents)}`);
  return rows.join("\n");
}

function paymentSection(order: Order, settings: StoreSettings): string {
  if (order.paymentMethod?.startsWith("EFT")) {
    const bank = settings.bankDetails ? `\n${settings.bankDetails.split("\n").map((l) => `  ${l}`).join("\n")}\n` : "\n";
    return `Payment: please pay ${formatMoney(order.total)} by bank transfer, using "Order ${order.id}" as the payment reference. We ship as soon as the payment reaches us.${bank}`;
  }
  return `Payment: ${order.paymentMethod ?? "received"}${order.paymentRef ? ` (ref ${order.paymentRef})` : ""}\n`;
}

/** Builds the plain-text email for an order event. Pure, so it is easy to test and to preview in the admin. */
export function buildOrderEmail(kind: OrderEmailKind, order: Order, settings: StoreSettings): BuiltEmail {
  const first = order.name.split(" ")[0];
  const link = `${siteUrl()}/orders/${order.token}`;
  const footer = `\nView or track your order: ${link}\nQuestions? Reply to this email or write to ${settings.contactEmail}.\n\n${settings.storeName}`;

  if (kind === "order_shipped") {
    return {
      subject: `Your order #${order.id} is on its way`,
      body: `Hi ${first},\n\nGood news: your order #${order.id} has shipped.\n\n${itemLines(order)}\n\nIt is on its way to:\n${order.address}\n${footer}`,
    };
  }
  if (kind === "order_cancelled") {
    return {
      subject: `Your order #${order.id} has been cancelled`,
      body: `Hi ${first},\n\nYour order #${order.id} has been cancelled${order.paymentMethod?.startsWith("EFT") ? "." : " and any payment will be refunded to your original payment method within 7 working days."}\n\n${itemLines(order)}\n${footer}`,
    };
  }
  return {
    subject: `Thank you for your order #${order.id}`,
    body: `Hi ${first},\n\nThank you for shopping with ${settings.storeName}. We have received your order #${order.id}.\n\n${itemLines(order)}\n\n${totals(order, settings)}\n\n${paymentSection(order, settings)}\nDelivering to:\n${order.address}\n${footer}`,
  };
}

/**
 * Records an order email in the outbox. It never throws: a problem with email must not undo or block an order.
 * Delivery by a mail provider is a Phase 2 step; until then the owner reads these in the admin's Emails page.
 */
export async function queueOrderEmail(orderId: number, kind: OrderEmailKind): Promise<void> {
  try {
    const [order, settings] = await Promise.all([getAdminOrder(orderId), getSettings()]);
    if (!order) return;
    const { subject, body } = buildOrderEmail(kind, order, settings);
    await db.insert(emailOutbox).values({ toEmail: order.email, subject, body, kind, orderId });
  } catch (error) {
    console.error("Could not queue order email", error instanceof Error ? error.message : error);
  }
}
