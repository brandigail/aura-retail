"use server";

import { and, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { emailOutbox, orders } from "@/db/schema";
import { queueOrderListEmail } from "@/lib/emails";
import { isEmailConfigured } from "@/lib/mailer";
import type { LookupFormState } from "./track-types";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_ORDERS_LISTED = 20;
/** One list email per address in this window, so the form can't be used to flood someone's inbox. */
const PER_ADDRESS_WINDOW_MS = 10 * 60 * 1000;
/** And a ceiling across the whole shop per minute. */
const SHOP_WIDE_PER_MINUTE = 30;

/**
 * Emails a customer the list of their orders. The reply on screen is identical whether or not any orders exist,
 * so this can't be used to find out which addresses have shopped here. Only the owner of the mailbox sees the list.
 */
export async function requestOrderList(_previous: LookupFormState, formData: FormData): Promise<LookupFormState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!EMAIL.test(email) || email.length > 254) {
    return { status: "error", message: "Please enter a valid email address.", email, delivered: false };
  }

  const reply: LookupFormState = {
    status: "sent",
    message: "Thanks! If we have orders for that email address, we've sent you a message listing them. It can take a minute to arrive.",
    email,
    delivered: isEmailConfigured(),
  };

  try {
    const now = Date.now();
    const [recentForAddress] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(emailOutbox)
      .where(
        and(
          eq(emailOutbox.kind, "order_lookup"),
          sql`lower(${emailOutbox.toEmail}) = ${email.toLowerCase()}`,
          gte(emailOutbox.createdAt, new Date(now - PER_ADDRESS_WINDOW_MS)),
        ),
      );
    const [recentShopWide] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(emailOutbox)
      .where(and(eq(emailOutbox.kind, "order_lookup"), gte(emailOutbox.createdAt, new Date(now - 60_000))));
    if (recentForAddress.n > 0 || recentShopWide.n >= SHOP_WIDE_PER_MINUTE) return reply;

    const found = await db
      .select({ id: orders.id, token: orders.token, createdAt: orders.createdAt, status: orders.status, total: orders.total })
      .from(orders)
      .where(sql`lower(${orders.email}) = ${email.toLowerCase()}`)
      .orderBy(desc(orders.createdAt), desc(orders.id))
      .limit(MAX_ORDERS_LISTED);

    if (found.length > 0) {
      await queueOrderListEmail(email, found.map((o) => ({ ...o, createdAt: o.createdAt.toISOString() })));
    }
    return reply;
  } catch {
    return { status: "error", message: "We couldn't do that right now. Please try again.", email, delivered: false };
  }
}
