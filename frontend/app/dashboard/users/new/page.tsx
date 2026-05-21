import React from 'react';
import { getAuthUser } from '@/lib/get-auth-user';
import { UserForm } from '@/components/users/user-form';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import Link from 'next/link';

export default async function NewUserPage() {
  const user = await getAuthUser();

  if (user.role !== Role.SUPER_ADMIN) {
    redirect('/dashboard');
  }

  return (
    <>
      <div className="mb-8">
        <Link href="/dashboard/users" className="text-sm font-bold text-red-600 hover:underline flex items-center gap-1 mb-4">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Users
        </Link>
        <h2 className="text-3xl font-black text-primary tracking-tight">Create System User</h2>
        <p className="text-on-surface-variant font-medium mt-1">Provision a new account with specific role-based access.</p>
      </div>

      <UserForm staffOnly={false} />
    </>
  );
}
