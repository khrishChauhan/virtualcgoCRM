import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/get-auth-user';
import { ApiError, apiSuccess, withErrorHandler } from '@/lib/api-response';
import { Role } from '@prisma/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── PATCH /api/users/[id] — Toggle active status ────────────────────────────

export const PATCH = withErrorHandler(async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = await getAuthUser();
  const id = (await params).id;

  if (user.role !== Role.SUPER_ADMIN && user.role !== Role.TECH_ADMIN) {
    throw new ApiError('Access denied', 403);
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) throw new ApiError('User not found', 404);

  // Tech Admin can only modify STAFF accounts
  if (user.role === Role.TECH_ADMIN && target.role !== Role.STAFF) {
    throw new ApiError('Tech Admins can only modify Staff accounts', 403);
  }

  // Prevent self-deactivation
  if (target.id === user.userId) {
    throw new ApiError('You cannot deactivate your own account', 400);
  }

  const body = await req.json();
  const { isActive } = body;

  const updated = await prisma.user.update({
    where: { id },
    data: { isActive },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  await prisma.activityLog.create({
    data: {
      action: isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED',
      entityType: 'User',
      entityId: id,
      userId: user.userId,
    },
  });

  return apiSuccess(updated, `User ${isActive ? 'activated' : 'deactivated'} successfully`);
});
