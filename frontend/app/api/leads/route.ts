import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/get-auth-user';
import { ApiError, apiSuccess, withErrorHandler } from '@/lib/api-response';
import { Role, ServiceType } from '@prisma/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── GET /api/leads ───────────────────────────────────────────────────────────
// Sales Admin → their own leads only
// Tech Admin / Super Admin → all leads
// Staff → 403

export const GET = withErrorHandler(async (_req: NextRequest) => {
  const user = await getAuthUser();

  if (user.role === Role.STAFF) {
    throw new ApiError('Staff members do not have access to leads', 403);
  }

  const where = user.role === Role.SALES_ADMIN
    ? { createdById: user.userId }
    : {};

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: { select: { id: true, name: true } },
      _count: { select: { tasks: true } },
    },
  });

  return apiSuccess(leads, 'Leads fetched successfully');
});

// ─── POST /api/leads ──────────────────────────────────────────────────────────
// Sales Admin ONLY can create leads

export const POST = withErrorHandler(async (req: NextRequest) => {
  const user = await getAuthUser();

  if (user.role !== Role.SALES_ADMIN) {
    throw new ApiError('Only Sales Admins can create leads', 403);
  }

  const body = await req.json();
  const {
    ownerName,
    businessEmail,
    phone,
    businessAddress,
    businessCategory,
    businessDescription,
    requiredServices,
    brandColors,
    logoLink,
    driveLink,
    instagramLink,
    facebookLink,
    linkedinLink,
  } = body;

  if (!ownerName || !businessEmail) {
    throw new ApiError('Owner name and business email are required', 400);
  }

  const lead = await prisma.lead.create({
    data: {
      ownerName,
      businessEmail,
      phone: phone || null,
      businessAddress: businessAddress || null,
      businessCategory: businessCategory || null,
      businessDescription: businessDescription || null,
      requiredServices: requiredServices
        ? (requiredServices as string[]).filter((s) =>
            Object.values(ServiceType).includes(s as ServiceType)
          ) as ServiceType[]
        : [],
      brandColors: brandColors || null,
      logoLink: logoLink || null,
      driveLink: driveLink || null,
      instagramLink: instagramLink || null,
      facebookLink: facebookLink || null,
      linkedinLink: linkedinLink || null,
      createdById: user.userId,
    },
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      action: 'LEAD_CREATED',
      entityType: 'Lead',
      entityId: lead.id,
      userId: user.userId,
      leadId: lead.id,
    },
  });

  return apiSuccess(lead, 'Lead created successfully', 201);
});
