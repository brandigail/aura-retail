import { eq } from "drizzle-orm";
import { db } from "@/db";
import { emailOutbox } from "@/db/schema";
import { getAdminOrder } from "@/lib/admin-order-queries";
import { button, esc, heading, layout, multiline, paragraph, rowsTable, subheading, type EmailRow } from "@/lib/email-html";
import { sendMail } from "@/lib/mailer";
import { formatMoney, formatZar } from "@/lib/money";
import { ORDER_STATUS_LABEL } from "@/lib/order-labels";
import { getSettings, type StoreSettings } from "@/lib/settings";
import type { Order, OrderStatus } from "@/types/order";

export type OrderEmailKind = "order_confirmation" | "order_shipped" | "order_cancelled";

export interface BuiltEmail {
  subject: string;
  /** Plain-text version. */
  body: string;
  html: string;
}

/** One line of the "your orders" email. */
export interface OrderListEntry {
  id: number;
  token: string;
  createdAt: string;
  status: OrderStatus;
  /** Integer cents. */
  total: number;
}

const DATE = new Intl.DateTimeFormat("en-ZA", { dateStyle: "medium", timeZone: "Africa/Johannesburg" });

function siteUrl(): string {
  return (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
}

/** "$39.49 (about R 730,57)": the charged amount first, the approximate Rand amount as a guide. */
function amount(cents: number, settings: StoreSettings): string {
  return `${formatMoney(cents)} (about ${formatZar(cents, settings.zarPerUsdHundredths / 100)})`;
}

function isEft(order: Order): boolean {
  return order.paymentMethod?.startsWith("EFT") ?? false;
}

function totalsRows(order: Order, settings: StoreSettings): { text: string[]; rows: EmailRow[] } {
  const text: string[] = [];
  const rows: EmailRow[] = [];
  if (order.subtotal > 0) {
    text.push(`  Subtotal: ${formatMoney(order.subtotal)}`);
    rows.push({ label: "Subtotal", value: esc(formatMoney(order.subtotal)) });
    if (order.discountCents > 0) {
      const label = `Discount${order.discountCode ? ` (${order.discountCode})` : ""}`;
      text.push(`  ${label}: -${formatMoney(order.discountCents)}`);
      rows.push({ label, value: `-${esc(formatMoney(order.discountCents))}` });
    }
    const shipLabel = `Delivery${order.shippingMethod ? ` (${order.shippingMethod})` : ""}`;
    const ship = order.shippingCents === 0 ? "Free" : formatMoney(order.shippingCents);
    text.push(`  ${shipLabel}: ${ship}`);
    rows.push({ label: shipLabel, value: esc(ship) });
  }
  text.push(`  Total: ${amount(order.total, settings)}`);
  rows.push({ label: "Total", value: esc(amount(order.total, settings)), strong: true });
  if (order.vatCents > 0) text.push(`  Includes ${settings.vatPercent}% VAT of ${formatMoney(order.vatCents)}`);
  return { text, rows };
}

function itemsHtml(order: Order): string {
  const rows = order.items
    .map(
      (i) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:15px;color:#0f172a">${esc(i.name)} <span style="color:#475569">&times; ${i.qty}</span></td><td align="right" style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:15px;color:#0f172a;white-space:nowrap">${esc(formatMoney(i.qty * i.unitPrice))}</td></tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0">${rows}</table>`;
}

function itemsText(order: Order): string {
  return order.items.map((i) => `  ${i.qty} x ${i.name}  ${formatMoney(i.qty * i.unitPrice)}`).join("\n");
}

function paymentBlock(order: Order, settings: StoreSettings): { text: string; html: string } {
  if (isEft(order)) {
    const bank = settings.bankDetails.trim();
    const text = `Payment: please pay ${formatMoney(order.total)} by bank transfer, using "Order ${order.id}" as the payment reference. We ship as soon as the payment reaches us.${bank ? `\n${bank.split("\n").map((l) => `  ${l}`).join("\n")}` : ""}\n`;
    const html =
      subheading("Pay by bank transfer") +
      paragraph(`Please pay <strong>${esc(formatMoney(order.total))}</strong> using <strong>Order ${order.id}</strong> as your payment reference. We ship as soon as the money reaches us.`) +
      (bank ? `<p style="margin:0 0 14px;padding:12px 14px;background:#f1f5f9;border-radius:6px;font-size:15px;line-height:1.6">${multiline(bank)}</p>` : "");
    return { text, html };
  }
  const label = `${order.paymentMethod ?? "Payment received"}${order.paymentRef ? ` (ref ${order.paymentRef})` : ""}`;
  return { text: `Payment: ${label}\n`, html: paragraph(`<span style="color:#475569">Payment:</span> ${esc(label)}`) };
}

function footerFor(settings: StoreSettings): { text: string; html: string } {
  const text = `Questions? Reply to this email or write to ${settings.contactEmail}.\n\n${settings.storeName}`;
  const html = `Questions? Just reply to this email or write to <a href="mailto:${esc(settings.contactEmail)}" style="color:#008080">${esc(settings.contactEmail)}</a>.<br>${esc(settings.storeName)}${settings.address ? `<br>${esc(settings.address)}` : ""}`;
  return { text, html };
}

/** Builds the email for an order event. Pure, so it is easy to test and to preview in the admin. */
export function buildOrderEmail(kind: OrderEmailKind, order: Order, settings: StoreSettings): BuiltEmail {
  const first = order.name.split(" ")[0];
  const link = `${siteUrl()}/orders/${order.token}`;
  const footer = footerFor(settings);
  const wrap = (preheader: string, inner: string) => layout({ storeName: settings.storeName, preheader, bodyHtml: inner, footerHtml: footer.html });

  if (kind === "order_shipped") {
    const subject = `Your order #${order.id} is on its way`;
    return {
      subject,
      body: `Hi ${first},\n\nGood news: your order #${order.id} has shipped.\n\n${itemsText(order)}\n\nIt is on its way to:\n${order.address}\n\nTrack your order: ${link}\n${footer.text}`,
      html: wrap(
        "Your order has shipped.",
        heading("Your order is on its way") +
          paragraph(`Hi ${esc(first)}, good news: order <strong>#${order.id}</strong> has shipped.`) +
          itemsHtml(order) +
          subheading("Delivering to") +
          paragraph(multiline(order.address)) +
          button("Track your order", link),
      ),
    };
  }

  if (kind === "order_cancelled") {
    const refund = isEft(order) ? "." : " and any payment will be refunded to your original payment method within 7 working days.";
    return {
      subject: `Your order #${order.id} has been cancelled`,
      body: `Hi ${first},\n\nYour order #${order.id} has been cancelled${refund}\n\n${itemsText(order)}\n\nView your order: ${link}\n${footer.text}`,
      html: wrap(
        "Your order has been cancelled.",
        heading("Your order has been cancelled") +
          paragraph(`Hi ${esc(first)}, order <strong>#${order.id}</strong> has been cancelled${esc(refund)}`) +
          itemsHtml(order) +
          button("View your order", link),
      ),
    };
  }

  const totals = totalsRows(order, settings);
  const payment = paymentBlock(order, settings);
  return {
    subject: `Thank you for your order #${order.id}`,
    body: `Hi ${first},\n\nThank you for shopping with ${settings.storeName}. We have received your order #${order.id}.\n\n${itemsText(order)}\n\n${totals.text.join("\n")}\n\n${payment.text}\nDelivering to:\n${order.address}\n\nView or track your order: ${link}\n${footer.text}`,
    html: wrap(
      `We have received your order #${order.id}.`,
      heading("Thank you for your order!") +
        paragraph(`Hi ${esc(first)}, we have received your order <strong>#${order.id}</strong>. Here is what you ordered.`) +
        itemsHtml(order) +
        rowsTable(totals.rows) +
        paragraph(`<span style="color:#475569;font-size:13px">Prices include ${settings.vatPercent}% VAT${order.vatCents > 0 ? ` (${esc(formatMoney(order.vatCents))})` : ""}. You are charged in US dollars; the Rand amount is a guide.</span>`) +
        payment.html +
        subheading("Delivering to") +
        paragraph(multiline(order.address)) +
        button("View or track your order", link),
    ),
  };
}

/** The "here are your orders" email for a customer who forgot their order number. */
export function buildOrderListEmail(orders: readonly OrderListEntry[], settings: StoreSettings): BuiltEmail {
  const footer = footerFor(settings);
  const lines = orders.map((o) => ({
    id: o.id,
    date: DATE.format(new Date(o.createdAt)),
    status: ORDER_STATUS_LABEL[o.status],
    total: amount(o.total, settings),
    link: `${siteUrl()}/orders/${o.token}`,
  }));

  const text = lines.map((l) => `  Order #${l.id}, ${l.date}\n    ${l.status}, ${l.total}\n    ${l.link}`).join("\n\n");
  const cards = lines
    .map(
      (l) =>
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 10px;border:1px solid #e2e8f0;border-radius:8px"><tr><td style="padding:14px 16px"><div style="font-size:16px;font-weight:700;color:#0f172a">Order #${l.id} <span style="font-weight:400;color:#475569">&middot; ${esc(l.date)}</span></div><div style="margin-top:4px;font-size:15px;color:#475569">${esc(l.status)} &middot; ${esc(l.total)}</div><div style="margin-top:8px"><a href="${esc(l.link)}" style="color:#008080;font-weight:600;font-size:15px">View this order</a></div></td></tr></table>`,
    )
    .join("");

  return {
    subject: `Your ${settings.storeName} orders`,
    body: `Hi,\n\nYou asked us to list your orders. Here they are, newest first:\n\n${text}\n\nIf you didn't ask for this, you can ignore this email; nobody can see your orders without it.\n${footer.text}`,
    html: layout({
      storeName: settings.storeName,
      preheader: "Here are your orders.",
      bodyHtml:
        heading("Your orders") +
        paragraph("You asked us to list your orders. Here they are, newest first.") +
        cards +
        paragraph(`<span style="color:#475569;font-size:14px">If you didn't ask for this, you can ignore this email. Nobody can see your orders without it.</span>`),
      footerHtml: footer.html,
    }),
  };
}

/** Saves an email in the outbox, then tries to deliver it. Never throws, so email trouble can never block an order. */
async function recordAndSend(to: string, email: BuiltEmail, kind: typeof emailOutbox.$inferInsert.kind, orderId: number | null, settings: StoreSettings): Promise<void> {
  try {
    const [row] = await db
      .insert(emailOutbox)
      .values({ toEmail: to, subject: email.subject, body: email.body, html: email.html, kind, orderId })
      .returning({ id: emailOutbox.id });
    await deliver(row.id, to, email, settings);
  } catch (error) {
    console.error("Could not record email", error instanceof Error ? error.message : error);
  }
}

async function deliver(id: number, to: string, email: BuiltEmail, settings: StoreSettings): Promise<void> {
  const result = await sendMail({ to, subject: email.subject, text: email.body, html: email.html, replyTo: settings.contactEmail }, settings.storeName);
  if (result.ok) {
    await db.update(emailOutbox).set({ status: "sent", sentAt: new Date(), error: null }).where(eq(emailOutbox.id, id));
  } else {
    // "No provider connected" is a normal state for a demo, so it stays "recorded" rather than "failed".
    const connected = !result.error.startsWith("No mail provider");
    await db.update(emailOutbox).set({ status: connected ? "failed" : "recorded", error: connected ? result.error : null }).where(eq(emailOutbox.id, id));
  }
}

export async function queueOrderEmail(orderId: number, kind: OrderEmailKind): Promise<void> {
  try {
    const [order, settings] = await Promise.all([getAdminOrder(orderId), getSettings()]);
    if (!order) return;
    await recordAndSend(order.email, buildOrderEmail(kind, order, settings), kind, orderId, settings);
  } catch (error) {
    console.error("Could not queue order email", error instanceof Error ? error.message : error);
  }
}

export async function queueOrderListEmail(to: string, orders: readonly OrderListEntry[]): Promise<void> {
  try {
    const settings = await getSettings();
    await recordAndSend(to, buildOrderListEmail(orders, settings), "order_lookup", null, settings);
  } catch (error) {
    console.error("Could not queue order list email", error instanceof Error ? error.message : error);
  }
}

/** Tries again to deliver an email already in the outbox (for the owner's Resend button). */
export async function resendEmail(id: number): Promise<{ ok: boolean; message: string }> {
  const [row] = await db.select().from(emailOutbox).where(eq(emailOutbox.id, id)).limit(1);
  if (!row) return { ok: false, message: "That email no longer exists." };
  const settings = await getSettings();
  await deliver(id, row.toEmail, { subject: row.subject, body: row.body, html: row.html ?? `<pre>${esc(row.body)}</pre>` }, settings);
  const [after] = await db.select({ status: emailOutbox.status, error: emailOutbox.error }).from(emailOutbox).where(eq(emailOutbox.id, id));
  if (after.status === "sent") return { ok: true, message: `Sent to ${row.toEmail}.` };
  return { ok: false, message: after.status === "failed" ? `The mail provider refused it: ${after.error}` : "No mail provider is connected yet, so it can't be sent. See the owner guide." };
}
