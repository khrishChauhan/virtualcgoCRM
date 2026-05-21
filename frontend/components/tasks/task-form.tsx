'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LeadOption {
  id: string;
  ownerName: string;
  businessEmail: string;
}

interface StaffOption {
  id: string;
  name: string;
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
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      leadId: formData.get('leadId'),
      assignedToId: formData.get('assignedToId'),
      serviceType: formData.get('serviceType'),
      deadline: formData.get('deadline'),
      description: formData.get('description'),
      notes: formData.get('notes'),
    };

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to create task');

      router.push('/dashboard/tasks');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-2xl bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-white">
      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-bold text-on-surface-variant mb-2">Task Title *</label>
        <input
          required
          name="title"
          className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/50 text-sm"
          placeholder="e.g. Design homepage mockup"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-on-surface-variant mb-2">Assign to Lead / Client *</label>
          <select 
            required 
            name="leadId" 
            defaultValue={prefilledLeadId || ""}
            className="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm"
          >
            <option value="" disabled>Select a lead...</option>
            {leads.map((l) => (
              <option key={l.id} value={l.id}>{l.ownerName} ({l.businessEmail})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-on-surface-variant mb-2">Service Type *</label>
          <select required name="serviceType" className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/50 text-sm">
            <option value="">Select Service</option>
            <option value="SOCIAL_MEDIA_MANAGEMENT">Social Media Management</option>
            <option value="CONTENT_CREATION">Content Creation</option>
            <option value="GRAPHIC_DESIGN">Graphic Design</option>
            <option value="VIDEO_EDITING">Video Editing</option>
            <option value="SEO">SEO</option>
            <option value="PAID_ADS">Paid Ads</option>
            <option value="WEB_DEVELOPMENT">Web Development</option>
            <option value="EMAIL_MARKETING">Email Marketing</option>
            <option value="BRANDING">Branding</option>
            <option value="PHOTOGRAPHY">Photography</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-on-surface-variant mb-2">Assign to Staff *</label>
          <select required name="assignedToId" className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/50 text-sm">
            <option value="">Select Staff Member</option>
            {staff.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-on-surface-variant mb-2">Deadline</label>
          <input
            type="date"
            name="deadline"
            className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-on-surface-variant mb-2">Description</label>
        <textarea
          name="description"
          rows={3}
          className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/50 text-sm resize-none"
          placeholder="Detailed task description..."
        ></textarea>
      </div>

      <div>
        <label className="block text-sm font-bold text-on-surface-variant mb-2">Internal Notes</label>
        <textarea
          name="notes"
          rows={2}
          className="w-full px-4 py-3 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/50 text-sm resize-none"
          placeholder="Any special instructions or notes..."
        ></textarea>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 font-bold text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-primary text-on-primary font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity text-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
