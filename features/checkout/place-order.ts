"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createOrder, type OrderOptions } from "@/lib/create-order";
import { checkDemoCard } from "@/lib/demo-payment";
import { checkDiscountCode } from "@/lib/discount-codes";
import { initialCheckoutState, type CheckoutFormState } from "./checkout-types";
import { validateCheckout } from "./checkout-validation";

function failure(message: string, extra: Partial<CheckoutFormState> = {}): CheckoutFormState {
  return { ...initialCheckoutState, status: "error", message, ...extra };
}

export async function placeOrder(_previous: CheckoutFormState, formData: FormData): Promise<CheckoutFormState> {
  // Honeypot: real users never see this field. Fail quietly so bots can't tell.
  const honeypot = formData.get("checkout_hp_x9");
  if (typeof honeypot === "string" && honeypot !== "") return failure("We couldn't place your order. Please try again.");

  const result = validateCheckout(formData);
  if (!result.ok) return failure(result.message, { errors: result.errors, values: result.values });

  const { name, email, address, lines, shippingMethod, paymentMethod, discountCode } = result.value;
  const values = { name, email, address };

  // The discount percentage is looked up again here; the browser's idea of it is only a preview.
  let discount: OrderOptions["discount"] = null;
  if (discountCode !== "") {
    const check = await checkDiscountCode(discountCode);
    if (!check.ok) return failure(`${check.message} Remove it or try another code.`, { values });
    discount = { code: check.code, percent: check.percent };
  }

  let payment: OrderOptions["payment"];
  if (paymentMethod === "card") {
    const card = checkDemoCard(formData);
    if (!card.ok) return failure(card.message, { errors: card.errors, values });
    payment = { label: `Card ending ${card.last4} (demo)`, ref: `DEMO-${randomUUID().slice(0, 8).toUpperCase()}`, status: "paid" };
  } else {
    payment = { label: "EFT / bank transfer", ref: null, status: "pending" };
  }

  try {
    const order = await createOrder({ name, email, address }, lines, { shippingMethod, discount, payment });
    if (!order.ok) {
      return {
        ...initialCheckoutState,
        status: "conflict",
        message: "Some items in your cart have changed. Review the changes below, then try again. You have not been charged.",
        values,
        conflicts: order.conflicts,
      };
    }
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/orders");
    revalidatePath("/products/[id]", "page");
    return { ...initialCheckoutState, status: "success", message: "Order placed!", token: order.token };
  } catch {
    return failure("We couldn't place your order. You have not been charged. Please try again.", { values });
  }
}
