import React from 'react';
import { TaskStatus } from '@prisma/client';

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const styles = {
    PENDING: 'bg-slate-100 text-slate-600 border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
    IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
    REVIEW: 'bg-purple-50 text-purple-700 border-purple-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
    CANCELLED: 'bg-red-50 text-red-700 border-red-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]',
  };

  const labels = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    REVIEW: 'Under Review',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };

  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-[6px] border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
