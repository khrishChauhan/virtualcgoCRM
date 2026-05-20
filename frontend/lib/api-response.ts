/**
 * lib/api-response.ts — Standardized API response helpers
 *
 * Provides consistent JSON response shapes across all Route Handlers.
 * Port of the Express-era ApiResponse and ApiError classes.
 */

import { NextResponse } from 'next/server';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiSuccessBody<T = unknown> {
  status: 'success';
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorBody {
  status: 'error';
  message: string;
  timestamp: string;
}

// ─── ApiError ─────────────────────────────────────────────────────────────────

/**
 * Application-level custom error.
 * Throw this anywhere in a Route Handler to return a clean JSON error response.
 *
 * @example
 *   throw new ApiError('Invalid credentials', 401);
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ─── Response builders ────────────────────────────────────────────────────────

/**
 * Returns a standardized JSON success response.
 *
 * @example
 *   return apiSuccess({ user }, 'Login successful', 200);
 */
export function apiSuccess<T>(
  data: T,
  message: string = 'Success',
  status: number = 200
): NextResponse<ApiSuccessBody<T>> {
  return NextResponse.json(
    {
      status: 'success',
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Returns a standardized JSON error response.
 *
 * @example
 *   return apiError('Not found', 404);
 */
export function apiError(
  message: string,
  status: number = 500
): NextResponse<ApiErrorBody> {
  return NextResponse.json(
    {
      status: 'error',
      message,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Wraps a Route Handler to automatically catch ApiError and unexpected errors,
 * returning clean JSON for both.
 *
 * @example
 *   export const POST = withErrorHandler(async (req) => { ... });
 */
export function withErrorHandler(
  handler: (req: Request) => Promise<NextResponse>
) {
  return async (req: Request): Promise<NextResponse> => {
    try {
      return await handler(req);
    } catch (err) {
      if (err instanceof ApiError) {
        return apiError(err.message, err.statusCode);
      }
      console.error('[API Error]', err);
      return apiError('Internal server error', 500);
    }
  };
}
