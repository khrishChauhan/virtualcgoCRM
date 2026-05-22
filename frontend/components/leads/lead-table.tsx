'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LeadStatusBadge } from './lead-status-badge';
import { LeadStatus } from '@prisma/client';

interface Lead {
  id: string;
  ownerName: string;
  businessEmail: string;
  businessCategory: string | null;
  status: LeadStatus;
  createdAt: string;
  createdBy?: { name: string };
  _count?: { tasks: number };
}

interface LeadTableProps {
  leads: Lead[];
  userRole: string;
}

export function LeadTable({ leads, userRole }: LeadTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeads = leads.filter((lead) => 
    lead.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.businessEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.businessCategory && lead.businessCategory.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="rounded-[24px] bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] overflow-hidden flex flex-col transition-all">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">Client Directory</h3>
        <div className="relative group/search">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] transition-colors group-focus-within/search:text-[#abc4ff]">search</span>
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-[12px] text-[13px] font-medium text-slate-900 focus:ring-4 focus:ring-[#abc4ff]/20 focus:border-[#abc4ff] outline-none w-[280px] transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/30 text-[11px] uppercase tracking-widest font-semibold text-slate-500 border-b border-slate-100">
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              {userRole !== 'SALES_ADMIN' && <th className="px-6 py-4">Sourced By</th>}
              <th className="px-6 py-4">Tasks</th>
              <th className="px-6 py-4">Added</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-[14px] font-medium text-slate-400">
                  No leads found matching your search.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors duration-200 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[10px] bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-[13px] uppercase border border-blue-100 shadow-sm">
                        {lead.ownerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-[14px] tracking-tight">{lead.ownerName}</p>
                        <p className="text-[12px] font-medium text-slate-500">{lead.businessEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-slate-600">
                    {lead.businessCategory || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  {userRole !== 'SALES_ADMIN' && (
                    <td className="px-6 py-4 text-[13px] font-medium text-slate-600">
                      {lead.createdBy?.name || 'Unknown'}
                    </td>
                  )}
                  <td className="px-6 py-4 text-[13px] text-slate-500 font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-slate-400">task</span>
                      {lead._count?.tasks || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[13px] font-medium text-slate-500">
                    {new Date(lead.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] font-semibold text-[#abc4ff] bg-blue-50/50 hover:bg-[#abc4ff] hover:text-slate-900 rounded-[10px] transition-all duration-200 border border-blue-100/50 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                    >
                      View
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
