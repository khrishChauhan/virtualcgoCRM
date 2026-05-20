import React from 'react';
import { Sidebar } from './sidebar';

interface DashboardShellProps {
  children: React.ReactNode;
  userRole: string;
}

export function DashboardShell({ children, userRole }: DashboardShellProps) {
  return (
    <div className="text-on-surface bg-background min-h-screen">
      <Sidebar userRole={userRole} />
      <main className="ml-72 min-h-screen p-8">
        <div className="max-w-[1920px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
