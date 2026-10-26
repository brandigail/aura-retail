"use server";

import { and, eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { products } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

export interface StockState {
  status: "idle" | "ok" | "error";
  message: string;
}

const MAX_STOCK = 100_000;

export async function adjustStock(productId: number, _previous: StockState, formData: FormData): Promise<StockState> {
  await requireAdmin();

  const mode = formData.get("mode");
  const raw = String(formData.get("amount") ?? "").trim();
  const amount = Number(raw);

  if (raw === "" || !Number.isInteger(amount)) return { status: "error", message: "Enter a whole number." };
  if (mode === "add" && amount === 0) return { status: "error", message: "Adding 0 changes nothing. Pick \"Set to\" to set stock to 0." };
  if (Math.abs(amount) > MAX_STOCK) return { status: "error", message: `Keep the number under ${MAX_STOCK.toLocaleString("en-US")}.` };

  try {
    let updated: { stock: number }[];
    if (mode === "set") {
      if (amount < 0) return { status: "error", message: "Stock can't be negative." };
      updated = await db.update(products).set({ stock: amount }).where(eq(products.id, productId)).returning({ stock: products.stock });
    } else if (mode === "add") {
      // Single statement so concurrent checkouts can't be overwritten, and stock never goes below zero.
      updated = await db
        .update(products)
        .set({ stock: sql`${products.stock} + ${amount}` })
        .where(and(eq(products.id, productId), gte(sql`${products.stock} + ${amount}`, 0)))
        .returning({ stock: products.stock });
    } else {
      return { status: "error", message: "Choose how to adjust the stock." };
    }

    if (updated.length === 0) {
      return { status: "error", message: mode === "add" ? "That would take stock below zero (or the product is gone)." : "That product no longer exists." };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/stock");
    revalidatePath("/admin/products");
    revalidatePath(`/products/${productId}`);
    return { status: "ok", message: `Stock is now ${updated[0].stock}.` };
  } catch {
    return { status: "error", message: "We couldn't update the stock. Please try again." };
  }
}
