"use server";

import { checkDiscountCode, type CodeCheck } from "@/lib/discount-codes";

/** Lets the checkout preview a code. The real percentage is looked up again when the order is placed. */
export async function previewDiscountCode(code: string): Promise<CodeCheck> {
  return checkDiscountCode(code);
}
