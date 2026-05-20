import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import prisma from '../prisma/client';
import { ApiError } from '../utils/ApiError';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string;
  password: string;
}

export interface JwtPayload {
  userId: string;
  role: Role;
  email: string;
}

export interface AuthResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
}

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Validates credentials and returns a signed JWT + safe user object.
 *
 * Flow:
 *  1. Look up the user by email (unique index — fast O(1) lookup)
 *  2. Compare the incoming password against the stored bcrypt hash
 *  3. Sign a JWT containing userId, role, email
 *  4. Return token + sanitized user (no password hash exposed)
 */
export const loginUser = async (
  payload: LoginPayload
): Promise<AuthResult> => {
  const { email, password } = payload;

  // 1. Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError('Invalid email or password', 401);
  }

  // 2. Check active status
  if (!user.isActive) {
    throw new ApiError('Your account has been deactivated. Contact admin.', 403);
  }

  // 3. Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError('Invalid email or password', 401);
  }

  // 4. Sign token
  const jwtPayload: JwtPayload = {
    userId: user.id,
    role: user.role,
    email: user.email,
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new ApiError('JWT_SECRET is not configured', 500);

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as SignOptions['expiresIn'],
  };

  const token = jwt.sign(jwtPayload, secret, options);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Hashes a plain-text password using bcrypt with a cost factor of 12.
 * Call this from the seed script or future user-creation endpoint.
 */
export const hashPassword = async (plain: string): Promise<string> => {
  return bcrypt.hash(plain, 12);
};
