import { eq } from "drizzle-orm";
import { db } from "@/db";
import { discountCodes } from "@/db/schema";

export type CodeCheck = { ok: true; code: string; percent: number } | { ok: false; message: string };

export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, "");
}

/** Looks a code up and says whether a customer can use it right now. */
export async function checkDiscountCode(raw: string): Promise<CodeCheck> {
  const code = normalizeCode(raw);
  if (code === "" || code.length > 40) return { ok: false, message: "Enter a discount code." };

  const [row] = await db.select().from(discountCodes).where(eq(discountCodes.code, code)).limit(1);
  if (!row || !row.active) return { ok: false, message: "That code isn't valid." };
  if (row.expiresAt && row.expiresAt.getTime() < Date.now()) return { ok: false, message: "That code has expired." };
  if (row.maxUses !== null && row.usesCount >= row.maxUses) return { ok: false, message: "That code has been fully used." };
  return { ok: true, code: row.code, percent: row.percent };
}
