/**
 * GET /api/health
 *
 * Health check endpoint. Used by Vercel, uptime monitors, and CI pipelines
 * to verify that the application is running and the process is alive.
 *
 * Note: Does NOT check the database — use a separate /api/health/db route
 * for that in the future to keep this lightweight.
 */

import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(): Promise<NextResponse> {
  const uptime = process.uptime();
  const minutes = Math.floor(uptime / 60);
  const seconds = Math.floor(uptime % 60);

  return NextResponse.json(
    {
      status: 'ok',
      service: 'VirtualCGO API',
      version: '2.0.0',
      environment: process.env.NODE_ENV ?? 'development',
      timestamp: new Date().toISOString(),
      uptime: `${minutes}m ${seconds}s`,
    },
    { status: 200 }
  );
}
