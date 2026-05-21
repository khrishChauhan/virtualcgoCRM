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
  let userName: string;
  let userEmail: string;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? '');
    const { payload } = await jwtVerify(token, secret);
    
    // We need to fetch the real user name and email from the DB
    // since the JWT might only contain the ID and role
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: (payload as any).userId },
      select: { name: true, email: true, role: true }
    });

    if (!user) redirect('/login');
    
    role = user.role;
    userName = user.name;
    userEmail = user.email;
  } catch {
    redirect('/login');
  }

  return (
    <DashboardShell userRole={role} userName={userName} userEmail={userEmail}>
      {children}
    </DashboardShell>
  );
}
