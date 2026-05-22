import React from 'react';
import { getAuthUser } from '@/lib/get-auth-user';
import prisma from '@/lib/prisma';
import { TaskForm } from '@/components/tasks/task-form';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import Link from 'next/link';

export default async function NewTaskPage({ searchParams }: { searchParams: Promise<{ leadId?: string }> }) {
  const user = await getAuthUser();
  const { leadId } = await searchParams;

  if (user.role !== Role.TECH_ADMIN && user.role !== Role.SUPER_ADMIN) {
    redirect('/dashboard');
  }

  // Fetch all leads for the dropdown
  const leads = await prisma.lead.findMany({
    select: {
      id: true,
      ownerName: true,
      businessEmail: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // Fetch all staff members for the assignment dropdown
  const staff = await prisma.user.findMany({
    where: {
      role: Role.STAFF,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
      <div className="mb-12">
        <Link href="/dashboard/tasks" className="text-[13px] font-semibold text-[#abc4ff] hover:text-slate-900 transition-colors flex items-center gap-1.5 mb-6">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Tasks
        </Link>
        <h2 className="text-[28px] font-semibold tracking-tight text-slate-900">Create New Task</h2>
        <p className="text-[15px] text-slate-500 font-medium mt-1">Assign a new operational task to a staff member.</p>
      </div>

      <TaskForm leads={leads} staff={staff} prefilledLeadId={leadId} />
    </div>
  );
}
