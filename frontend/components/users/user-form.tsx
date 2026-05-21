'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@prisma/client';

interface UserFormProps {
  // If true, forces the role to STAFF and hides the role dropdown
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

      // Redirect back
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
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-white rounded-xl shadow-sm p-8 max-w-2xl">
      {error && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg border border-error/20 flex items-start gap-3">
          <span className="material-symbols-outlined text-error mt-0.5">error</span>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface-variant">Full Name *</label>
          <input required name="name" type="text" className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" placeholder="John Doe" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface-variant">Email Address *</label>
          <input required name="email" type="email" className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" placeholder="john@company.com" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface-variant">Password *</label>
          <input required name="password" type="text" minLength={6} className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" placeholder="Minimum 6 characters" />
          <p className="text-xs text-on-surface-variant mt-1">Make sure to securely share this password with the user.</p>
        </div>

        {!staffOnly && (
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface-variant">Role *</label>
            <select required name="role" defaultValue={Role.STAFF} className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm">
              <option value={Role.STAFF}>Staff (Task Execution)</option>
              <option value={Role.SALES_ADMIN}>Sales Admin (Lead Generation)</option>
              <option value={Role.TECH_ADMIN}>Tech Admin (Operations Management)</option>
              <option value={Role.SUPER_ADMIN}>Super Admin (Full Access)</option>
            </select>
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-end gap-4 border-t border-outline-variant/30 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center gap-2"
        >
          {isSubmitting ? (
            <><span className="material-symbols-outlined animate-spin text-sm">refresh</span> Creating...</>
          ) : (
            'Create User'
          )}
        </button>
      </div>
    </form>
  );
}
