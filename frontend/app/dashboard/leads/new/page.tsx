import React from 'react';
import { getAuthUser } from '@/lib/get-auth-user';
import { LeadForm } from '@/components/leads/lead-form';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';
import Link from 'next/link';

export default async function NewLeadPage() {
  const user = await getAuthUser();

  if (user.role !== Role.SALES_ADMIN) {
    redirect('/dashboard/leads');
  }

  return (
    <>
      <div className="mb-8">
        <Link href="/dashboard/leads" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 mb-4">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Leads
        </Link>
        <h2 className="text-3xl font-black text-primary tracking-tight">Create New Lead</h2>
        <p className="text-on-surface-variant font-medium mt-1">Add a new client to the pipeline to begin the work flow.</p>
      </div>

      <LeadForm />
    </>
  );
}
