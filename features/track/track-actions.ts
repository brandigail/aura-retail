"use server";

import { and, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { initialTrackState, type TrackFormState } from "./track-types";

const NOT_FOUND = "We couldn't find an order with those details. Check the order number and the email you used at checkout.";

/**
 * Finds an order by its number and the customer's email. Both must match, and every failure gives the same
 * message, so the form can't be used to find out which order numbers or email addresses exist.
 */
export async function trackOrder(_previous: TrackFormState, formData: FormData): Promise<TrackFormState> {
  const orderNumber = String(formData.get("orderNumber") ?? "").trim().replace(/^#/, "");
  const email = String(formData.get("email") ?? "").trim();
  const values = { orderNumber, email };

  if (orderNumber === "" || email === "") {
    return { ...initialTrackState, status: "error", message: "Enter your order number and email address.", values };
  }

  const id = Number(orderNumber);
  if (!/^\d{1,9}$/.test(orderNumber) || !Number.isSafeInteger(id) || id <= 0 || email.length > 254) {
    return { ...initialTrackState, status: "error", message: NOT_FOUND, values };
  }

  try {
    const [order] = await db
      .select({ token: orders.token })
      .from(orders)
      .where(and(eq(orders.id, id), sql`lower(${orders.email}) = ${email.toLowerCase()}`))
      .limit(1);
    if (!order) return { ...initialTrackState, status: "error", message: NOT_FOUND, values };
    return { status: "found", message: "Found it!", token: order.token, values };
  } catch {
    return { ...initialTrackState, status: "error", message: "We couldn't look that up right now. Please try again.", values };
  }
}
