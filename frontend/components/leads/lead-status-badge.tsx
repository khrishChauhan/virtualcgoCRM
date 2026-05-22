import React from 'react';
import { LeadStatus } from '@prisma/client';

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const getBadgeStyle = (s: LeadStatus) => {
    switch (s) {
      case 'NEW':
        return 'bg-blue-50 text-blue-700 border-blue-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]';
      case 'CONTACTED':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]';
      case 'QUALIFIED':
        return 'bg-purple-50 text-purple-700 border-purple-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]';
      case 'PROPOSAL_SENT':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]';
      case 'IN_PROGRESS':
        return 'bg-orange-50 text-orange-700 border-orange-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]';
      case 'WON':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]';
      case 'LOST':
        return 'bg-red-50 text-red-700 border-red-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]';
      case 'ON_HOLD':
        return 'bg-slate-100 text-slate-600 border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200/60';
    }
  };

  const getLabel = (s: LeadStatus) => {
    return s.replace('_', ' ');
  };

  return (
    <span className={`px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-[6px] border ${getBadgeStyle(status)}`}>
      {getLabel(status)}
    </span>
  );
}
