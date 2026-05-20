/**
 * middleware.ts — Next.js Edge Middleware
 *
 * Runs at the Edge (before any page renders) on every matched request.
 * Handles two jobs:
 *
 * 1. AUTHENTICATION GUARD
 *    Unauthenticated users visiting protected routes → redirect to /login
 *
 * 2. AUTH REDIRECT
 *    Already-authenticated users visiting /login → redirect to /dashboard
 *
 * WHY jose?
 * This file runs in the Edge Runtime. Node.js built-in modules (like `crypto`)
 * are NOT available at the Edge. `jose` uses the Web Crypto API which runs
 * everywhere — Node.js, Edge, and browsers.
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

// ─── Config ───────────────────────────────────────────────────────────────────

/**
 * Routes that require authentication.
 * The middleware will redirect unauthenticated users to /login.
 */
const PROTECTED_ROUTES = ['/dashboard'];

/**
 * Routes that authenticated users should NOT visit.
 * If they do, they get redirected to /dashboard.
 */
const AUTH_ROUTES = ['/login'];

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getTokenPayload(token: string) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? '');
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Read the auth cookie
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? await getTokenPayload(token) : null;
  const isAuthenticated = payload !== null;

  // ── Protect dashboard & other protected routes ────────────────────────────
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname); // preserve destination
    return NextResponse.redirect(loginUrl);
  }

  // ── Redirect authenticated users away from /login ─────────────────────────
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────

/**
 * Specify which routes the middleware should run on.
 * Exclude static assets and Next.js internals for performance.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (png, svg, etc.)
     * - /api routes (API routes handle their own auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api/).*)',
  ],
};
