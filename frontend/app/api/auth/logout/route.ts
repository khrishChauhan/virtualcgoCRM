/**
 * POST /api/auth/logout
 *
 * Clears the HttpOnly auth cookie, effectively logging the user out.
 * The client does not need to do anything special — the browser will
 * stop sending the cookie after it's expired/cleared.
 */

import { NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';
import { apiSuccess } from '@/lib/api-response';

export const runtime = 'nodejs';

export async function POST(): Promise<NextResponse> {
  const response = apiSuccess(null, 'Logged out successfully', 200);
  response.headers.set('Set-Cookie', clearAuthCookie());
  return response;
}
