import React from 'react';
import { getAuthUser } from '@/lib/get-auth-user';
import prisma from '@/lib/prisma';
import { TaskDashboardClient } from '@/components/tasks/task-dashboard-client';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

export default async function MyTasksPage() {
  const user = await getAuthUser();

  if (user.role === Role.SALES_ADMIN) {
    redirect('/dashboard');
  }

  // Fetch only tasks assigned to the current user
  const initialTasks = await prisma.task.findMany({
    where: {
      assignedToId: user.userId,
    },
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
        },
      },
    },
  });

  return <TaskDashboardClient initialTasks={initialTasks} userRole={user.role} />;
}
