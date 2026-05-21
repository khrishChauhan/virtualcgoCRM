'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceType } from '@prisma/client';

export function LeadForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Multi-select state for services
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

      // Redirect back to leads list
      router.push('/dashboard/leads');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-white rounded-xl shadow-sm p-8 max-w-4xl">
      {error && (
        <div className="mb-6 p-4 bg-error-container text-on-error-container rounded-lg border border-error/20 flex items-start gap-3">
          <span className="material-symbols-outlined text-error mt-0.5">error</span>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Core Identity */}
        <div className="md:col-span-2 border-b border-outline-variant/30 pb-4 mb-2">
          <h3 className="text-lg font-bold text-on-surface">Client Identity</h3>
          <p className="text-xs text-on-surface-variant">Basic contact and business information.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface-variant">Owner/Contact Name *</label>
          <input required name="ownerName" type="text" className="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" placeholder="John Doe" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface-variant">Business Email *</label>
          <input required name="businessEmail" type="email" className="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" placeholder="john@company.com" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface-variant">Phone Number</label>
          <input name="phone" type="tel" className="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" placeholder="+1 (555) 000-0000" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface-variant">Business Category</label>
          <input name="businessCategory" type="text" className="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" placeholder="e.g. Real Estate, E-commerce" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-on-surface-variant">Business Address</label>
          <input name="businessAddress" type="text" className="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" placeholder="Full physical address if applicable" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-on-surface-variant">Business Description</label>
          <textarea name="businessDescription" rows={3} className="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm resize-none" placeholder="What does this business do? What are their goals?"></textarea>
        </div>

        {/* Services Needed */}
        <div className="md:col-span-2 border-b border-outline-variant/30 pb-4 mt-4 mb-2">
          <h3 className="text-lg font-bold text-on-surface">Required Services</h3>
          <p className="text-xs text-on-surface-variant">Select all services the client is interested in.</p>
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-2">
          {Object.keys(ServiceType).map((service) => {
            const isSelected = selectedServices.includes(service as ServiceType);
            return (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service as ServiceType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  isSelected 
                    ? 'bg-primary text-on-primary border-primary' 
                    : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:border-outline-variant'
                }`}
              >
                {service.replace(/_/g, ' ')}
              </button>
            );
          })}
        </div>

        {/* Assets & Links */}
        <div className="md:col-span-2 border-b border-outline-variant/30 pb-4 mt-4 mb-2">
          <h3 className="text-lg font-bold text-on-surface">Assets & Links</h3>
          <p className="text-xs text-on-surface-variant">Brand materials and social profiles.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface-variant">Brand Colors</label>
          <input name="brandColors" type="text" className="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" placeholder="e.g. #FF0000, #00FF00" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface-variant">Logo Link</label>
          <input name="logoLink" type="url" className="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" placeholder="https://..." />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface-variant">Google Drive Link (Master Folder)</label>
          <input name="driveLink" type="url" className="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" placeholder="https://drive.google.com/..." />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface-variant">Instagram</label>
          <input name="instagramLink" type="url" className="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" placeholder="https://instagram.com/..." />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface-variant">Facebook</label>
          <input name="facebookLink" type="url" className="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" placeholder="https://facebook.com/..." />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface-variant">LinkedIn</label>
          <input name="linkedinLink" type="url" className="w-full px-4 py-2 bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-sm" placeholder="https://linkedin.com/..." />
        </div>
      </div>

      <div className="mt-10 flex justify-end gap-4 border-t border-outline-variant/30 pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-70 flex items-center gap-2"
        >
          {isSubmitting ? (
            <><span className="material-symbols-outlined animate-spin text-sm">refresh</span> Creating...</>
          ) : (
            'Create Lead'
          )}
        </button>
      </div>
    </form>
  );
}
