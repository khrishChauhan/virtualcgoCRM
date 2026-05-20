/**
 * lib/auth.ts — JWT helpers using `jose`
 *
 * WHY jose instead of jsonwebtoken?
 * Next.js middleware runs on the Edge Runtime, which does NOT have access
 * to Node.js built-in modules (like `crypto`). `jsonwebtoken` depends on
 * Node.js crypto — it breaks at the Edge. `jose` uses the Web Crypto API
 * which runs everywhere: Node.js, Edge Runtime, and browsers.
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import type { JwtPayload } from '@/types/auth';

// ─── Secret ───────────────────────────────────────────────────────────────────

/**
 * Encode the JWT_SECRET string as a Uint8Array.
 * jose requires a CryptoKey or Uint8Array, not a plain string.
 */
function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set.');
  }
  return new TextEncoder().encode(secret);
}

// ─── Sign ─────────────────────────────────────────────────────────────────────

/**
 * Signs a JWT token with the application secret.
 *
 * @param payload - { userId, email, role }
 * @returns Signed JWT string
 */
export async function signToken(payload: JwtPayload): Promise<string> {
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? '7d') as string;

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());
}

// ─── Verify ───────────────────────────────────────────────────────────────────

/**
 * Verifies a JWT token and returns the decoded payload.
 * Throws if the token is invalid or expired.
 *
 * @param token - The raw JWT string
 * @returns Decoded JwtPayload
 */
export async function verifyToken(token: string): Promise<JwtPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as JWTPayload & JwtPayload;
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

/** Name of the auth cookie stored in the browser. */
export const AUTH_COOKIE_NAME = 'vcgo_token';

/**
 * Builds the Set-Cookie header string for setting the auth token.
 * HttpOnly = cannot be read by JavaScript (XSS protection).
 * SameSite=Lax = CSRF protection for same-origin requests.
 */
export function buildAuthCookie(token: string): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const maxAge = 60 * 60 * 24 * 7; // 7 days in seconds

  return [
    `${AUTH_COOKIE_NAME}=${token}`,
    `Max-Age=${maxAge}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    ...(isProduction ? ['Secure'] : []),
  ].join('; ');
}

/**
 * Builds the Set-Cookie header string for clearing the auth token.
 */
export function clearAuthCookie(): string {
  return `${AUTH_COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax`;
}
