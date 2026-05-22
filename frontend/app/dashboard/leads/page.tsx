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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-[28px] font-semibold tracking-tight text-slate-900">Lead Management</h2>
          <p className="text-[15px] text-slate-500 font-medium mt-1">
            {user.role === Role.SALES_ADMIN 
              ? 'Manage the leads you have sourced.' 
              : 'Overview of all active client opportunities.'}
          </p>
        </div>
        {user.role === Role.SALES_ADMIN && (
          <Link
            href="/dashboard/leads/new"
            className="relative flex items-center justify-center gap-2 rounded-[12px] bg-[#0f172a] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_2px_8px_rgba(15,23,42,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#1e293b] hover:shadow-[0_4px_12px_rgba(15,23,42,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Lead
          </Link>
        )}
      </div>

      <LeadTable leads={leads as any} userRole={user.role} />
    </div>
  );
}
