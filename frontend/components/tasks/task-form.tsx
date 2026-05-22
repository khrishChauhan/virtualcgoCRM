'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceType } from '@prisma/client';

interface LeadOption {
  id: string;
  ownerName: string;
  businessEmail: string;
}

interface StaffOption {
  id: string;
  name: string;
  email?: string;
}

interface TaskFormProps {
  leads: LeadOption[];
  staff: StaffOption[];
  prefilledLeadId?: string;
}

export function TaskForm({ leads, staff, prefilledLeadId }: TaskFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      serviceType: formData.get('serviceType'),
      leadId: formData.get('leadId'),
      assignedToId: formData.get('assignedToId') || null, 
      deadline: formData.get('deadline') ? new Date(formData.get('deadline') as string).toISOString() : null,
    };

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to create task');
      }

      router.push('/dashboard/tasks');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[24px] bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] p-10 max-w-4xl transition-all">
      {error && (
        <div className="mb-8 p-4 bg-red-50/80 text-red-800 rounded-[14px] border border-red-100/50 flex items-start gap-3 shadow-sm">
          <span className="material-symbols-outlined text-red-500 mt-0.5 text-[18px]">error</span>
          <p className="text-[13px] font-medium leading-relaxed">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        
        {/* Assignment & Linkage */}
        <div className="md:col-span-2 border-b border-slate-200/60 pb-5 mb-2">
          <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Task Assignment</h3>
          <p className="text-[13px] text-slate-500 font-medium mt-1">Link this task to a client lead and optionally assign a staff member.</p>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-slate-700">Client / Lead *</label>
          <select 
            required 
            name="leadId" 
            defaultValue={prefilledLeadId || ""}
            className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)] appearance-none"
          >
            <option value="" disabled>Select a lead...</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>{l.ownerName} ({l.businessEmail})</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-slate-700">Assign to Staff Member (Optional)</label>
          <select 
            name="assignedToId" 
            defaultValue=""
            className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)] appearance-none"
          >
            <option value="">Leave Unassigned</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>{s.name} {s.email ? `(${s.email})` : ''}</option>
            ))}
          </select>
        </div>

        {/* Task Details */}
        <div className="md:col-span-2 border-b border-slate-200/60 pb-5 mt-4 mb-2">
          <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Task Details</h3>
          <p className="text-[13px] text-slate-500 font-medium mt-1">Specify what needs to be done.</p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[13px] font-medium text-slate-700">Task Title *</label>
          <input required name="title" type="text" className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)]" placeholder="e.g. Design Logo Concepts" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[13px] font-medium text-slate-700">Detailed Instructions *</label>
          <textarea required name="description" rows={5} className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)] resize-none" placeholder="Provide full context, constraints, and requirements..."></textarea>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-slate-700">Service Category *</label>
          <select required name="serviceType" defaultValue="" className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)] appearance-none">
            <option value="" disabled>Select a category...</option>
            {Object.keys(ServiceType).map((type) => (
              <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-slate-700">Deadline (Optional)</label>
          <input name="deadline" type="date" className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)]" />
        </div>
      </div>

      <div className="mt-12 flex justify-end gap-3 pt-8 border-t border-slate-200/60">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-[12px] text-[14px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="relative flex items-center justify-center gap-2 rounded-[12px] bg-[#0f172a] px-8 py-3 text-[14px] font-semibold text-white shadow-[0_2px_8px_rgba(15,23,42,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#1e293b] hover:shadow-[0_4px_12px_rgba(15,23,42,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
        >
          {isSubmitting ? (
            <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Creating...</>
          ) : (
            'Create Task'
          )}
        </button>
      </div>
    </form>
  );
}
