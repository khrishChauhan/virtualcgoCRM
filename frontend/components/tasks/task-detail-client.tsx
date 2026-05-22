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
      router.refresh(); 
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const isStaff = userRole === 'STAFF';
  const canUpdate = !isStaff || task.assignedToId === task.assignedTo.id; 

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Info */}
      <div className="lg:col-span-2 flex flex-col gap-8">
        <div className="rounded-[24px] bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] p-8">
          <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
            <div>
              <h2 className="text-[28px] font-bold text-slate-900 tracking-tight">{task.title}</h2>
              <p className="text-[15px] text-slate-500 font-medium mt-1">
                Client: <span className="text-slate-700 font-semibold">{task.lead.ownerName}</span> <span className="text-slate-400">({task.lead.businessEmail})</span>
              </p>
            </div>
            <TaskStatusBadge status={status} />
          </div>

          <div className="mb-8">
            <h3 className="text-[12px] uppercase tracking-widest font-semibold text-slate-400 mb-3">Description</h3>
            <div className="bg-slate-50/80 border border-slate-200/60 p-5 rounded-[16px]">
              <p className="font-medium text-[14px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                {task.description || 'No description provided.'}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-[12px] uppercase tracking-widest font-semibold text-slate-400 mb-3">Internal Notes</h3>
            <div className="bg-blue-50/30 border border-blue-100/50 p-5 rounded-[16px]">
              <p className="font-medium text-[14px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                {task.notes || 'No notes provided.'}
              </p>
            </div>
          </div>
        </div>

        {/* Activity Logs */}
        <div className="rounded-[24px] bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] p-8">
          <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight mb-8">Activity Timeline</h3>
          <div className="flex flex-col gap-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-[#abc4ff]/20 before:via-[#abc4ff]/20 before:to-transparent">
            {task.activityLogs.length === 0 ? (
              <p className="text-[14px] text-slate-400 font-medium italic pl-10">No activity recorded yet.</p>
            ) : (
              task.activityLogs.map((log: any) => (
                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-8 h-8 rounded-[12px] border border-white bg-slate-100 text-slate-400 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 relative z-10">
                    <span className="material-symbols-outlined text-[14px]">history</span>
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/80 p-5 rounded-[16px] border border-slate-200/60 shadow-sm hover:shadow-[0_4px_12px_rgba(171,196,255,0.08)] transition-all duration-300">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="font-semibold text-slate-900 text-[14px]">{log.action.replace(/_/g, ' ')}</div>
                      <time className="font-semibold text-[11px] text-slate-400 uppercase tracking-wider">{new Date(log.createdAt).toLocaleDateString()}</time>
                    </div>
                    <div className="text-[13px] text-slate-500 font-medium">by <span className="text-slate-700">{log.user.name}</span></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Meta */}
      <div className="flex flex-col gap-8">
        <div className="rounded-[24px] bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] p-8">
          <h3 className="text-[12px] uppercase tracking-widest font-bold text-slate-400 mb-6">Task Details</h3>
          
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-[12px] uppercase tracking-widest font-semibold text-slate-400 mb-2">Service Type</p>
              <p className="font-semibold text-[15px] text-slate-900">{task.serviceType?.replace(/_/g, ' ') || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[12px] uppercase tracking-widest font-semibold text-slate-400 mb-2">Deadline</p>
              <p className={`font-semibold text-[15px] ${task.deadline && new Date(task.deadline) < new Date() && status !== 'COMPLETED' ? 'text-red-500' : 'text-slate-900'}`}>
                {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
              </p>
            </div>
            <div>
              <p className="text-[12px] uppercase tracking-widest font-semibold text-slate-400 mb-2">Assigned To</p>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-8 h-8 rounded-[10px] bg-[#abc4ff]/20 flex items-center justify-center text-[12px] font-bold text-slate-700 border border-[#abc4ff]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
                  {task.assignedTo.name.substring(0, 2).toUpperCase()}
                </div>
                <span className="font-semibold text-[15px] text-slate-900">{task.assignedTo.name}</span>
              </div>
            </div>
            <div>
              <p className="text-[12px] uppercase tracking-widest font-semibold text-slate-400 mb-2">Created By</p>
              <p className="font-semibold text-[15px] text-slate-900">{task.assignedBy.name}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="rounded-[24px] bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] p-8">
          <h3 className="text-[12px] uppercase tracking-widest font-bold text-slate-400 mb-6">Update Status</h3>
          
          {error && <div className="mb-4 text-[13px] text-red-500 font-semibold p-3 bg-red-50 rounded-[12px] border border-red-100">{error}</div>}
          
          <div className="flex flex-col gap-3">
            {(!isStaff || status === 'PENDING') && (
              <button
                disabled={isUpdating || status === 'IN_PROGRESS'}
                onClick={() => handleStatusChange('IN_PROGRESS')}
                className="w-full py-3 px-4 bg-slate-50 border border-slate-200/60 hover:bg-[#abc4ff]/10 hover:border-[#abc4ff]/50 text-slate-700 font-semibold rounded-[12px] transition-all duration-300 disabled:opacity-50 text-[13px] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                Start Progress
              </button>
            )}
            
            {(!isStaff || status === 'IN_PROGRESS') && (
              <button
                disabled={isUpdating || status === 'REVIEW'}
                onClick={() => handleStatusChange('REVIEW')}
                className="w-full py-3 px-4 bg-slate-50 border border-slate-200/60 hover:bg-purple-50 hover:border-purple-200/60 text-slate-700 hover:text-purple-700 font-semibold rounded-[12px] transition-all duration-300 disabled:opacity-50 text-[13px] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                Submit for Review
              </button>
            )}
            
            {!isStaff && (
              <button
                disabled={isUpdating || status === 'COMPLETED'}
                onClick={() => handleStatusChange('COMPLETED')}
                className="w-full py-3 px-4 bg-slate-50 border border-slate-200/60 hover:bg-emerald-50 hover:border-emerald-200/60 text-slate-700 hover:text-emerald-700 font-semibold rounded-[12px] transition-all duration-300 disabled:opacity-50 text-[13px] flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Mark Completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
