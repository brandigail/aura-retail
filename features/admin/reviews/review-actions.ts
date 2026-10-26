"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

/** Removes a review (spam, abuse or off-topic). It disappears from the product page and its rating average. */
export async function deleteReview(id: number, productId: number): Promise<void> {
  await requireAdmin();
  await db.delete(reviews).where(eq(reviews.id, id));
  revalidatePath("/admin/reviews");
  revalidatePath(`/products/${productId}`);
  revalidatePath("/");
}
