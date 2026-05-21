import React from 'react';
import { getAuthUser } from '@/lib/get-auth-user';
import prisma from '@/lib/prisma';
import { LeadTable } from '@/components/leads/lead-table';
import Link from 'next/link';
import { Role } from '@prisma/client';

export default async function LeadsPage() {
  const user = await getAuthUser();

  if (user.role === Role.STAFF) {
    return (
      <div className="flex items-center justify-center h-64 text-on-surface-variant">
        You do not have permission to view leads.
      </div>
    );
  }

  // Sales Admin only sees their own leads
  const where = user.role === Role.SALES_ADMIN 
    ? { createdById: user.userId } 
    : {};

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: {
        select: { name: true }
      },
      _count: {
        select: { tasks: true }
      }
    }
  });

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-primary tracking-tight">Lead Management</h2>
          <p className="text-on-surface-variant font-medium mt-1">
            {user.role === Role.SALES_ADMIN 
              ? 'Manage the leads you have sourced.' 
              : 'Overview of all active client opportunities.'}
          </p>
        </div>
        {user.role === Role.SALES_ADMIN && (
          <Link
            href="/dashboard/leads/new"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Create Lead
          </Link>
        )}
      </div>

      <LeadTable leads={leads as any} userRole={user.role} />
    </>
  );
}
