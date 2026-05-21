import React from 'react';
import { getAuthUser } from '@/lib/get-auth-user';
import prisma from '@/lib/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { Role } from '@prisma/client';
import { LeadStatusBadge } from '@/components/leads/lead-status-badge';

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  const { id } = await params;

  if (user.role === Role.STAFF) {
    redirect('/dashboard');
  }

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      createdBy: { select: { name: true, email: true } },
      tasks: {
        orderBy: { createdAt: 'desc' },
        include: { assignedTo: { select: { name: true } } }
      }
    }
  });

  if (!lead) return notFound();

  if (user.role === Role.SALES_ADMIN && lead.createdById !== user.userId) {
    redirect('/dashboard/leads');
  }

  return (
    <>
      <div className="mb-8">
        <Link href="/dashboard/leads" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 mb-4">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to Leads
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-black text-primary tracking-tight">{lead.ownerName}</h2>
              <LeadStatusBadge status={lead.status} />
            </div>
            <p className="text-on-surface-variant font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">mail</span>
              {lead.businessEmail}
            </p>
          </div>
          
          {(user.role === Role.TECH_ADMIN || user.role === Role.SUPER_ADMIN) && (
            <Link
              href={`/dashboard/tasks/new?leadId=${lead.id}`}
              className="flex items-center gap-2 px-6 py-3 bg-secondary text-on-secondary font-bold rounded-lg shadow-sm hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-sm">assignment_add</span>
              Create Task from Lead
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest border border-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-3">Business Overview</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-label text-on-surface-variant mb-1">Category</p>
                <p className="font-medium text-sm text-on-surface">{lead.businessCategory || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs font-label text-on-surface-variant mb-1">Phone</p>
                <p className="font-medium text-sm text-on-surface">{lead.phone || 'Not specified'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-label text-on-surface-variant mb-1">Address</p>
                <p className="font-medium text-sm text-on-surface">{lead.businessAddress || 'Not specified'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-label text-on-surface-variant mb-1">Description / Notes</p>
                <p className="font-medium text-sm text-on-surface bg-surface-container-low/50 p-4 rounded-lg mt-1 whitespace-pre-wrap">
                  {lead.businessDescription || 'No description provided.'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-on-surface mb-6 border-b border-outline-variant/30 pb-3">Required Services</h3>
            {lead.requiredServices.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {lead.requiredServices.map(service => (
                  <span key={service} className="px-3 py-1 bg-primary-container/30 text-on-primary-container rounded-lg text-xs font-bold border border-primary-container/50">
                    {service.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">No specific services selected.</p>
            )}
          </div>
          
          {/* Associated Tasks */}
          <div className="bg-surface-container-lowest border border-white rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-outline-variant/30">
              <h3 className="text-lg font-bold text-on-surface">Associated Tasks</h3>
            </div>
            {lead.tasks.length > 0 ? (
              <div className="divide-y divide-outline-variant/20">
                {lead.tasks.map(task => (
                  <div key={task.id} className="p-4 hover:bg-surface-container-low/30 transition-colors flex justify-between items-center">
                    <div>
                      <p className="font-bold text-sm text-on-surface">{task.title}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">Assigned to: {task.assignedTo?.name || 'Unassigned'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded border ${
                        task.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border-green-200' :
                        task.status === 'IN_PROGRESS' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <Link href={`/dashboard/tasks/${task.id}`} className="text-primary hover:underline text-xs font-bold">
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-on-surface-variant text-sm">
                No tasks created for this lead yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Assets & Meta */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest border border-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm uppercase tracking-wider font-bold text-on-surface-variant mb-4">Assets & Links</h3>
            <div className="space-y-4">
              {lead.driveLink && (
                <a href={lead.driveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-blue-500">folder_shared</span>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-on-surface">Master Drive</p>
                    <p className="text-[10px] text-on-surface-variant font-label truncate w-32">Google Drive Folder</p>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">open_in_new</span>
                </a>
              )}
              {lead.logoLink && (
                <a href={lead.logoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-purple-500">image</span>
                  <div className="flex-grow">
                    <p className="text-sm font-bold text-on-surface">Logo File</p>
                    <p className="text-[10px] text-on-surface-variant font-label truncate w-32">Brand Asset</p>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">open_in_new</span>
                </a>
              )}
              
              {(lead.instagramLink || lead.facebookLink || lead.linkedinLink) && (
                <div className="pt-4 border-t border-outline-variant/30 mt-4">
                  <p className="text-xs font-label text-on-surface-variant mb-3">Social Profiles</p>
                  <div className="flex gap-2">
                    {lead.instagramLink && (
                      <a href={lead.instagramLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center hover:bg-pink-200 transition-colors" title="Instagram">
                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                      </a>
                    )}
                    {lead.facebookLink && (
                      <a href={lead.facebookLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-200 transition-colors" title="Facebook">
                        <span className="material-symbols-outlined text-sm">thumb_up</span>
                      </a>
                    )}
                    {lead.linkedinLink && (
                      <a href={lead.linkedinLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center hover:bg-sky-200 transition-colors" title="LinkedIn">
                        <span className="material-symbols-outlined text-sm">work</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {lead.brandColors && (
                <div className="pt-4 border-t border-outline-variant/30 mt-4">
                  <p className="text-xs font-label text-on-surface-variant mb-2">Brand Colors</p>
                  <div className="flex gap-2 flex-wrap">
                    {lead.brandColors.split(',').map(color => (
                      <div key={color.trim()} className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1 rounded-md border border-outline-variant/50">
                        <div className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: color.trim() }}></div>
                        <span className="text-[10px] font-mono text-on-surface-variant">{color.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-white rounded-xl shadow-sm p-6">
            <h3 className="text-sm uppercase tracking-wider font-bold text-on-surface-variant mb-4">Meta Data</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-label text-on-surface-variant">Sourced By</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-[10px] font-bold uppercase">
                    {lead.createdBy.name.charAt(0)}
                  </div>
                  <p className="text-sm font-medium">{lead.createdBy.name}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-label text-on-surface-variant">Added On</p>
                <p className="text-sm font-medium mt-1">{new Date(lead.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
