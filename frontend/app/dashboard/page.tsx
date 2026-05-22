import React from 'react';
import { getAuthUser } from '@/lib/get-auth-user';
import prisma from '@/lib/prisma';
import { Role } from '@prisma/client';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await getAuthUser();

  // ─── Fetch real stats based on Role ─────────────────────────────────────────
  let stats = {
    totalLeads: 0,
    totalTasks: 0,
    totalUsers: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    staffCount: 0,
    recentActivity: [] as any[],
  };

  if (user.role === Role.TECH_ADMIN || user.role === Role.SUPER_ADMIN) {
    const [leadsCount, tasksCount, usersCount, tasksStatusCounts, staffCount, activity] = await Promise.all([
      prisma.lead.count(),
      prisma.task.count(),
      prisma.user.count(),
      prisma.task.groupBy({ by: ['status'], _count: { status: true } }),
      prisma.user.count({ where: { role: Role.STAFF } }),
      prisma.activityLog.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true } } } })
    ]);
    stats.totalLeads = leadsCount; stats.totalTasks = tasksCount; stats.totalUsers = usersCount; stats.staffCount = staffCount; stats.recentActivity = activity;
    tasksStatusCounts.forEach(t => {
      if (t.status === 'PENDING') stats.pendingTasks = t._count.status;
      if (t.status === 'IN_PROGRESS' || t.status === 'REVIEW') stats.inProgressTasks += t._count.status;
      if (t.status === 'COMPLETED') stats.completedTasks = t._count.status;
    });
  } else if (user.role === Role.SALES_ADMIN) {
    const [myLeadsCount, activity] = await Promise.all([
      prisma.lead.count({ where: { createdById: user.userId } }),
      prisma.activityLog.findMany({ where: { userId: user.userId }, take: 5, orderBy: { createdAt: 'desc' } })
    ]);
    stats.totalLeads = myLeadsCount; stats.recentActivity = activity;
  } else if (user.role === Role.STAFF) {
    const [myTasksCount, tasksByStatus, activity] = await Promise.all([
      prisma.task.count({ where: { assignedToId: user.userId } }),
      prisma.task.groupBy({ by: ['status'], where: { assignedToId: user.userId }, _count: { status: true } }),
      prisma.activityLog.findMany({ where: { userId: user.userId }, take: 5, orderBy: { createdAt: 'desc' } })
    ]);
    stats.totalTasks = myTasksCount; stats.recentActivity = activity;
    tasksByStatus.forEach(t => {
      if (t.status === 'PENDING') stats.pendingTasks = t._count.status;
      if (t.status === 'IN_PROGRESS' || t.status === 'REVIEW') stats.inProgressTasks += t._count.status;
      if (t.status === 'COMPLETED') stats.completedTasks = t._count.status;
    });
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
      {/* Top Navigation Bar */}
      <header className="mb-12">
        <h2 className="text-[28px] font-semibold tracking-tight text-slate-900">Welcome back.</h2>
        <p className="text-[15px] text-slate-500 mt-1 font-medium">Here is what&apos;s happening with your operations today.</p>
      </header>
      
      {/* Bento Grid Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        
        {user.role !== Role.STAFF && (
          <div className="group relative overflow-hidden rounded-[24px] bg-white/70 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.08)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_4px_8px_rgba(0,0,0,0.02),0_16px_56px_rgba(171,196,255,0.12)] border border-slate-200/60">
            <div className="w-12 h-12 rounded-[14px] bg-blue-50 flex items-center justify-center text-blue-500 mb-6 border border-blue-100">
              <span className="material-symbols-outlined text-[22px]">person_add</span>
            </div>
            <div>
              <p className="text-[13px] font-medium text-slate-500">
                {user.role === Role.SALES_ADMIN ? 'My Sourced Leads' : 'Total Leads Pipeline'}
              </p>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">{stats.totalLeads}</h3>
            </div>
          </div>
        )}

        {user.role !== Role.SALES_ADMIN && (
          <div className="group relative overflow-hidden rounded-[24px] bg-white/70 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.08)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_4px_8px_rgba(0,0,0,0.02),0_16px_56px_rgba(171,196,255,0.12)] border border-slate-200/60">
            <div className="w-12 h-12 rounded-[14px] bg-orange-50 flex items-center justify-center text-orange-500 mb-6 border border-orange-100">
              <span className="material-symbols-outlined text-[22px]">task_alt</span>
            </div>
            <div>
              <p className="text-[13px] font-medium text-slate-500">
                {user.role === Role.STAFF ? 'My Assigned Tasks' : 'Total Tasks'}
              </p>
              <div className="flex items-end gap-2 mt-1">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{stats.totalTasks}</h3>
                <span className="text-[12px] font-medium text-slate-400 mb-1.5">{stats.pendingTasks} pending</span>
              </div>
            </div>
          </div>
        )}

        {(user.role === Role.TECH_ADMIN || user.role === Role.SUPER_ADMIN) && (
          <div className="group relative overflow-hidden rounded-[24px] bg-white/70 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.08)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_4px_8px_rgba(0,0,0,0.02),0_16px_56px_rgba(171,196,255,0.12)] border border-slate-200/60">
            <div className="w-12 h-12 rounded-[14px] bg-purple-50 flex items-center justify-center text-purple-500 mb-6 border border-purple-100">
              <span className="material-symbols-outlined text-[22px]">badge</span>
            </div>
            <div>
              <p className="text-[13px] font-medium text-slate-500">
                {user.role === Role.SUPER_ADMIN ? 'Total System Users' : 'Active Staff'}
              </p>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
                {user.role === Role.SUPER_ADMIN ? stats.totalUsers : stats.staffCount}
              </h3>
            </div>
          </div>
        )}

        <div className={`group relative overflow-hidden rounded-[24px] bg-slate-900 p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.15)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_4px_16px_rgba(15,23,42,0.3)] border border-slate-800 ${user.role === Role.SALES_ADMIN ? 'lg:col-span-3' : 'lg:col-span-1'}`}>
          <div className="relative z-10">
            <p className="text-[13px] font-semibold text-slate-300 mb-5 uppercase tracking-wider">Quick Actions</p>
            <div className="flex flex-col gap-3">
              {user.role === Role.SALES_ADMIN && (
                <Link href="/dashboard/leads/new" className="text-[14px] font-medium text-[#abc4ff] hover:text-white transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">add_circle</span> Add New Lead
                </Link>
              )}
              {(user.role === Role.TECH_ADMIN || user.role === Role.SUPER_ADMIN) && (
                <>
                  <Link href="/dashboard/tasks/new" className="text-[14px] font-medium text-[#abc4ff] hover:text-white transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">assignment_add</span> Assign Task
                  </Link>
                  <Link href="/dashboard/staff/new" className="text-[14px] font-medium text-[#abc4ff] hover:text-white transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">person_add</span> Create Staff
                  </Link>
                </>
              )}
              {user.role === Role.STAFF && (
                <Link href="/dashboard/my-tasks" className="text-[14px] font-medium text-[#abc4ff] hover:text-white transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">checklist</span> View My Tasks
                </Link>
              )}
            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-32 h-32 opacity-[0.03] pointer-events-none translate-x-8 translate-y-8">
            <span className="material-symbols-outlined text-9xl text-white">bolt</span>
          </div>
        </div>
      </section>
      
      {/* System Activity Feed */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 rounded-[24px] bg-white/70 backdrop-blur-2xl p-8 border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)]">
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-5">
            <h4 className="text-[16px] font-semibold text-slate-900 tracking-tight">Recent Activity</h4>
            <span className="text-[11px] font-semibold px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 uppercase tracking-wide">Real-time</span>
          </div>
          
          <div className="flex flex-col gap-6">
            {stats.recentActivity.length === 0 ? (
              <p className="text-[14px] text-slate-400 py-8 text-center font-medium">No recent activity found in the system.</p>
            ) : (
              stats.recentActivity.map(log => {
                let colorClass = 'bg-slate-100 text-slate-500';
                let icon = 'history';
                let title = log.action.replace(/_/g, ' ');

                if (log.action.includes('LEAD')) { colorClass = 'bg-blue-50 text-blue-500'; icon = 'person_add'; }
                if (log.action.includes('TASK')) { colorClass = 'bg-orange-50 text-orange-500'; icon = 'task_alt'; }
                if (log.action.includes('USER') || log.action.includes('STAFF')) { colorClass = 'bg-purple-50 text-purple-500'; icon = 'badge'; }

                return (
                  <div key={log.id} className="flex gap-4 group">
                    <div className={`w-9 h-9 rounded-full ${colorClass} flex items-center justify-center flex-shrink-0 mt-0.5 border border-white shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                      <span className="material-symbols-outlined text-[16px]">{icon}</span>
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold text-slate-800 capitalize tracking-tight">{title.toLowerCase()}</p>
                      <p className="text-[13px] text-slate-500 mt-0.5 font-medium">
                        By <span className="text-slate-700 font-semibold">{log.user?.name || 'System User'}</span> • {log.entityType} ID: {log.entityId.slice(-6)}
                      </p>
                      <span className="text-[11px] text-slate-400 font-medium mt-1.5 block tracking-wide">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
