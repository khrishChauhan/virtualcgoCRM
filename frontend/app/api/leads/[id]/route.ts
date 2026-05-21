import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/get-auth-user';
import { ApiError, apiSuccess, withErrorHandler } from '@/lib/api-response';
import { Role, LeadStatus } from '@prisma/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── GET /api/leads/[id] ──────────────────────────────────────────────────────

export const GET = withErrorHandler(async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = await getAuthUser();
  const id = (await params).id;

  if (user.role === Role.STAFF) {
    throw new ApiError('Staff members do not have access to leads', 403);
  }

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      tasks: {
        orderBy: { createdAt: 'desc' },
        include: {
          assignedTo: { select: { id: true, name: true } },
        },
      },
      activityLogs: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { user: { select: { name: true } } },
      },
    },
  });

  if (!lead) throw new ApiError('Lead not found', 404);

  // Sales Admin can only see their own leads
  if (user.role === Role.SALES_ADMIN && lead.createdById !== user.userId) {
    throw new ApiError('You do not have access to this lead', 403);
  }

  return apiSuccess(lead, 'Lead fetched successfully');
});

// ─── PUT /api/leads/[id] — Update lead status ────────────────────────────────
// Tech Admin + Super Admin only

export const PUT = withErrorHandler(async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const user = await getAuthUser();
  const id = (await params).id;

  if (user.role !== Role.TECH_ADMIN && user.role !== Role.SUPER_ADMIN) {
    throw new ApiError('Only Tech Admin or Super Admin can update lead status', 403);
  }

  const body = await req.json();
  const { status } = body;

  if (!status || !Object.values(LeadStatus).includes(status)) {
    throw new ApiError('Valid status is required', 400);
  }

  const lead = await prisma.lead.findUnique({ where: { id } });
  if (!lead) throw new ApiError('Lead not found', 404);

  const updated = await prisma.lead.update({
    where: { id },
    data: { status },
  });

  await prisma.activityLog.create({
    data: {
      action: 'LEAD_STATUS_CHANGED',
      entityType: 'Lead',
      entityId: id,
      userId: user.userId,
      leadId: id,
      metadata: { oldStatus: lead.status, newStatus: status },
    },
  });

  return apiSuccess(updated, 'Lead status updated');
});
