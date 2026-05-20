'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskStatusBadge } from './task-status-badge';

interface TaskDetailClientProps {
  task: any;
  userRole: string;
}

export function TaskDetailClient({ task, userRole }: TaskDetailClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState(task.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    setError(null);

    try {
      const res = await fetch(`/api/tasks/${task.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update status');

      setStatus(newStatus);
      router.refresh(); // Refresh to update server-side activity logs
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const isStaff = userRole === 'STAFF';
  const canUpdate = !isStaff || task.assignedToId === task.assignedTo.id; // basic check, API enforces properly

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Info */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-black text-on-surface tracking-tight">{task.title}</h2>
              <p className="text-sm text-on-surface-variant font-medium mt-1">
                Client: {task.lead.ownerName} ({task.lead.businessEmail})
              </p>
            </div>
            <TaskStatusBadge status={status} />
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Description</h3>
            <p className="text-on-surface text-sm leading-relaxed bg-surface-container-low p-4 rounded-lg">
              {task.description || 'No description provided.'}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-2">Internal Notes</h3>
            <p className="text-on-surface text-sm leading-relaxed bg-surface-container-low p-4 rounded-lg border-l-4 border-primary">
              {task.notes || 'No notes provided.'}
            </p>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-white">
          <h3 className="text-lg font-bold text-on-surface mb-6">Activity Timeline</h3>
          <div className="flex flex-col gap-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-variant before:to-transparent">
            {task.activityLogs.length === 0 ? (
              <p className="text-sm text-on-surface-variant italic pl-8">No activity recorded yet.</p>
            ) : (
              task.activityLogs.map((log: any) => (
                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-primary text-on-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <span className="material-symbols-outlined text-[10px]">history</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-surface-container-low p-4 rounded-lg border border-outline-variant/30 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-bold text-on-surface text-sm">{log.action.replace(/_/g, ' ')}</div>
                      <time className="font-label text-xs text-on-surface-variant">{new Date(log.createdAt).toLocaleDateString()}</time>
                    </div>
                    <div className="text-xs text-on-surface-variant">by {log.user.name}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Meta */}
      <div className="flex flex-col gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-white">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">Task Details</h3>
          
          <div className="flex flex-col gap-4 text-sm">
            <div>
              <p className="text-xs text-on-surface-variant mb-1">Service Type</p>
              <p className="font-bold text-on-surface">{task.serviceType?.replace(/_/g, ' ') || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant mb-1">Deadline</p>
              <p className={`font-bold ${task.deadline && new Date(task.deadline) < new Date() && status !== 'COMPLETED' ? 'text-error' : 'text-on-surface'}`}>
                {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
              </p>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant mb-1">Assigned To</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-[10px] font-bold text-on-primary-container">
                  {task.assignedTo.name.substring(0, 2).toUpperCase()}
                </div>
                <span className="font-bold text-on-surface">{task.assignedTo.name}</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant mb-1">Created By</p>
              <p className="font-bold text-on-surface">{task.assignedBy.name}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-white">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">Update Status</h3>
          
          {error && <div className="mb-4 text-xs text-error font-medium">{error}</div>}
          
          <div className="flex flex-col gap-3">
            {(!isStaff || status === 'PENDING') && (
              <button
                disabled={isUpdating || status === 'IN_PROGRESS'}
                onClick={() => handleStatusChange('IN_PROGRESS')}
                className="w-full py-2.5 px-4 bg-surface-container-low hover:bg-primary-container/30 text-primary font-bold rounded-lg transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">play_arrow</span>
                Start Progress
              </button>
            )}
            
            {(!isStaff || status === 'IN_PROGRESS') && (
              <button
                disabled={isUpdating || status === 'REVIEW'}
                onClick={() => handleStatusChange('REVIEW')}
                className="w-full py-2.5 px-4 bg-surface-container-low hover:bg-tertiary-container/30 text-tertiary font-bold rounded-lg transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2 text-[#b5852a]"
              >
                <span className="material-symbols-outlined text-sm">visibility</span>
                Submit for Review
              </button>
            )}
            
            {!isStaff && (
              <button
                disabled={isUpdating || status === 'COMPLETED'}
                onClick={() => handleStatusChange('COMPLETED')}
                className="w-full py-2.5 px-4 bg-surface-container-low hover:bg-green-100 text-green-700 font-bold rounded-lg transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Mark Completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
