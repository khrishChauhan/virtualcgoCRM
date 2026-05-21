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

  // Tech Admin & Super Admin Stats
  if (user.role === Role.TECH_ADMIN || user.role === Role.SUPER_ADMIN) {
    const [leadsCount, tasksCount, usersCount, tasksStatusCounts, staffCount, activity] = await Promise.all([
      prisma.lead.count(),
      prisma.task.count(),
      prisma.user.count(),
      prisma.task.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.user.count({ where: { role: Role.STAFF } }),
      prisma.activityLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } }
      })
    ]);

    stats.totalLeads = leadsCount;
    stats.totalTasks = tasksCount;
    stats.totalUsers = usersCount;
    stats.staffCount = staffCount;
    stats.recentActivity = activity;
    
    tasksStatusCounts.forEach(t => {
      if (t.status === 'PENDING') stats.pendingTasks = t._count.status;
      if (t.status === 'IN_PROGRESS' || t.status === 'REVIEW') stats.inProgressTasks += t._count.status;
      if (t.status === 'COMPLETED') stats.completedTasks = t._count.status;
    });
  }

  // Sales Admin Stats
  else if (user.role === Role.SALES_ADMIN) {
    const [myLeadsCount, leadsByStatus, activity] = await Promise.all([
      prisma.lead.count({ where: { createdById: user.userId } }),
      prisma.lead.groupBy({
        by: ['status'],
        where: { createdById: user.userId },
        _count: { status: true }
      }),
      prisma.activityLog.findMany({
        where: { userId: user.userId },
        take: 5,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    stats.totalLeads = myLeadsCount;
    stats.recentActivity = activity;
    // We could store lead statuses in stats too if we wanted a chart
  }

  // Staff Stats
  else if (user.role === Role.STAFF) {
    const [myTasksCount, tasksByStatus, activity] = await Promise.all([
      prisma.task.count({ where: { assignedToId: user.userId } }),
      prisma.task.groupBy({
        by: ['status'],
        where: { assignedToId: user.userId },
        _count: { status: true }
      }),
      prisma.activityLog.findMany({
        where: { userId: user.userId },
        take: 5,
        orderBy: { createdAt: 'desc' }
      })
    ]);

    stats.totalTasks = myTasksCount;
    stats.recentActivity = activity;
    
    tasksByStatus.forEach(t => {
      if (t.status === 'PENDING') stats.pendingTasks = t._count.status;
      if (t.status === 'IN_PROGRESS' || t.status === 'REVIEW') stats.inProgressTasks += t._count.status;
      if (t.status === 'COMPLETED') stats.completedTasks = t._count.status;
    });
  }

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Top Navigation Bar */}
      <header className="flex justify-between items-center w-full mb-10">
        <div>
          <h2 className="text-3xl font-black text-primary tracking-tight">Welcome back.</h2>
          <p className="text-on-surface-variant font-medium mt-1">Here is what&apos;s happening with your operations today.</p>
        </div>
      </header>
      
      {/* Bento Grid Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Lead Stat (Not for Staff) */}
        {user.role !== Role.STAFF && (
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-4 border border-white hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
            </div>
            <div>
              <p className="text-sm font-label text-on-surface-variant">
                {user.role === Role.SALES_ADMIN ? 'My Sourced Leads' : 'Total Leads Pipeline'}
              </p>
              <h3 className="text-2xl font-black text-on-surface">{stats.totalLeads}</h3>
            </div>
          </div>
        )}

        {/* Task Stat (Not for Sales Admin) */}
        {user.role !== Role.SALES_ADMIN && (
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-4 border border-white hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-700">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
            </div>
            <div>
              <p className="text-sm font-label text-on-surface-variant">
                {user.role === Role.STAFF ? 'My Assigned Tasks' : 'Total Tasks'}
              </p>
              <div className="flex items-end gap-2">
                <h3 className="text-2xl font-black text-on-surface">{stats.totalTasks}</h3>
                <span className="text-xs font-bold text-on-surface-variant mb-1">{stats.pendingTasks} pending</span>
              </div>
            </div>
          </div>
        )}

        {/* Staff/User Stat (Tech/Super Admin Only) */}
        {(user.role === Role.TECH_ADMIN || user.role === Role.SUPER_ADMIN) && (
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-4 border border-white hover:scale-[1.01] transition-transform duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>badge</span>
            </div>
            <div>
              <p className="text-sm font-label text-on-surface-variant">
                {user.role === Role.SUPER_ADMIN ? 'Total System Users' : 'Active Staff'}
              </p>
              <h3 className="text-2xl font-black text-on-surface">
                {user.role === Role.SUPER_ADMIN ? stats.totalUsers : stats.staffCount}
              </h3>
            </div>
          </div>
        )}

        {/* Quick Actions Card */}
        <div className={`bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-4 border border-white relative overflow-hidden hover:scale-[1.01] transition-transform duration-300 ${user.role === Role.SALES_ADMIN ? 'lg:col-span-3' : 'lg:col-span-1'}`}>
          <div className="relative z-10">
            <p className="text-sm font-label text-on-surface-variant mb-4">Quick Actions</p>
            <div className="flex flex-col gap-2">
              {user.role === Role.SALES_ADMIN && (
                <Link href="/dashboard/leads/new" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">add_circle</span> Add New Lead
                </Link>
              )}
              {(user.role === Role.TECH_ADMIN || user.role === Role.SUPER_ADMIN) && (
                <>
                  <Link href="/dashboard/tasks/new" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">assignment_add</span> Assign Task
                  </Link>
                  <Link href="/dashboard/staff/new" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">person_add</span> Create Staff
                  </Link>
                </>
              )}
              {user.role === Role.STAFF && (
                <Link href="/dashboard/my-tasks" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">checklist</span> View My Tasks
                </Link>
              )}
            </div>
          </div>
          <div className="absolute right-0 bottom-0 w-32 h-32 opacity-10 pointer-events-none translate-x-8 translate-y-8">
            <span className="material-symbols-outlined text-9xl text-primary">bolt</span>
          </div>
        </div>
      </section>
      
      {/* Main Dashboard Visualizations */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* System Activity Feed */}
        <div className="lg:col-span-3 bg-surface-container-lowest rounded-xl p-6 border border-white shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-outline-variant/30 pb-4">
            <h4 className="text-lg font-bold text-on-surface">Recent Activity</h4>
            <span className="text-xs font-bold px-2 py-1 bg-surface-container-low rounded-md text-on-surface-variant">Real-time</span>
          </div>
          
          <div className="flex flex-col gap-6">
            {stats.recentActivity.length === 0 ? (
              <p className="text-sm text-on-surface-variant py-8 text-center">No recent activity found in the system.</p>
            ) : (
              stats.recentActivity.map(log => {
                let colorClass = 'bg-gray-200';
                let icon = 'history';
                let title = log.action.replace(/_/g, ' ');

                if (log.action.includes('LEAD')) { colorClass = 'bg-blue-500'; icon = 'person_add'; }
                if (log.action.includes('TASK')) { colorClass = 'bg-orange-500'; icon = 'task_alt'; }
                if (log.action.includes('USER') || log.action.includes('STAFF')) { colorClass = 'bg-purple-500'; icon = 'badge'; }

                return (
                  <div key={log.id} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full ${colorClass} bg-opacity-20 text-${colorClass.replace('bg-', '')} flex items-center justify-center flex-shrink-0 mt-1`}>
                      <span className="material-symbols-outlined text-sm">{icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface capitalize">{title.toLowerCase()}</p>
                      <p className="text-xs text-on-surface-variant">
                        By {log.user?.name || 'System User'} • {log.entityType} ID: {log.entityId.slice(-6)}
                      </p>
                      <span className="text-[10px] text-outline-variant font-label mt-1 block">
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
    </>
  );
}
