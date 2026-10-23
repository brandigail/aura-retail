"use server";

import { revalidatePath } from "next/cache";
import { createOrder } from "@/lib/create-order";
import { initialCheckoutState, type CheckoutFormState } from "./checkout-types";
import { validateCheckout } from "./checkout-validation";

export async function placeOrder(_previous: CheckoutFormState, formData: FormData): Promise<CheckoutFormState> {
  // Honeypot: real users never see this field. Fail quietly so bots can't tell.
  const honeypot = formData.get("website");
  if (typeof honeypot === "string" && honeypot !== "") {
    return { ...initialCheckoutState, status: "error", message: "We couldn't place your order. Please try again." };
  }

  const result = validateCheckout(formData);
  if (!result.ok) {
    return { ...initialCheckoutState, status: "error", message: result.message, errors: result.errors, values: result.values };
  }

  const { name, email, address, lines } = result.value;
  const values = { name, email, address };

  try {
    const order = await createOrder({ name, email, address }, lines);
    if (!order.ok) {
      return {
        ...initialCheckoutState,
        status: "conflict",
        message: "Some items in your cart have changed. Review the changes below, then try again.",
        values,
        conflicts: order.conflicts,
      };
    }
    revalidatePath("/");
    revalidatePath("/products/[id]", "page");
    return { ...initialCheckoutState, status: "success", message: "Order placed!", token: order.token };
  } catch {
    return { ...initialCheckoutState, status: "error", message: "We couldn't place your order. Please try again.", values };
  }
}
