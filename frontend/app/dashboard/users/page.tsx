import React from 'react';
import { getAuthUser } from '@/lib/get-auth-user';
import prisma from '@/lib/prisma';
import { UserTable } from '@/components/users/user-table';
import Link from 'next/link';
import { Role } from '@prisma/client';
import { redirect } from 'next/navigation';

export default async function UsersPage() {
  const user = await getAuthUser();

  // ONLY Super Admin can manage all users
  if (user.role !== Role.SUPER_ADMIN) {
    redirect('/dashboard');
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-primary tracking-tight">System Users</h2>
          <p className="text-on-surface-variant font-medium mt-1">Manage all accounts across the entire CRM.</p>
        </div>
        <Link
          href="/dashboard/users/new"
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-sm">shield_person</span>
          Create Admin / User
        </Link>
      </div>

      <UserTable users={users as any} currentUserId={user.userId} />
    </>
  );
}
