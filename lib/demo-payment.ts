export type PaymentMethod = "card" | "eft";

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === "card" || value === "eft";
}

/** The documented test numbers. Anything else is refused, so a real card number is never processed or stored. */
export const TEST_CARD_APPROVED = "4242424242424242";
export const TEST_CARD_DECLINED = "4000000000000002";

export type CardErrors = Partial<Record<"cardNumber" | "cardExpiry" | "cardCvc", string>>;

export type CardResult =
  | { ok: true; last4: string }
  | { ok: false; declined: boolean; errors: CardErrors; message: string };

function digits(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.replace(/\D/g, "") : "";
}

/**
 * Checks the demo card fields. Only the last four digits ever leave this function.
 * `now` is a parameter so expiry can be tested.
 */
export function checkDemoCard(formData: FormData, now: Date = new Date()): CardResult {
  const number = digits(formData.get("cardNumber"));
  const cvc = digits(formData.get("cardCvc"));
  const expiry = digits(formData.get("cardExpiry"));
  const errors: CardErrors = {};

  if (number !== TEST_CARD_APPROVED && number !== TEST_CARD_DECLINED) {
    errors.cardNumber = "Demo mode: please use the test card 4242 4242 4242 4242.";
  }

  const month = Number(expiry.slice(0, 2));
  const year = 2000 + Number(expiry.slice(2, 4));
  const validShape = expiry.length === 4 && month >= 1 && month <= 12;
  if (!validShape) errors.cardExpiry = "Enter the expiry as MM/YY.";
  else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) errors.cardExpiry = "That card has expired.";

  if (cvc.length < 3 || cvc.length > 4) errors.cardCvc = "Enter the 3 or 4 digit security code.";

  if (Object.keys(errors).length > 0) return { ok: false, declined: false, errors, message: "Please check your card details." };
  if (number === TEST_CARD_DECLINED) return { ok: false, declined: true, errors: {}, message: "Your card was declined (demo). Try the test card 4242 4242 4242 4242." };
  return { ok: true, last4: number.slice(-4) };
}
