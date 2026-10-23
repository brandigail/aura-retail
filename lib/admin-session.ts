import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE_NAME = "aura_admin";
/** Session lifetime in seconds. Tokens are stateless, so this is the only way one stops working. */
export const ADMIN_SESSION_SECONDS = 8 * 60 * 60;

const MIN_SECRET_LENGTH = 32;
const MAX_PASSWORD_LENGTH = 200;

function getSecret(): string | null {
  const secret = process.env.SESSION_SECRET;
  return secret && secret.length >= MIN_SECRET_LENGTH ? secret : null;
}

/** False when ADMIN_PASSWORD is empty or SESSION_SECRET is missing/too short: logging in must be impossible. */
export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD) && getSecret() !== null;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/** Constant-time comparison: hashing first gives equal-length buffers whatever the input length. */
export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || input.length > MAX_PASSWORD_LENGTH) return false;
  return timingSafeEqual(digest(input), digest(expected));
}

/** A token is `base64url(payload).signature`; the payload only carries the expiry. */
export function createSessionToken(nowMs = Date.now()): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(nowMs / 1000) + ADMIN_SESSION_SECONDS })).toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySessionToken(token: string | undefined, nowMs = Date.now()): boolean {
  const secret = getSecret();
  if (!token || !secret) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;

  const expected = Buffer.from(sign(payload, secret));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return false;

  try {
    const { exp } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { exp?: unknown };
    return typeof exp === "number" && exp > Math.floor(nowMs / 1000);
  } catch {
    return false;
  }
}
