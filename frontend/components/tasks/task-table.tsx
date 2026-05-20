import React from 'react';
import Link from 'next/link';
import { TaskStatusBadge } from './task-status-badge';

interface Task {
  id: string;
  title: string;
  status: any; // TaskStatus
  serviceType: any; // ServiceType
  deadline: string | null;
  lead: { ownerName: string; businessEmail: string };
  assignedTo: { id: string; name: string };
}

interface TaskTableProps {
  tasks: Task[];
  userRole: string;
}

export function TaskTable({ tasks, userRole }: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-surface-container-lowest rounded-xl border border-white shadow-sm h-64">
        <span className="material-symbols-outlined text-4xl text-outline-variant mb-4">assignment_turned_in</span>
        <p className="text-on-surface-variant font-medium">No tasks found</p>
        <p className="text-xs text-outline mt-1">Adjust filters or create a new task.</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-surface-container bg-surface-container-low/50 text-xs text-on-surface-variant font-bold uppercase tracking-wider">
              <th className="p-4 pl-6 font-label">Task Name</th>
              <th className="p-4 font-label">Client / Lead</th>
              <th className="p-4 font-label">Service</th>
              <th className="p-4 font-label">Assignee</th>
              <th className="p-4 font-label">Status</th>
              <th className="p-4 font-label">Deadline</th>
              <th className="p-4 pr-6 font-label text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container text-sm">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-surface-container-low/30 transition-colors">
                <td className="p-4 pl-6">
                  <p className="font-bold text-on-surface">{task.title}</p>
                </td>
                <td className="p-4">
                  <p className="font-medium text-on-surface-variant">{task.lead?.ownerName || 'Unknown Client'}</p>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-surface-variant rounded text-xs font-semibold text-on-surface-variant">
                    {task.serviceType?.replace(/_/g, ' ') || 'None'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary-container flex items-center justify-center text-[10px] font-bold text-on-primary-container">
                      {task.assignedTo?.name?.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-on-surface font-medium">{task.assignedTo?.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <TaskStatusBadge status={task.status} />
                </td>
                <td className="p-4">
                  {task.deadline ? (
                    <span className={`text-xs font-medium ${new Date(task.deadline) < new Date() && task.status !== 'COMPLETED' ? 'text-error' : 'text-on-surface-variant'}`}>
                      {new Date(task.deadline).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-xs text-outline">No deadline</span>
                  )}
                </td>
                <td className="p-4 pr-6 text-right">
                  <Link
                    href={`/dashboard/${userRole === 'STAFF' ? 'my-tasks' : 'tasks'}/${task.id}`}
                    className="inline-flex items-center justify-center p-2 text-primary hover:bg-primary-container/30 rounded-lg transition-colors"
                    title="View Task Details"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
