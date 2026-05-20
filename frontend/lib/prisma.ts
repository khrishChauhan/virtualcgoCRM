import { PrismaClient } from '@prisma/client';

// ─── Global type augmentation ─────────────────────────────────────────────────
// Prevents TypeScript from complaining about globalThis.prisma
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

/**
 * Singleton Prisma Client
 *
 * Next.js hot-reloads modules in development, which would normally
 * create a new PrismaClient (and a new connection pool) on every reload.
 * By attaching the instance to `globalThis`, we reuse the same client
 * across hot-reloads.
 *
 * In production, a fresh PrismaClient is created per cold-start.
 * Supabase pgBouncer handles connection pooling at the infrastructure level.
 */
const prisma: PrismaClient =
  globalThis.__prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export default prisma;
