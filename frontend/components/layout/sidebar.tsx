'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface SidebarProps {
  userRole?: string;
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ userRole = 'STAFF', userName = 'Current User', userEmail = 'user@company.com' }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r border-slate-200/60 bg-white/50 backdrop-blur-xl p-5 shadow-[4px_0_24px_rgba(0,0,0,0.01)] transition-all">
      <div className="flex h-full flex-col gap-8">
        
        {/* Brand Identity */}
        <div className="flex items-center px-3 py-2 pb-4">
          <Image 
            src="/logo.png" 
            alt="VirtualCGO Logo" 
            width={200} 
            height={40} 
            className="h-10 w-auto object-contain" 
            priority 
          />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5 flex-grow">
          <Link
            href="/dashboard"
            className={`group flex items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              pathname === '/dashboard'
                ? 'bg-slate-900 text-white shadow-[0_2px_8px_rgba(15,23,42,0.15)]'
                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${pathname === '/dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 transition-colors'}`}>dashboard</span>
            <span>Overview</span>
          </Link>

          {(userRole === 'TECH_ADMIN' || userRole === 'SUPER_ADMIN' || userRole === 'SALES_ADMIN') && (
            <Link
              href="/dashboard/leads"
              className={`group flex items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive('/dashboard/leads')
                  ? 'bg-slate-900 text-white shadow-[0_2px_8px_rgba(15,23,42,0.15)]'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive('/dashboard/leads') ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 transition-colors'}`}>group</span>
              <span>Leads</span>
            </Link>
          )}

          {(userRole === 'TECH_ADMIN' || userRole === 'SUPER_ADMIN') && (
            <Link
              href="/dashboard/tasks"
              className={`group flex items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive('/dashboard/tasks')
                  ? 'bg-slate-900 text-white shadow-[0_2px_8px_rgba(15,23,42,0.15)]'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive('/dashboard/tasks') ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 transition-colors'}`}>assignment</span>
              <span>Task Management</span>
            </Link>
          )}

          {userRole === 'STAFF' && (
            <Link
              href="/dashboard/my-tasks"
              className={`group flex items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive('/dashboard/my-tasks')
                  ? 'bg-slate-900 text-white shadow-[0_2px_8px_rgba(15,23,42,0.15)]'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive('/dashboard/my-tasks') ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 transition-colors'}`}>checklist</span>
              <span>My Tasks</span>
            </Link>
          )}

          {/* Staff Management - Tech & Super Admin */}
          {(userRole === 'TECH_ADMIN' || userRole === 'SUPER_ADMIN') && (
            <Link
              href="/dashboard/staff"
              className={`group flex items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive('/dashboard/staff')
                  ? 'bg-slate-900 text-white shadow-[0_2px_8px_rgba(15,23,42,0.15)]'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive('/dashboard/staff') ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 transition-colors'}`}>badge</span>
              <span>Staff Management</span>
            </Link>
          )}

          {/* User Management - Super Admin Only */}
          {userRole === 'SUPER_ADMIN' && (
            <Link
              href="/dashboard/users"
              className={`group flex items-center gap-3 rounded-[12px] px-3.5 py-2.5 text-[14px] font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isActive('/dashboard/users')
                  ? 'bg-slate-900 text-white shadow-[0_2px_8px_rgba(15,23,42,0.15)]'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive('/dashboard/users') ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 transition-colors'}`}>admin_panel_settings</span>
              <span>User Management</span>
            </Link>
          )}
        </nav>

        {/* Bottom CTA and Profile */}
        <div className="mt-auto pt-4 border-t border-slate-200/60">
          <div className="flex items-center gap-3 rounded-[14px] p-2 transition-colors hover:bg-slate-100/80">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-200/50 text-[11px] font-bold uppercase tracking-wider text-slate-700 border border-slate-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]">
              {userName.substring(0, 2)}
            </div>
            <div className="flex-grow overflow-hidden">
              <p className="truncate text-[13px] font-semibold text-slate-900">{userName}</p>
              <p className="truncate text-[11px] font-medium text-slate-500 capitalize">{userRole.replace('_', ' ').toLowerCase()}</p>
            </div>
            <button
              className="group flex h-8 w-8 items-center justify-center rounded-full transition-all hover:bg-red-50"
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              }}
              title="Logout"
            >
              <span className="material-symbols-outlined text-[18px] text-slate-400 group-hover:text-red-500 transition-colors">logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
