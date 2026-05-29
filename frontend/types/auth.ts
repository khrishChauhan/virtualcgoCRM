

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
