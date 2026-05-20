/**
 * types/auth.ts — Shared authentication TypeScript types
 *
 * These types are imported by both the API layer (Route Handlers)
 * and the Edge middleware — keeping them in a dedicated types/ folder
 * makes them easy to import from anywhere in the project.
 */

import type { Role } from '@prisma/client';

// ─── JWT ──────────────────────────────────────────────────────────────────────

/**
 * The payload embedded inside the JWT token.
 * Must remain small — it is sent with every request as a cookie.
 */
export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}

// ─── Auth responses ───────────────────────────────────────────────────────────

/**
 * Safe user object returned after successful login.
 * Never includes the password hash.
 */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

/**
 * The full response body returned by POST /api/auth/login.
 */
export interface LoginResponse {
  user: AuthUser;
}

// ─── Request body types ───────────────────────────────────────────────────────

export interface LoginRequestBody {
  email: string;
  password: string;
}
