import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/get-auth-user';
import { ApiError, apiSuccess, withErrorHandler } from '@/lib/api-response';
import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── GET /api/users ───────────────────────────────────────────────────────────
// Super Admin → all users
// Tech Admin → only STAFF users
// Others → 403

export const GET = withErrorHandler(async (_req: NextRequest) => {
  const user = await getAuthUser();

  if (user.role !== Role.SUPER_ADMIN && user.role !== Role.TECH_ADMIN) {
    throw new ApiError('Access denied', 403);
  }

  const where = user.role === Role.TECH_ADMIN ? { role: Role.STAFF } : {};

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return apiSuccess(users, 'Users fetched successfully');
});

// ─── POST /api/users ──────────────────────────────────────────────────────────
// Super Admin → can create any role
// Tech Admin → can only create STAFF

export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await getAuthUser();

  if (user.role !== Role.SUPER_ADMIN && user.role !== Role.TECH_ADMIN) {
    throw new ApiError('Access denied', 403);
  }

  const body = await req.json();
  const { name, email, password, role } = body;

  if (!name || !email || !password || !role) {
    throw new ApiError('Name, email, password, and role are required', 400);
  }

  // Tech Admin can ONLY create STAFF
  if (user.role === Role.TECH_ADMIN && role !== Role.STAFF) {
    throw new ApiError('Tech Admins can only create Staff accounts', 403);
  }

  if (!Object.values(Role).includes(role as Role)) {
    throw new ApiError('Invalid role', 400);
  }

  if (password.length < 6) {
    throw new ApiError('Password must be at least 6 characters', 400);
  }

  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new ApiError('An account with this email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: role as Role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: 'USER_CREATED',
      entityType: 'User',
      entityId: newUser.id,
      userId: user.userId,
      metadata: { createdRole: role },
    },
  });

  return apiSuccess(newUser, 'User created successfully', 201);
});
