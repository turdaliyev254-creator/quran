import { createHash, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE_NAME = "admin_session";

function sessionToken(password: string): string {
  return createHash("sha256").update(`quran-admin-salt:${password}`).digest("hex");
}

export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function expectedSessionToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return sessionToken(password);
}

export function isValidSession(cookieValue: string | undefined): boolean {
  const expected = expectedSessionToken();
  if (!expected || !cookieValue) return false;
  const a = Buffer.from(cookieValue);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
