import { Request, Response, NextFunction } from 'express';

/**
 * 404 Not Found handler.
 * Catches any requests that didn't match a registered route.
 */
export const notFound = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};
