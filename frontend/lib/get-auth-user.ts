import { cookies } from 'next/headers';
import { verifyToken, AUTH_COOKIE_NAME } from '@/lib/auth';
import { ApiError } from '@/lib/api-response';
import type { JwtPayload } from '@/types/auth';

/**
 * Server-side helper to get the authenticated user from the request cookies.
 * This is meant to be called from inside App Router Route Handlers (API routes)
 * or Server Components.
 *
 * It throws an ApiError(401) if the user is not authenticated or the token is invalid.
 *
 * @returns JwtPayload { userId, email, role }
 */
export async function getAuthUser(): Promise<JwtPayload> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    throw new ApiError('Not authenticated. Please log in.', 401);
  }

  try {
    const payload = await verifyToken(token);
    return payload;
  } catch (err) {
    throw new ApiError('Session expired or invalid. Please log in again.', 401);
  }
}
