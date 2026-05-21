import React from 'react';
import { getAuthUser } from '@/lib/get-auth-user';
import prisma from '@/lib/prisma';
import { UserTable } from '@/components/users/user-table';
import Link from 'next/link';
import { Role } from '@prisma/client';
import { redirect } from 'next/navigation';

export default async function StaffPage() {
  const user = await getAuthUser();

  // Only Tech Admin and Super Admin can manage staff
  if (user.role !== Role.TECH_ADMIN && user.role !== Role.SUPER_ADMIN) {
    redirect('/dashboard');
  }

  // Tech Admin only sees staff. Super Admin can see staff here, but they have their own full users page too.
  const users = await prisma.user.findMany({
    where: { role: Role.STAFF },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { name: 'asc' },
  });

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-primary tracking-tight">Staff Management</h2>
          <p className="text-on-surface-variant font-medium mt-1">Manage operations staff and task execution teams.</p>
        </div>
        <Link
          href="/dashboard/staff/new"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-sm">person_add</span>
          Add Staff Member
        </Link>
      </div>

      <UserTable users={users as any} currentUserId={user.userId} />
    </>
  );
}
