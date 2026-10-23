const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

/** The single place money is formatted. Amounts are integer cents everywhere else. */
export function formatMoney(cents: number): string {
  return usd.format(cents / 100);
}

/** Parses a user-entered dollar amount like "19.99" into integer cents; null if invalid. */
export function dollarsToCents(input: string): number | null {
  const trimmed = input.trim();
  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;
  return Math.round(Number(trimmed) * 100);
}
