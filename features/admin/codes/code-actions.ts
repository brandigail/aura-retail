"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { discountCodes } from "@/db/schema";
import { requireAdmin } from "@/lib/admin-auth";
import { isUniqueViolation } from "@/lib/db-errors";
import { MAX_DISCOUNT_PERCENT } from "@/lib/money";
import { EMPTY_CODE_VALUES, type CodeFormState, type CodeFormValues } from "./code-types";

const CODE_PATTERN = /^[A-Z0-9_-]{3,20}$/;
const MAX_USES_LIMIT = 1_000_000;

function read(formData: FormData, key: keyof CodeFormValues): string {
  return String(formData.get(key) ?? "").trim();
}

/** The code is valid through the end of the chosen day, South African time. */
function endOfDay(isoDate: string): Date {
  return new Date(`${isoDate}T23:59:59+02:00`);
}

export async function createCode(_previous: CodeFormState, formData: FormData): Promise<CodeFormState> {
  await requireAdmin();

  const values: CodeFormValues = {
    code: read(formData, "code").toUpperCase().replace(/\s+/g, ""),
    percent: read(formData, "percent"),
    maxUses: read(formData, "maxUses"),
    expires: read(formData, "expires"),
  };
  const errors: CodeFormState["errors"] = {};

  if (!CODE_PATTERN.test(values.code)) errors.code = "Use 3 to 20 letters, numbers, dashes or underscores, like SUMMER20.";

  const percent = Number(values.percent);
  if (values.percent === "" || !Number.isInteger(percent) || percent < 1 || percent > MAX_DISCOUNT_PERCENT) {
    errors.percent = `Enter a whole number from 1 to ${MAX_DISCOUNT_PERCENT}.`;
  }

  let maxUses: number | null = null;
  if (values.maxUses !== "") {
    maxUses = Number(values.maxUses);
    if (!Number.isInteger(maxUses) || maxUses < 1 || maxUses > MAX_USES_LIMIT) errors.maxUses = "Enter a whole number of 1 or more, or leave empty for unlimited.";
  }

  let expiresAt: Date | null = null;
  if (values.expires !== "") {
    expiresAt = /^\d{4}-\d{2}-\d{2}$/.test(values.expires) ? endOfDay(values.expires) : null;
    if (expiresAt === null || Number.isNaN(expiresAt.getTime())) errors.expires = "Choose a valid date.";
    else if (expiresAt.getTime() < Date.now()) errors.expires = "That date has already passed.";
  }

  if (Object.keys(errors).length > 0) return { status: "error", message: "Please fix the highlighted fields.", errors, values };

  try {
    await db.insert(discountCodes).values({ code: values.code, percent, maxUses, expiresAt });
  } catch (error) {
    if (isUniqueViolation(error)) return { status: "error", message: "Please fix the highlighted fields.", errors: { code: "You already have a code with that name." }, values };
    return { status: "error", message: "We couldn't save the code. Please try again.", errors: {}, values };
  }

  revalidatePath("/admin/codes");
  return { status: "ok", message: `Code ${values.code} is live.`, errors: {}, values: EMPTY_CODE_VALUES };
}

export async function setCodeActive(id: number, active: boolean): Promise<void> {
  await requireAdmin();
  await db.update(discountCodes).set({ active }).where(eq(discountCodes.id, id));
  revalidatePath("/admin/codes");
}

/** Deleting a code never changes past orders: they keep the code text and the discount they received. */
export async function deleteCode(id: number): Promise<void> {
  await requireAdmin();
  await db.delete(discountCodes).where(eq(discountCodes.id, id));
  revalidatePath("/admin/codes");
}
