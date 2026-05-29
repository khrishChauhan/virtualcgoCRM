export interface JwtPayload {
  userId: string;
  email: string;
  role: Role;
}



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
