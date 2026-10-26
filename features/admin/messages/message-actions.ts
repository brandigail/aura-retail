"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";

function refresh(): void {
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

/** Marks a message read, or unread again when `read` is false. */
export async function setMessageRead(id: number, read: boolean): Promise<void> {
  await requireAdmin();
  await db.update(contactMessages).set({ readAt: read ? new Date() : null }).where(eq(contactMessages.id, id));
  refresh();
}

export async function deleteMessage(id: number): Promise<void> {
  await requireAdmin();
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  refresh();
}
