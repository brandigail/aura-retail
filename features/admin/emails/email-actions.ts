"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { resendEmail } from "@/lib/emails";

export interface ResendState {
  status: "idle" | "ok" | "error";
  message: string;
}

export async function resendEmailAction(id: number): Promise<ResendState> {
  await requireAdmin();
  try {
    const result = await resendEmail(id);
    revalidatePath("/admin/emails");
    return { status: result.ok ? "ok" : "error", message: result.message };
  } catch {
    return { status: "error", message: "We couldn't send that email. Please try again." };
  }
}
