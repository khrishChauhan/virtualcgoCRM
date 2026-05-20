'use client';

import React from 'react';
import { useTaskStore } from '@/stores/task-store';

export function TaskFilters() {
  const { filters, setFilter } = useTaskStore();

  return (
    <div className="flex flex-wrap gap-4 items-center bg-surface-container-lowest p-4 rounded-xl border border-white shadow-sm mb-6">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-outline-variant text-sm">filter_list</span>
        <span className="text-sm font-bold text-on-surface-variant mr-2">Filter</span>
      </div>

      {/* Status Filter */}
      <select
        className="px-3 py-2 bg-surface-container-low rounded-lg text-sm font-medium border-none focus:ring-2 focus:ring-primary/20 outline-none text-on-surface"
        value={filters.status}
        onChange={(e) => setFilter('status', e.target.value)}
      >
        <option value="ALL">All Statuses</option>
        <option value="PENDING">Pending</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="REVIEW">Under Review</option>
        <option value="COMPLETED">Completed</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

      {/* Service Type Filter */}
      <select
        className="px-3 py-2 bg-surface-container-low rounded-lg text-sm font-medium border-none focus:ring-2 focus:ring-primary/20 outline-none text-on-surface"
        value={filters.serviceType}
        onChange={(e) => setFilter('serviceType', e.target.value)}
      >
        <option value="ALL">All Services</option>
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
  );
}
