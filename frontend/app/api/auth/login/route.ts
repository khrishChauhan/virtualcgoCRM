/**
 * POST /api/auth/login
 *
 * Authenticates a user with email + password.
 * On success, sets an HttpOnly JWT cookie and returns the safe user object.
 *
 * Flow:
 *  1. Parse & validate request body
 *  2. Find user in DB by email
 *  3. Check isActive flag
 *  4. bcrypt.compare password against stored hash
 *  5. Sign JWT with jose
 *  6. Set HttpOnly cookie via Set-Cookie header
 *  7. Return { user } (no token in body — it's in the cookie)
 */

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken, buildAuthCookie } from '@/lib/auth';
import { ApiError, apiSuccess, apiError } from '@/lib/api-response';
import type { LoginRequestBody, LoginResponse } from '@/types/auth';

export const runtime = 'nodejs'; // bcryptjs requires Node.js runtime

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // ── 1. Parse body ──────────────────────────────────────────────────────
    let body: LoginRequestBody;
    try {
      body = await req.json();
    } catch {
      throw new ApiError('Invalid JSON in request body', 400);
    }

    const { email, password } = body;

    // ── 2. Validate input ──────────────────────────────────────────────────
    if (!email || typeof email !== 'string' || !email.trim()) {
      throw new ApiError('Email is required', 400);
    }
    if (!password || typeof password !== 'string') {
      throw new ApiError('Password is required', 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ── 3. Find user ───────────────────────────────────────────────────────
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      // Deliberately vague — don't reveal whether the email exists
      throw new ApiError('Invalid email or password', 401);
    }

    // ── 4. Check active status ─────────────────────────────────────────────
    if (!user.isActive) {
      throw new ApiError(
        'Your account has been deactivated. Please contact admin.',
        403
      );
    }

    // ── 5. Verify password ─────────────────────────────────────────────────
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new ApiError('Invalid email or password', 401);
    }

    // ── 6. Sign JWT ────────────────────────────────────────────────────────
    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // ── 7. Build response with HttpOnly cookie ─────────────────────────────
    const responseData: LoginResponse = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    const response = apiSuccess(responseData, 'Login successful', 200);
    response.headers.set('Set-Cookie', buildAuthCookie(token));

    return response;
  } catch (err) {
    if (err instanceof ApiError) {
      return apiError(err.message, err.statusCode);
    }
    console.error('[POST /api/auth/login]', err);
    return apiError('Internal server error', 500);
  }
}
