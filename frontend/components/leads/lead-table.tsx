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
    <div className="bg-surface-container-lowest border border-white rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low/50">
        <h3 className="font-bold text-on-surface">Client Directory</h3>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-lowest text-xs uppercase tracking-wider font-bold text-on-surface-variant border-b border-outline-variant/30">
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Status</th>
              {userRole !== 'SALES_ADMIN' && <th className="px-6 py-4">Sourced By</th>}
              <th className="px-6 py-4">Tasks</th>
              <th className="px-6 py-4">Added</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant">
                  No leads found matching your search.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-surface-container-low/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs uppercase">
                        {lead.ownerName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-sm">{lead.ownerName}</p>
                        <p className="text-xs text-on-surface-variant">{lead.businessEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {lead.businessCategory || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <LeadStatusBadge status={lead.status} />
                  </td>
                  {userRole !== 'SALES_ADMIN' && (
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {lead.createdBy?.name || 'Unknown'}
                    </td>
                  )}
                  <td className="px-6 py-4 text-sm text-on-surface-variant font-medium">
                    {lead._count?.tasks || 0} tasks
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/leads/${lead.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      View
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
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
