'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceType } from '@prisma/client';

export function LeadForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);

  const toggleService = (service: ServiceType) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      ownerName: formData.get('ownerName'),
      businessEmail: formData.get('businessEmail'),
      phone: formData.get('phone'),
      businessAddress: formData.get('businessAddress'),
      businessCategory: formData.get('businessCategory'),
      businessDescription: formData.get('businessDescription'),
      requiredServices: selectedServices,
      brandColors: formData.get('brandColors'),
      logoLink: formData.get('logoLink'),
      driveLink: formData.get('driveLink'),
      instagramLink: formData.get('instagramLink'),
      facebookLink: formData.get('facebookLink'),
      linkedinLink: formData.get('linkedinLink'),
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Failed to create lead');
      }

      router.push('/dashboard/leads');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[24px] bg-white/70 backdrop-blur-2xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.05)] p-10 max-w-4xl transition-all">
      {error && (
        <div className="mb-8 p-4 bg-red-50/80 text-red-800 rounded-[14px] border border-red-100/50 flex items-start gap-3 shadow-sm">
          <span className="material-symbols-outlined text-red-500 mt-0.5 text-[18px]">error</span>
          <p className="text-[13px] font-medium leading-relaxed">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        {/* Core Identity */}
        <div className="md:col-span-2 border-b border-slate-200/60 pb-5 mb-2">
          <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Client Identity</h3>
          <p className="text-[13px] text-slate-500 font-medium mt-1">Basic contact and business information.</p>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-slate-700">Owner/Contact Name *</label>
          <input required name="ownerName" type="text" className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)]" placeholder="John Doe" />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-slate-700">Business Email *</label>
          <input required name="businessEmail" type="email" className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)]" placeholder="john@company.com" />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-slate-700">Phone Number</label>
          <input name="phone" type="tel" className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)]" placeholder="+1 (555) 000-0000" />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-slate-700">Business Category</label>
          <input name="businessCategory" type="text" className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)]" placeholder="e.g. Real Estate, E-commerce" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[13px] font-medium text-slate-700">Business Address</label>
          <input name="businessAddress" type="text" className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)]" placeholder="Full physical address if applicable" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-[13px] font-medium text-slate-700">Business Description</label>
          <textarea name="businessDescription" rows={3} className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)] resize-none" placeholder="What does this business do? What are their goals?"></textarea>
        </div>

        {/* Services Needed */}
        <div className="md:col-span-2 border-b border-slate-200/60 pb-5 mt-4 mb-2">
          <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Required Services</h3>
          <p className="text-[13px] text-slate-500 font-medium mt-1">Select all services the client is interested in.</p>
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-2.5">
          {Object.keys(ServiceType).map((service) => {
            const isSelected = selectedServices.includes(service as ServiceType);
            return (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service as ServiceType)}
                className={`px-4 py-2 rounded-[10px] text-[12px] font-semibold transition-all duration-200 border ${
                  isSelected 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.15)]' 
                    : 'bg-white text-slate-600 border-slate-200 shadow-sm hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {service.replace(/_/g, ' ')}
              </button>
            );
          })}
        </div>

        {/* Assets & Links */}
        <div className="md:col-span-2 border-b border-slate-200/60 pb-5 mt-4 mb-2">
          <h3 className="text-[18px] font-semibold text-slate-900 tracking-tight">Assets & Links</h3>
          <p className="text-[13px] text-slate-500 font-medium mt-1">Brand materials and social profiles.</p>
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-slate-700">Brand Colors</label>
          <input name="brandColors" type="text" className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)]" placeholder="e.g. #FF0000, #00FF00" />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-slate-700">Logo Link</label>
          <input name="logoLink" type="url" className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)]" placeholder="https://..." />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-slate-700">Google Drive Link (Master Folder)</label>
          <input name="driveLink" type="url" className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)]" placeholder="https://drive.google.com/..." />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-slate-700">Instagram</label>
          <input name="instagramLink" type="url" className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)]" placeholder="https://instagram.com/..." />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-slate-700">Facebook</label>
          <input name="facebookLink" type="url" className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)]" placeholder="https://facebook.com/..." />
        </div>

        <div className="space-y-2">
          <label className="text-[13px] font-medium text-slate-700">LinkedIn</label>
          <input name="linkedinLink" type="url" className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)]" placeholder="https://linkedin.com/..." />
        </div>
      </div>

      <div className="mt-12 flex justify-end gap-3 pt-8 border-t border-slate-200/60">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-[12px] text-[14px] font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="relative flex items-center justify-center gap-2 rounded-[12px] bg-[#0f172a] px-8 py-3 text-[14px] font-semibold text-white shadow-[0_2px_8px_rgba(15,23,42,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#1e293b] hover:shadow-[0_4px_12px_rgba(15,23,42,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
        >
          {isSubmitting ? (
            <><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span> Creating...</>
          ) : (
            'Create Lead'
          )}
        </button>
      </div>
    </form>
  );
}
