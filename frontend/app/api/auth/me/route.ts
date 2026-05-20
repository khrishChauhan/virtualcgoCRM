/**
 * GET /api/auth/me
 *
 * Returns the currently authenticated user's profile.
 * Reads the HttpOnly JWT cookie, verifies it, then fetches
 * fresh data from the database to ensure the user is still active.
 *
 * Used by the frontend to hydrate user state after page load.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { ApiError, apiSuccess, apiError } from '@/lib/api-response';

export const runtime = 'nodejs';

export async function GET(_req: NextRequest): Promise<NextResponse> {
  try {
    // ── 1. Read auth cookie ────────────────────────────────────────────────
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
      throw new ApiError('Not authenticated. Please log in.', 401);
    }

    // ── 2. Verify JWT ──────────────────────────────────────────────────────
    let payload;
    try {
      payload = await verifyToken(token);
    } catch {
      throw new ApiError('Session expired or invalid. Please log in again.', 401);
    }

    // ── 3. Fetch fresh user from DB ────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new ApiError('User not found or account deactivated.', 401);
    }

    return apiSuccess(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      'Authenticated user info'
    );
  } catch (err) {
    if (err instanceof ApiError) {
      return apiError(err.message, err.statusCode);
    }
    console.error('[GET /api/auth/me]', err);
    return apiError('Internal server error', 500);
  }
}
