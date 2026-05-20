import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/get-auth-user';
import { ApiError, apiSuccess, withErrorHandler } from '@/lib/api-response';
import { Role } from '@prisma/client';

export const runtime = 'nodejs';

// ─── GET /api/tasks/[id] ─────────────────────────────────────────────────────

export const GET = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await getAuthUser();
  const id = (await params).id;

  if (user.role === Role.SALES_ADMIN) {
    throw new ApiError('Sales Admins do not have access to tasks', 403);
  }

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      lead: true,
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
      assignedBy: {
        select: { id: true, name: true, email: true },
      },
      activityLogs: {
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          user: { select: { name: true } },
        },
      },
    },
  });

  if (!task) {
    throw new ApiError('Task not found', 404);
  }

  // Enforce STAFF view constraint
  if (user.role === Role.STAFF && task.assignedToId !== user.userId) {
    throw new ApiError('You do not have permission to view this task', 403);
  }

  return apiSuccess(task, 'Task fetched successfully');
});
