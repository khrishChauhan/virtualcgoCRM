import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { JwtPayload } from '../services/auth.service';

// ─── Extend Express Request ───────────────────────────────────────────────────
// Augment the global Express Request type so TypeScript knows about req.user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: Role;
        email: string;
      };
    }
  }
}

// ─── verifyToken ──────────────────────────────────────────────────────────────

/**
 * Middleware: verifyToken
 *
 * Extracts the JWT from the Authorization header (Bearer <token>),
 * verifies the signature, and attaches the decoded payload to req.user.
 *
 * Flow:
 *   Client → sends "Authorization: Bearer <token>"
 *   → middleware decodes & verifies
 *   → attaches req.user = { userId, role, email }
 *   → next() continues to the route handler
 */
export const verifyToken = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Access denied. No token provided.', 401);
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new ApiError('JWT_SECRET is not configured.', 500);
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      next(new ApiError('Session expired. Please log in again.', 401));
    } else if (err instanceof jwt.JsonWebTokenError) {
      next(new ApiError('Invalid token.', 401));
    } else {
      next(err);
    }
  }
};

// ─── allowRoles ───────────────────────────────────────────────────────────────

/**
 * Middleware factory: allowRoles(...roles)
 *
 * Usage: allowRoles('SUPER_ADMIN', 'TECH_ADMIN')
 *
 * MUST be used AFTER verifyToken — it assumes req.user is already set.
 *
 * Flow:
 *   verifyToken → allowRoles → route handler
 *
 * If the user's role is not in the allowed list → 403 Forbidden.
 */
export const allowRoles = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError('Unauthorized. Please log in.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `Access denied. Required role: ${roles.join(' or ')}.`,
          403
        )
      );
    }

    next();
  };
};
