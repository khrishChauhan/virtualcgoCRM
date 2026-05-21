import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/get-auth-user';
import { ApiError, apiSuccess, withErrorHandler } from '@/lib/api-response';
import { Role } from '@prisma/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── PUT /api/tasks/[id]/assign ──────────────────────────────────────────────

export const PUT = withErrorHandler(async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const user = await getAuthUser();
  const id = (await params).id;

  // Only TECH_ADMIN and SUPER_ADMIN can assign tasks
  if (user.role !== Role.TECH_ADMIN && user.role !== Role.SUPER_ADMIN) {
    throw new ApiError('Only Tech Admins or Super Admins can re-assign tasks', 403);
  }

  const body = await req.json();
  const { assignedToId } = body;

  if (!assignedToId) {
    throw new ApiError('assignedToId is required', 400);
  }

  const task = await prisma.task.findUnique({
    where: { id },
  });

  if (!task) {
    throw new ApiError('Task not found', 404);
  }

  // Verify new assignee exists
  const assignee = await prisma.user.findUnique({ where: { id: assignedToId } });
  if (!assignee) {
    throw new ApiError('Assigned user not found', 404);
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: { 
      assignedToId,
      assignedById: user.userId // Record who made the change
    },
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      action: 'TASK_ASSIGNED',
      entityType: 'Task',
      entityId: task.id,
      userId: user.userId,
      taskId: task.id,
      leadId: task.leadId,
      metadata: { oldAssignee: task.assignedToId, newAssignee: assignedToId },
    },
  });

  return apiSuccess(updatedTask, 'Task successfully re-assigned');
});
