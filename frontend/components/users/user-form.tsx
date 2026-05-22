'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@prisma/client';

interface UserFormProps {
  staffOnly?: boolean;
}

export function UserForm({ staffOnly = false }: UserFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: staffOnly ? Role.STAFF : formData.get('role'),
    };

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to create user');
      }

      if (staffOnly) {
        router.push('/dashboard/staff');
      } else {
        router.push('/dashboard/users');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[24px] bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] p-10 max-w-2xl transition-all">
      {error && (
        <div className="mb-8 p-4 bg-red-50/80 text-red-800 rounded-[14px] border border-red-100/50 flex items-start gap-3 shadow-sm">
          <span className="material-symbols-outlined text-red-500 mt-0.5 text-[18px]">error</span>
          <p className="text-[13px] font-medium leading-relaxed">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[13px] font-medium text-slate-700">Full Name *</label>
          <input required name="name" type="text" className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)]" placeholder="John Doe" />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-slate-700">Email Address *</label>
          <input required name="email" type="email" className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)]" placeholder="john@company.com" />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-slate-700">Password *</label>
          <input required name="password" type="text" minLength={6} className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)]" placeholder="Minimum 6 characters" />
          <p className="text-[12px] text-slate-500 font-medium mt-1.5 ml-1">Securely share this password with the user.</p>
        </div>

        {!staffOnly && (
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-slate-700">Role *</label>
            <select required name="role" defaultValue={Role.STAFF} className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)] appearance-none">
              <option value={Role.STAFF}>Staff (Task Execution)</option>
              <option value={Role.SALES_ADMIN}>Sales Admin (Lead Generation)</option>
              <option value={Role.TECH_ADMIN}>Tech Admin (Operations Management)</option>
              <option value={Role.SUPER_ADMIN}>Super Admin (Full Access)</option>
            </select>
          </div>
        )}
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
            'Create User'
          )}
        </button>
      </div>
    </form>
  );
}
