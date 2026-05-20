import React from 'react';
import { getAuthUser } from '@/lib/get-auth-user';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let user;
  try {
    user = await getAuthUser();
  } catch (err) {
    redirect('/login');
  }

  return (
    <DashboardShell userRole={user.role}>
      {children}
    </DashboardShell>
  );
}
