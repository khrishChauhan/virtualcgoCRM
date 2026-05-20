import { Request, Response, NextFunction } from 'express';
import { loginUser } from '../services/auth.service';
import { ApiResponse } from '../utils/ApiResponse';
import { ApiError } from '../utils/ApiError';

/**
 * POST /api/v1/auth/login
 *
 * Body: { email: string, password: string }
 *
 * Validates input → delegates to auth service → returns token + user.
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Basic input validation (no library needed at MVP scale)
    if (!email || typeof email !== 'string') {
      throw new ApiError('Email is required', 400);
    }
    if (!password || typeof password !== 'string') {
      throw new ApiError('Password is required', 400);
    }

    const result = await loginUser({ email: email.trim().toLowerCase(), password });

    res.status(200).json(
      ApiResponse.success(result, 'Login successful')
    );
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/auth/me
 *
 * Returns the currently authenticated user's info.
 * Requires verifyToken middleware to run first.
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // req.user is attached by verifyToken middleware
    res.status(200).json(
      ApiResponse.success(req.user, 'Authenticated user info')
    );
  } catch (err) {
    next(err);
  }
};
