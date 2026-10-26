"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { parseProductId } from "@/lib/product-id";
import { getProductById } from "@/lib/product-queries";
import { EMPTY_REVIEW_VALUES, type ReviewFormState } from "./review-form-state";
import { validateReview } from "./review-validation";

function failure(message: string, partial: Partial<ReviewFormState> = {}): ReviewFormState {
  return { status: "error", message, errors: {}, values: EMPTY_REVIEW_VALUES, ...partial };
}

export async function submitReview(
  productSegment: string,
  _previous: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  // Honeypot: real users never see or fill this field. A person is told to retry rather than silently dropped.
  const honeypot = formData.get("review_hp_x3");
  if (typeof honeypot === "string" && honeypot !== "") {
    return { status: "error", message: "We couldn't post your review. Please reload the page and try again.", errors: {}, values: EMPTY_REVIEW_VALUES };
  }

  const productId = parseProductId(productSegment);
  if (productId === null || !(await getProductById(productId))) {
    return failure("That product no longer exists.");
  }

  const result = validateReview(formData);
  if (!result.ok) {
    return failure("Please fix the highlighted fields.", { errors: result.errors, values: result.values });
  }

  try {
    await db.insert(reviews).values({ productId, ...result.value });
  } catch {
    return failure("We couldn't save your review. Please try again.", {
      values: { ...result.value, rating: String(result.value.rating) },
    });
  }

  revalidatePath(`/products/${productId}`);
  revalidatePath("/");
  return { status: "success", message: "Thanks for your review!", errors: {}, values: EMPTY_REVIEW_VALUES };
}
