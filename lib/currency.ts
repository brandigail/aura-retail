const DEFAULT_ZAR_PER_USD = 18.5;

/**
 * Rands per US dollar for admin display. A fixed, manually maintained rate (`ZAR_PER_USD` env var)
 * because live rates need a third-party service; prices are always stored and charged in USD.
 */
export function getZarRate(): number {
  const rate = Number(process.env.ZAR_PER_USD);
  return Number.isFinite(rate) && rate > 0 ? rate : DEFAULT_ZAR_PER_USD;
}
