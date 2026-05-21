import React from 'react';
import { Sidebar } from './sidebar';

interface DashboardShellProps {
  children: React.ReactNode;
  userRole: string;
  userName?: string;
  userEmail?: string;
}

export function DashboardShell({ children, userRole, userName, userEmail }: DashboardShellProps) {
  return (
    <div className="text-on-surface bg-background min-h-screen">
      <Sidebar userRole={userRole} userName={userName} userEmail={userEmail} />
      <main className="ml-72 min-h-screen p-8">
        <div className="max-w-[1920px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
