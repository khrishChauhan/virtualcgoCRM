import React from 'react';
import { getAuthUser } from '@/lib/get-auth-user';
import prisma from '@/lib/prisma';
import { TaskForm } from '@/components/tasks/task-form';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import Link from 'next/link';

export default async function NewTaskPage() {
  const user = await getAuthUser();

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
    <>
      <div className="mb-8">
        <Link href="/dashboard/tasks" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 mb-4">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Tasks
        </Link>
        <h2 className="text-3xl font-black text-primary tracking-tight">Create New Task</h2>
        <p className="text-on-surface-variant font-medium mt-1">Assign a new operational task to a staff member.</p>
      </div>

      <TaskForm leads={leads} staff={staff} />
    </>
  );
}
