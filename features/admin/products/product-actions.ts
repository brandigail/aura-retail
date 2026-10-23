"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { products } from "@/db/schema";
import { slugTaken } from "@/lib/admin-product-queries";
import { requireAdmin } from "@/lib/admin-auth";
import { attemptProductDeletion, cancelProductDeletion } from "@/lib/product-deletion";
import { EMPTY_PRODUCT_VALUES, type ProductFormState } from "./product-form-state";
import { readProductValues, validateProduct } from "./product-validation";

export interface DeleteProductState {
  status: "idle" | "deleted" | "awaiting" | "error";
  message: string;
}

function refreshCatalog(productId?: number): void {
  revalidatePath("/");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
  if (productId !== undefined) revalidatePath(`/products/${productId}`);
}

function formError(message: string, partial: Partial<ProductFormState> = {}): ProductFormState {
  return { status: "error", message, errors: {}, values: EMPTY_PRODUCT_VALUES, ...partial };
}

/** Postgres unique_violation, which neon-http surfaces on `code` or only in the message. */
function isUniqueViolation(error: unknown): boolean {
  const e = error as { code?: string; message?: string } | null;
  return e?.code === "23505" || /unique constraint|duplicate key/i.test(e?.message ?? "");
}

export async function createProduct(_previous: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin();

  const result = validateProduct(formData);
  if (!result.ok) return formError("Please fix the highlighted fields.", { errors: result.errors, values: result.values });

  const values = readProductValues(formData);

  if (await slugTaken(result.value.slug)) {
    return formError("Please fix the highlighted fields.", { errors: { slug: "That slug is already used by another product." }, values });
  }

  try {
    await db.insert(products).values(result.value);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return formError("Please fix the highlighted fields.", { errors: { slug: "That slug is already used by another product." }, values });
    }
    return formError("We couldn't save the product. Please try again.", { values });
  }

  refreshCatalog();
  redirect("/admin/products");
}

export async function updateProduct(
  productId: number,
  _previous: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireAdmin();

  const result = validateProduct(formData);
  if (!result.ok) return formError("Please fix the highlighted fields.", { errors: result.errors, values: result.values });

  const values = readProductValues(formData);

  if (await slugTaken(result.value.slug, productId)) {
    return formError("Please fix the highlighted fields.", { errors: { slug: "That slug is already used by another product." }, values });
  }

  try {
    const updated = await db.update(products).set(result.value).where(eq(products.id, productId)).returning({ id: products.id });
    if (updated.length === 0) return formError("That product no longer exists.", { values });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return formError("Please fix the highlighted fields.", { errors: { slug: "That slug is already used by another product." }, values });
    }
    return formError("We couldn't save the product. Please try again.", { values });
  }

  refreshCatalog(productId);
  redirect("/admin/products");
}

export async function deleteProduct(productId: number): Promise<DeleteProductState> {
  await requireAdmin();

  try {
    const outcome = await attemptProductDeletion(productId);
    refreshCatalog(productId);
    switch (outcome.status) {
      case "deleted":
        return { status: "deleted", message: "Product deleted." };
      case "not_found":
        return { status: "error", message: "That product no longer exists." };
      case "awaiting": {
        const waiting = outcome.total - outcome.acknowledged;
        return {
          status: "awaiting",
          message: `Not deleted yet: ${waiting} customer${waiting === 1 ? " has" : "s have"} not accepted the removal notice. The product is hidden from the store until then.`,
        };
      }
    }
  } catch {
    return { status: "error", message: "We couldn't delete the product. Please try again." };
  }
}

export async function cancelDeletion(productId: number): Promise<void> {
  await requireAdmin();
  await cancelProductDeletion(productId);
  refreshCatalog(productId);
}
