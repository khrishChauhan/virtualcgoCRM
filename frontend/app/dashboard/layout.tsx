import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { AUTH_COOKIE_NAME } from '@/lib/auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Verify auth directly here — avoids the "user possibly undefined" TS issue
  // that occurs when getAuthUser() is inside a try/catch followed by redirect()
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    redirect('/login');
  }

  let role: string;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? '');
    const { payload } = await jwtVerify(token, secret);
    role = (payload as any).role as string;
    if (!role) redirect('/login');
  } catch {
    redirect('/login');
  }

  return (
    <DashboardShell userRole={role!}>
      {children}
    </DashboardShell>
  );
}
