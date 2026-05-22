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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-[28px] font-semibold tracking-tight text-slate-900">Task Management</h2>
          <p className="text-[15px] text-slate-500 font-medium mt-1">Manage and track all operational tasks.</p>
        </div>
        {(userRole === 'TECH_ADMIN' || userRole === 'SUPER_ADMIN') && (
          <Link
            href="/dashboard/tasks/new"
            className="relative flex items-center justify-center gap-2 rounded-[12px] bg-[#0f172a] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_2px_8px_rgba(15,23,42,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#1e293b] hover:shadow-[0_4px_12px_rgba(15,23,42,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Task
          </Link>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="group relative overflow-hidden rounded-[20px] bg-white/70 p-5 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_4px_8px_rgba(0,0,0,0.02),0_16px_56px_rgba(171,196,255,0.08)] border border-slate-200/60">
          <p className="text-[13px] font-medium text-slate-500">Total Tasks</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">{filteredTasks.length}</h3>
        </div>
        <div className="group relative overflow-hidden rounded-[20px] bg-white/70 p-5 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_4px_8px_rgba(0,0,0,0.02),0_16px_56px_rgba(171,196,255,0.08)] border border-slate-200/60">
          <p className="text-[13px] font-medium text-slate-500">Pending</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">{filteredTasks.filter(t => t.status === 'PENDING').length}</h3>
        </div>
        <div className="group relative overflow-hidden rounded-[20px] bg-white/70 p-5 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_4px_8px_rgba(0,0,0,0.02),0_16px_56px_rgba(171,196,255,0.08)] border border-slate-200/60">
          <p className="text-[13px] font-medium text-slate-500">In Progress / Review</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">{filteredTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'REVIEW').length}</h3>
        </div>
        <div className="group relative overflow-hidden rounded-[20px] bg-white/70 p-5 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_4px_8px_rgba(0,0,0,0.02),0_16px_56px_rgba(171,196,255,0.08)] border border-slate-200/60">
          <p className="text-[13px] font-medium text-slate-500">Completed</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">{filteredTasks.filter(t => t.status === 'COMPLETED').length}</h3>
        </div>
      </div>

      <TaskFilters />
      <div className="mt-6">
        <TaskTable tasks={filteredTasks} userRole={userRole} />
      </div>
    </div>
  );
}
