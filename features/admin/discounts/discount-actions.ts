"use server";

import { inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { MAX_DISCOUNT_PERCENT } from "@/lib/money";

export interface DiscountState {
  status: "idle" | "ok" | "error";
  message: string;
}

const MAX_PRODUCTS_PER_CHANGE = 500;

/** Sets the same discount on every selected product in one statement. `intent=remove` sets 0%. */
export async function applyDiscount(_previous: DiscountState, formData: FormData): Promise<DiscountState> {
  await requireAdmin();

  const ids = [...new Set(formData.getAll("id").map(Number))];
  if (ids.length === 0) return { status: "error", message: "Select at least one product." };
  if (ids.length > MAX_PRODUCTS_PER_CHANGE || ids.some((id) => !Number.isInteger(id) || id <= 0)) {
    return { status: "error", message: "Those products can't be updated. Reload the page and try again." };
  }

  const removing = formData.get("intent") === "remove";
  const raw = String(formData.get("percent") ?? "").trim();
  const percent = removing ? 0 : Number(raw);
  if (!removing && (raw === "" || !Number.isInteger(percent) || percent < 1 || percent > MAX_DISCOUNT_PERCENT)) {
    return { status: "error", message: `Enter a whole-number discount from 1 to ${MAX_DISCOUNT_PERCENT}%.` };
  }

  try {
    const updated = await db
      .update(products)
      .set({ discountPercent: percent })
      .where(inArray(products.id, ids))
      .returning({ id: products.id });

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/discounts");
    revalidatePath("/admin/products");
    for (const { id } of updated) revalidatePath(`/products/${id}`);

    const count = `${updated.length} product${updated.length === 1 ? "" : "s"}`;
    return { status: "ok", message: removing ? `Discount removed from ${count}.` : `${percent}% discount applied to ${count}.` };
  } catch {
    return { status: "error", message: "We couldn't save the discount. Please try again." };
  }
}
