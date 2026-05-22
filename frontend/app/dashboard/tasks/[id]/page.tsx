import React from 'react';
import { getAuthUser } from '@/lib/get-auth-user';
import prisma from '@/lib/prisma';
import { TaskDetailClient } from '@/components/tasks/task-detail-client';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import Link from 'next/link';

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  const id = (await params).id;

  if (user.role === Role.SALES_ADMIN) {
    redirect('/dashboard');
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
        take: 20,
        include: {
          user: { select: { name: true } },
        },
      },
    },
  });

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-surface-container-lowest rounded-xl border border-white shadow-sm h-64">
        <span className="material-symbols-outlined text-4xl text-error mb-4">error</span>
        <p className="text-on-surface-variant font-medium">Task not found</p>
        <Link href="/dashboard/tasks" className="text-primary font-bold hover:underline mt-2">Return to tasks</Link>
      </div>
    );
  }

  // Staff can only view their own tasks
  if (user.role === Role.STAFF && task.assignedToId !== user.userId) {
    redirect('/dashboard/my-tasks');
  }

  const backLink = user.role === Role.STAFF ? '/dashboard/my-tasks' : '/dashboard/tasks';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
      <div className="mb-8">
        <Link href={backLink} className="text-[13px] font-semibold text-[#abc4ff] hover:text-slate-900 transition-colors flex items-center gap-1.5 w-fit">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Tasks
        </Link>
      </div>
      
      <TaskDetailClient task={task} userRole={user.role} />
    </div>
  );
}
