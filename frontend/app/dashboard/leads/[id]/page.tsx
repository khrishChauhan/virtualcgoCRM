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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
      <div className="mb-12">
        <Link href="/dashboard/leads" className="text-[13px] font-semibold text-[#abc4ff] hover:text-slate-900 transition-colors flex items-center gap-1.5 mb-6">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Leads
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-[32px] font-bold text-slate-900 tracking-tight">{lead.ownerName}</h2>
              <LeadStatusBadge status={lead.status} />
            </div>
            <p className="text-[15px] text-slate-500 font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-slate-400">mail</span>
              {lead.businessEmail}
            </p>
          </div>
          
          {(user.role === Role.TECH_ADMIN || user.role === Role.SUPER_ADMIN) && (
            <Link
              href={`/dashboard/tasks/new?leadId=${lead.id}`}
              className="relative flex items-center justify-center gap-2 rounded-[12px] bg-[#0f172a] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_2px_8px_rgba(15,23,42,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#1e293b] hover:shadow-[0_4px_12px_rgba(15,23,42,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">assignment_add</span>
              Create Task from Lead
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-[24px] bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] p-8">
            <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight mb-6 border-b border-slate-100 pb-4">Business Overview</h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-10">
              <div>
                <p className="text-[12px] uppercase tracking-widest font-semibold text-slate-400 mb-1.5">Category</p>
                <p className="font-semibold text-[15px] text-slate-900">{lead.businessCategory || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-[12px] uppercase tracking-widest font-semibold text-slate-400 mb-1.5">Phone</p>
                <p className="font-semibold text-[15px] text-slate-900">{lead.phone || 'Not specified'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[12px] uppercase tracking-widest font-semibold text-slate-400 mb-1.5">Address</p>
                <p className="font-semibold text-[15px] text-slate-900">{lead.businessAddress || 'Not specified'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[12px] uppercase tracking-widest font-semibold text-slate-400 mb-1.5">Description / Notes</p>
                <div className="bg-slate-50/50 border border-slate-100 p-5 rounded-[16px] mt-2">
                  <p className="font-medium text-[14px] text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {lead.businessDescription || 'No description provided.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] p-8">
            <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight mb-6 border-b border-slate-100 pb-4">Required Services</h3>
            {lead.requiredServices.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {lead.requiredServices.map(service => (
                  <span key={service} className="px-3.5 py-1.5 bg-[#abc4ff]/10 text-slate-800 rounded-[8px] text-[12px] font-bold border border-[#abc4ff]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
                    {service.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-[14px] font-medium text-slate-400">No specific services selected.</p>
            )}
          </div>
          
          {/* Associated Tasks */}
          <div className="rounded-[24px] bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/30">
              <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Associated Tasks</h3>
            </div>
            {lead.tasks.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {lead.tasks.map(task => (
                  <div key={task.id} className="p-6 hover:bg-slate-50/80 transition-colors flex justify-between items-center group">
                    <div>
                      <p className="font-semibold text-[15px] text-slate-900">{task.title}</p>
                      <p className="text-[13px] text-slate-500 font-medium mt-1">Assigned to: <span className="text-slate-700 font-semibold">{task.assignedTo?.name || 'Unassigned'}</span></p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`text-[11px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-[6px] border ${
                        task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]' :
                        task.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]' :
                        'bg-slate-100 text-slate-600 border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)]'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <Link href={`/dashboard/tasks/${task.id}`} className="text-[13px] font-semibold text-[#abc4ff] hover:text-slate-900 transition-colors opacity-0 group-hover:opacity-100">
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400 text-[14px] font-medium">
                No tasks created for this lead yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Assets & Meta */}
        <div className="space-y-8">
          <div className="rounded-[24px] bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] p-8">
            <h3 className="text-[12px] uppercase tracking-widest font-bold text-slate-400 mb-6">Assets & Links</h3>
            <div className="space-y-4">
              {lead.driveLink && (
                <a href={lead.driveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 p-4 bg-slate-50/80 border border-slate-200/60 rounded-[16px] hover:bg-slate-100 transition-colors group">
                  <span className="material-symbols-outlined text-[#abc4ff] text-[24px]">folder_shared</span>
                  <div className="flex-grow">
                    <p className="text-[14px] font-semibold text-slate-900">Master Drive</p>
                    <p className="text-[11px] text-slate-500 font-medium truncate w-32 mt-0.5">Google Drive Folder</p>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-slate-300 group-hover:text-slate-600 transition-colors">open_in_new</span>
                </a>
              )}
              {lead.logoLink && (
                <a href={lead.logoLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3.5 p-4 bg-slate-50/80 border border-slate-200/60 rounded-[16px] hover:bg-slate-100 transition-colors group">
                  <span className="material-symbols-outlined text-purple-400 text-[24px]">image</span>
                  <div className="flex-grow">
                    <p className="text-[14px] font-semibold text-slate-900">Logo File</p>
                    <p className="text-[11px] text-slate-500 font-medium truncate w-32 mt-0.5">Brand Asset</p>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-slate-300 group-hover:text-slate-600 transition-colors">open_in_new</span>
                </a>
              )}
              
              {(lead.instagramLink || lead.facebookLink || lead.linkedinLink) && (
                <div className="pt-6 border-t border-slate-100 mt-6">
                  <p className="text-[12px] uppercase tracking-widest font-semibold text-slate-400 mb-4">Social Profiles</p>
                  <div className="flex gap-3">
                    {lead.instagramLink && (
                      <a href={lead.instagramLink} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-[14px] bg-pink-50 text-pink-500 flex items-center justify-center hover:bg-pink-100 transition-colors border border-pink-100 shadow-sm" title="Instagram">
                        <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                      </a>
                    )}
                    {lead.facebookLink && (
                      <a href={lead.facebookLink} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-[14px] bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors border border-blue-100 shadow-sm" title="Facebook">
                        <span className="material-symbols-outlined text-[20px]">thumb_up</span>
                      </a>
                    )}
                    {lead.linkedinLink && (
                      <a href={lead.linkedinLink} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-[14px] bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-100 transition-colors border border-sky-100 shadow-sm" title="LinkedIn">
                        <span className="material-symbols-outlined text-[20px]">work</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {lead.brandColors && (
                <div className="pt-6 border-t border-slate-100 mt-6">
                  <p className="text-[12px] uppercase tracking-widest font-semibold text-slate-400 mb-4">Brand Colors</p>
                  <div className="flex gap-3 flex-wrap">
                    {lead.brandColors.split(',').map(color => (
                      <div key={color.trim()} className="flex items-center gap-2 bg-slate-50/80 px-3 py-2 rounded-[10px] border border-slate-200/60 shadow-sm">
                        <div className="w-4 h-4 rounded-full border border-black/10 shadow-inner" style={{ backgroundColor: color.trim() }}></div>
                        <span className="text-[12px] font-medium text-slate-700">{color.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[24px] bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] p-8">
            <h3 className="text-[12px] uppercase tracking-widest font-bold text-slate-400 mb-6">Meta Data</h3>
            <div className="space-y-6">
              <div>
                <p className="text-[12px] uppercase tracking-widest font-semibold text-slate-400 mb-2">Sourced By</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[10px] bg-[#abc4ff]/20 text-slate-700 border border-[#abc4ff]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,1)] flex items-center justify-center text-[12px] font-bold uppercase">
                    {lead.createdBy.name.charAt(0)}
                  </div>
                  <p className="text-[14px] font-semibold text-slate-900">{lead.createdBy.name}</p>
                </div>
              </div>
              <div>
                <p className="text-[12px] uppercase tracking-widest font-semibold text-slate-400 mb-1">Added On</p>
                <p className="text-[14px] font-semibold text-slate-900 mt-1">{new Date(lead.createdAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
