const UNIQUE_VIOLATION = "23505";

/**
 * True when a database error is Postgres's "unique_violation" (for example, a name that is already taken).
 * Drizzle wraps the driver's error, so the real code sits on `cause`; this looks through the whole chain.
 */
export function isUniqueViolation(error: unknown): boolean {
  let current: unknown = error;
  for (let depth = 0; depth < 5 && current !== null && typeof current === "object"; depth++) {
    const e = current as { code?: unknown; message?: unknown; cause?: unknown };
    if (e.code === UNIQUE_VIOLATION) return true;
    if (typeof e.message === "string" && /duplicate key value violates unique constraint/i.test(e.message)) return true;
    current = e.cause;
  }
  return false;
}
