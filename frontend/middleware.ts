/**
 * middleware.ts — Next.js Edge Middleware
 *
 * Runs on the Edge Runtime before every matched request.
 * This file must be 100% Edge-compatible:
 *   ✅ jose (Web Crypto API)
 *   ✅ next/server
 *   ❌ NO Node.js built-ins (crypto, fs, path, etc.)
 *   ❌ NO prisma / bcryptjs
 *   ❌ NO imports from lib/get-auth-user (uses next/headers — not Edge-safe in middleware)
 *
 * Auth cookie name is inlined here intentionally to avoid
 * importing from lib/auth (which transitively pulls in SignJWT/jose
 * in a way that may confuse the Edge bundler on some Vercel versions).
 */

import { type NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// ─── Constants ────────────────────────────────────────────────────────────────

/** Must match AUTH_COOKIE_NAME in lib/auth.ts */
const AUTH_COOKIE = 'vcgo_token';

const PROTECTED_PREFIXES = ['/dashboard'];
const PUBLIC_ONLY_PREFIXES = ['/login'];

// ─── Helper ───────────────────────────────────────────────────────────────────

async function isValidToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? '');
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const authenticated = token ? await isValidToken(token) : false;

  // Protect /dashboard and sub-routes
  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (!authenticated) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from /login
  if (PUBLIC_ONLY_PREFIXES.some((p) => pathname.startsWith(p))) {
    if (authenticated) {
      const url = req.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

export const config = {
  matcher: [
    /*
     * Run middleware on all routes EXCEPT:
     * - Next.js internals (_next/static, _next/image)
     * - Static file extensions (svg, png, jpg, etc.)
     * - favicon.ico
     * - /api/* routes (they handle their own auth)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$|api/).*)',
  ],
};
