import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/get-auth-user';
import { ApiError, apiSuccess, withErrorHandler } from '@/lib/api-response';
import { TaskStatus, ServiceType, Role } from '@prisma/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── GET /api/tasks ──────────────────────────────────────────────────────────

export const GET = withErrorHandler(async (req: NextRequest) => {
  const user = await getAuthUser();

  // Sales Admin cannot view tasks
  if (user.role === Role.SALES_ADMIN) {
    throw new ApiError('Sales Admins do not have access to tasks', 403);
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') as TaskStatus | null;
  const serviceType = searchParams.get('serviceType') as ServiceType | null;
  const assignedToId = searchParams.get('assignedToId');
  const leadId = searchParams.get('leadId');

  // Build where clause
  const where: any = {};

  if (status) where.status = status;
  if (serviceType) where.serviceType = serviceType;
  if (assignedToId) where.assignedToId = assignedToId;
  if (leadId) where.leadId = leadId;

  // Enforce STAFF view constraint: they can only see tasks assigned to them
  if (user.role === Role.STAFF) {
    where.assignedToId = user.userId;
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      lead: {
        select: {
          ownerName: true,
          businessEmail: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      assignedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return apiSuccess(tasks, 'Tasks fetched successfully');
});

// ─── POST /api/tasks ─────────────────────────────────────────────────────────

export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await getAuthUser();

  // Only TECH_ADMIN and SUPER_ADMIN can create tasks
  if (user.role !== Role.TECH_ADMIN && user.role !== Role.SUPER_ADMIN) {
    throw new ApiError('Only Tech Admins or Super Admins can create tasks', 403);
  }

  const body = await req.json();
  const { title, description, notes, leadId, assignedToId, serviceType, deadline } = body;

  if (!title || !leadId || !assignedToId || !serviceType) {
    throw new ApiError('title, leadId, assignedToId, and serviceType are required', 400);
  }

  // Verify the assignee is actually STAFF (or allow any valid user? Usually STAFF)
  const assignee = await prisma.user.findUnique({ where: { id: assignedToId } });
  if (!assignee) {
    throw new ApiError('Assigned user not found', 404);
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      notes,
      leadId,
      assignedToId,
      assignedById: user.userId,
      serviceType: serviceType as ServiceType,
      deadline: deadline ? new Date(deadline) : null,
      status: TaskStatus.PENDING,
    },
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      action: 'TASK_CREATED',
      entityType: 'Task',
      entityId: task.id,
      userId: user.userId,
      taskId: task.id,
      leadId: task.leadId,
    },
  });

  return apiSuccess(task, 'Task created successfully', 201);
});
