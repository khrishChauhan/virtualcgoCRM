import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/get-auth-user';
import { ApiError, apiSuccess, withErrorHandler } from '@/lib/api-response';
import { TaskStatus, Role } from '@prisma/client';

export const runtime = 'nodejs';

// ─── PUT /api/tasks/[id]/status ──────────────────────────────────────────────

export const PUT = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await getAuthUser();
  const id = (await params).id;

  if (user.role === Role.SALES_ADMIN) {
    throw new ApiError('Sales Admins do not have access to tasks', 403);
  }

  const body = await req.json();
  const { status } = body;

  if (!status || !Object.values(TaskStatus).includes(status)) {
    throw new ApiError('Valid status is required', 400);
  }

  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    throw new ApiError('Task not found', 404);
  }

  // Enforce STAFF update constraint
  if (user.role === Role.STAFF) {
    if (task.assignedToId !== user.userId) {
      throw new ApiError('You can only update tasks assigned to you', 403);
    }
    // Staff can only move to IN_PROGRESS or REVIEW
    if (status !== TaskStatus.IN_PROGRESS && status !== TaskStatus.REVIEW && status !== task.status) {
      throw new ApiError('Staff can only update status to IN_PROGRESS or REVIEW', 403);
    }
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { status },
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      action: 'TASK_STATUS_CHANGED',
      entityType: 'Task',
      entityId: task.id,
      userId: user.userId,
      taskId: task.id,
      leadId: task.leadId,
      metadata: { oldStatus: task.status, newStatus: status },
    },
  });

  return apiSuccess(updatedTask, 'Task status updated successfully');
});
