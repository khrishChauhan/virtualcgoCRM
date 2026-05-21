import React from 'react';
import { LeadStatus } from '@prisma/client';

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const getBadgeStyle = (s: LeadStatus) => {
    switch (s) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'CONTACTED':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800';
      case 'QUALIFIED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'PROPOSAL_SENT':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800';
      case 'WON':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
      case 'LOST':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'ON_HOLD':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLabel = (s: LeadStatus) => {
    return s.replace('_', ' ');
  };

  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-full border ${getBadgeStyle(status)}`}>
      {getLabel(status)}
    </span>
  );
}
