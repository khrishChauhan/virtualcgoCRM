'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  userRole?: string;
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ userRole = 'STAFF', userName = 'Current User', userEmail = 'user@company.com' }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <aside className="flex flex-col h-full p-4 fixed left-0 top-0 z-40 bg-surface-container-lowest dark:bg-surface-container w-72 rounded-r-xl shadow-sm dark:shadow-none border-r border-outline-variant dark:border-outline">
      <div className="flex flex-col gap-6 h-full">
        {/* Brand Identity */}
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary dark:text-primary-fixed-dim">VirtualCGO</h1>
            <p className="text-xs text-on-surface-variant opacity-70">Premium Dashboard</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 flex-grow">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              pathname === '/dashboard'
                ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary scale-[0.98]'
                : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label">Overview</span>
          </Link>

          {(userRole === 'TECH_ADMIN' || userRole === 'SUPER_ADMIN' || userRole === 'SALES_ADMIN') && (
            <Link
              href="/dashboard/leads"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive('/dashboard/leads')
                  ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary scale-[0.98]'
                  : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">group</span>
              <span className="font-label">Leads</span>
            </Link>
          )}

          {(userRole === 'TECH_ADMIN' || userRole === 'SUPER_ADMIN') && (
            <Link
              href="/dashboard/tasks"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive('/dashboard/tasks')
                  ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary scale-[0.98]'
                  : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">assignment</span>
              <span className="font-label">Task Management</span>
            </Link>
          )}

          {userRole === 'STAFF' && (
            <Link
              href="/dashboard/my-tasks"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive('/dashboard/my-tasks')
                  ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary scale-[0.98]'
                  : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">checklist</span>
              <span className="font-label">My Tasks</span>
            </Link>
          )}

          {/* Staff Management - Tech & Super Admin */}
          {(userRole === 'TECH_ADMIN' || userRole === 'SUPER_ADMIN') && (
            <Link
              href="/dashboard/staff"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive('/dashboard/staff')
                  ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary scale-[0.98]'
                  : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">badge</span>
              <span className="font-label">Staff Management</span>
            </Link>
          )}

          {/* User Management - Super Admin Only */}
          {userRole === 'SUPER_ADMIN' && (
            <Link
              href="/dashboard/users"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive('/dashboard/users')
                  ? 'bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary scale-[0.98]'
                  : 'text-on-surface-variant dark:text-outline-variant hover:bg-surface-container-high dark:hover:bg-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined">admin_panel_settings</span>
              <span className="font-label">User Management</span>
            </Link>
          )}
        </nav>

        {/* Bottom CTA and Profile */}
        <div className="mt-auto flex flex-col gap-4">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-container-low">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-on-primary-fixed border border-outline-variant uppercase">
              {userName.substring(0, 2)}
            </div>
            <div className="overflow-hidden flex-grow">
              <p className="text-sm font-bold truncate">{userName}</p>
              <p className="text-xs text-on-surface-variant truncate capitalize">{userRole.replace('_', ' ').toLowerCase()}</p>
            </div>
            <button
              className="text-on-surface-variant hover:text-error transition-colors p-2"
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' });
                window.location.href = '/login';
              }}
              title="Logout"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
