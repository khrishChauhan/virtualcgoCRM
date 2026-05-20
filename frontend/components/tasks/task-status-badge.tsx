import React from 'react';
import { TaskStatus } from '@prisma/client';

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const styles = {
    PENDING: 'bg-surface-variant text-on-surface-variant border-outline-variant',
    IN_PROGRESS: 'bg-primary-container text-on-primary-container border-primary/20',
    REVIEW: 'bg-tertiary-container text-on-tertiary-container border-tertiary-container',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800',
    CANCELLED: 'bg-error-container text-on-error-container border-error/20',
  };

  const labels = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    REVIEW: 'Under Review',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
