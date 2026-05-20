import { Request, Response } from 'express';

/**
 * GET /api/v1/health
 * Public health check endpoint for uptime monitoring and deployment validation.
 */
export const getHealth = (_req: Request, res: Response): void => {
  const healthPayload = {
    status: 'ok',
    service: 'VirtualCGO API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  };

  res.status(200).json(healthPayload);
};
