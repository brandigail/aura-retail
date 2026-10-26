const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** The single place money is formatted. Amounts are integer cents everywhere else. */
export function formatMoney(cents: number): string {
  return usd.format(cents / 100);
}

const zar = new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" });

/** Shows a USD-cents amount in Rands at `rate` (ZAR per 1 USD). */
export function formatZar(usdCents: number, rate: number): string {
  return zar.format((usdCents / 100) * rate);
}

export const MAX_DISCOUNT_PERCENT = 90;

/** Price after a whole-percent discount, in integer cents (rounds half up). The catalog's price sort repeats this formula in SQL. */
export function salePrice(cents: number, discountPercent: number): number {
  return Math.floor((cents * (100 - discountPercent) + 50) / 100);
}

/** Parses a user-entered dollar amount like "19.99" into integer cents; null if invalid. */
export function dollarsToCents(input: string): number | null {
  const trimmed = input.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;
  return Math.round(Number(trimmed) * 100);
}
