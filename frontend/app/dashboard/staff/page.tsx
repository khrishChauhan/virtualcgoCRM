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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-[28px] font-semibold tracking-tight text-slate-900">Staff Management</h2>
          <p className="text-[15px] text-slate-500 font-medium mt-1">Manage operations staff and task execution teams.</p>
        </div>
        <Link
          href="/dashboard/staff/new"
          className="relative flex items-center justify-center gap-2 rounded-[12px] bg-[#0f172a] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_2px_8px_rgba(15,23,42,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#1e293b] hover:shadow-[0_4px_12px_rgba(15,23,42,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Add Staff Member
        </Link>
      </div>

      <UserTable users={users as any} currentUserId={user.userId} />
    </div>
  );
}
