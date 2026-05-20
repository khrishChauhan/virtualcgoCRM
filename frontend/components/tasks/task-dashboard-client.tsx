'use client';

import React from 'react';
import { useTaskStore } from '@/stores/task-store';
import { TaskFilters } from './task-filters';
import { TaskTable } from './task-table';
import Link from 'next/link';

interface TaskDashboardClientProps {
  initialTasks: any[];
  userRole: string;
}

export function TaskDashboardClient({ initialTasks, userRole }: TaskDashboardClientProps) {
  const { filters } = useTaskStore();

  // Client-side filtering based on Zustand store
  const filteredTasks = initialTasks.filter((task) => {
    if (filters.status !== 'ALL' && task.status !== filters.status) return false;
    if (filters.serviceType !== 'ALL' && task.serviceType !== filters.serviceType) return false;
    if (filters.assignedToId !== 'ALL' && task.assignedToId !== filters.assignedToId) return false;
    return true;
  });

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-primary tracking-tight">Task Management</h2>
          <p className="text-on-surface-variant font-medium mt-1">Manage and track all operational tasks.</p>
        </div>
        {(userRole === 'TECH_ADMIN' || userRole === 'SUPER_ADMIN') && (
          <Link
            href="/dashboard/tasks/new"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Create Task
          </Link>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-white">
          <p className="text-sm font-label text-on-surface-variant">Total Tasks</p>
          <h3 className="text-2xl font-black text-on-surface mt-2">{filteredTasks.length}</h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-white">
          <p className="text-sm font-label text-on-surface-variant">Pending</p>
          <h3 className="text-2xl font-black text-on-surface mt-2">{filteredTasks.filter(t => t.status === 'PENDING').length}</h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-white">
          <p className="text-sm font-label text-on-surface-variant">In Progress / Review</p>
          <h3 className="text-2xl font-black text-on-surface mt-2">{filteredTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'REVIEW').length}</h3>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-white">
          <p className="text-sm font-label text-on-surface-variant">Completed</p>
          <h3 className="text-2xl font-black text-on-surface mt-2">{filteredTasks.filter(t => t.status === 'COMPLETED').length}</h3>
        </div>
      </div>

      <TaskFilters />
      <TaskTable tasks={filteredTasks} userRole={userRole} />
    </>
  );
}
