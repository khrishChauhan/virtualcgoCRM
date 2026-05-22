'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TaskStatusBadge } from './task-status-badge';

interface Task {
  id: string;
  title: string;
  status: any;
  serviceType: any;
  deadline: string | null;
  lead: { ownerName: string; businessEmail: string };
  assignedTo: { id: string; name: string };
}

interface TaskTableProps {
  tasks: Task[];
  userRole: string;
}

export function TaskTable({ tasks, userRole }: TaskTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter((task) => 
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.lead?.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignedTo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="rounded-[24px] bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] overflow-hidden flex flex-col transition-all">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">Task Directory</h3>
        <div className="relative group/search">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-[18px] transition-colors group-focus-within/search:text-[#abc4ff]">search</span>
          <input
            type="text"
            placeholder="Search tasks..."
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
              <th className="px-6 py-4">Task Name</th>
              <th className="px-6 py-4">Client / Lead</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Assignee</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Deadline</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-[14px] font-medium text-slate-400">
                  No tasks found matching your search.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/80 transition-colors duration-200 group">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900 text-[14px] tracking-tight">{task.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] font-medium text-slate-600">{task.lead?.ownerName || 'Unknown Client'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 bg-slate-100/80 border border-slate-200 rounded-[6px] text-[10px] font-bold tracking-widest text-slate-600 uppercase">
                      {task.serviceType?.replace(/_/g, ' ') || 'NONE'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-[8px] bg-[#abc4ff]/20 flex items-center justify-center text-[11px] font-bold text-slate-700 border border-[#abc4ff]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
                        {task.assignedTo?.name?.substring(0, 2).toUpperCase() || '?'}
                      </div>
                      <span className="text-[13px] font-semibold text-slate-700">{task.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <TaskStatusBadge status={task.status} />
                  </td>
                  <td className="px-6 py-4">
                    {task.deadline ? (
                      <span className={`text-[13px] font-medium ${new Date(task.deadline) < new Date() && task.status !== 'COMPLETED' ? 'text-red-500 font-semibold' : 'text-slate-500'}`}>
                        {new Date(task.deadline).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-[13px] font-medium text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/dashboard/${userRole === 'STAFF' ? 'my-tasks' : 'tasks'}/${task.id}`}
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
