const MAX_INT4 = 2_147_483_647;

/** Parses a route segment into a positive integer id that fits the DB column, or null. */
export function parseProductId(segment: string): number | null {
  return /^[1-9]\d{0,9}$/.test(segment) && Number(segment) <= MAX_INT4 ? Number(segment) : null;
}
