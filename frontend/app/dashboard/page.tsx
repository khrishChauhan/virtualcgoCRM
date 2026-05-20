import React from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <>
      {/* Top Navigation Bar */}
      <header className="flex justify-between items-center w-full mb-10">
        <div>
          <h2 className="text-3xl font-black text-primary dark:text-primary-fixed-dim tracking-tight">Welcome back.</h2>
          <p className="text-on-surface-variant font-medium mt-1">Here is what&apos;s happening with your growth pipeline today.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input className="pl-10 pr-4 py-2.5 bg-surface-container-lowest border-none rounded-xl w-64 shadow-sm focus:ring-2 focus:ring-primary/20 transition-all text-sm font-body" placeholder="Search data..." type="text" />
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">help</span>
          </button>
        </div>
      </header>
      
      {/* Bento Grid Summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {/* Stat Card 1 */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-4 border border-white hover:scale-[1.01] transition-transform duration-300">
          <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-on-primary-container">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person_add</span>
          </div>
          <div>
            <p className="text-sm font-label text-on-surface-variant">Total Leads</p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl font-black text-on-surface">1,284</h3>
              <span className="text-xs font-bold text-green-600 mb-1">+12%</span>
            </div>
          </div>
        </div>
        
        {/* Stat Card 2 */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-4 border border-white hover:scale-[1.01] transition-transform duration-300">
          <div className="w-12 h-12 rounded-xl bg-secondary-container flex items-center justify-center text-on-secondary-container">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
          </div>
          <div>
            <p className="text-sm font-label text-on-surface-variant">Active Tasks</p>
            <div className="flex items-end gap-2">
              <h3 className="text-2xl font-black text-on-surface">42</h3>
              <span className="text-xs font-bold text-on-surface-variant mb-1">6 pending</span>
            </div>
          </div>
        </div>
        
        {/* Stat Card 3 */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex flex-col gap-4 border border-white lg:col-span-2 overflow-hidden relative hover:scale-[1.01] transition-transform duration-300">
          <div className="relative z-10">
            <p className="text-sm font-label text-on-surface-variant">Pipeline Velocity</p>
            <h3 className="text-2xl font-black text-on-surface">84.2%</h3>
            <p className="text-xs text-on-surface-variant mt-1">Growth benchmark exceeded by 4.5% this month.</p>
          </div>
          <div className="absolute right-0 bottom-0 w-48 h-24 opacity-20 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 50">
              <path className="text-primary" d="M0 50 Q 25 45 40 20 T 100 10 L 100 50 Z" fill="currentColor"></path>
            </svg>
          </div>
        </div>
      </section>
      
      {/* Main Dashboard Visualizations */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Activity Chart */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-8 border border-white shadow-sm h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h4 className="text-lg font-bold text-on-surface">Revenue Growth &amp; Projections</h4>
              <p className="text-xs text-on-surface-variant">Monthly breakdown of virtual operations efficiency.</p>
            </div>
            <select className="text-xs font-label bg-surface-container-low border-none rounded-lg focus:ring-0">
              <option>Last 6 Months</option>
              <option>Yearly</option>
            </select>
          </div>
          <div className="flex-grow flex items-end gap-3 pb-2">
            <div className="flex-grow bg-primary-container/20 rounded-t-lg h-24 transition-all hover:bg-primary-container/40"></div>
            <div className="flex-grow bg-primary-container/20 rounded-t-lg h-48 transition-all hover:bg-primary-container/40"></div>
            <div className="flex-grow bg-primary-container/20 rounded-t-lg h-32 transition-all hover:bg-primary-container/40"></div>
            <div className="flex-grow bg-primary-container/20 rounded-t-lg h-64 transition-all hover:bg-primary-container/40"></div>
            <div className="flex-grow bg-primary rounded-t-lg h-80 transition-all shadow-lg shadow-primary/20"></div>
            <div className="flex-grow bg-primary-container/20 rounded-t-lg h-40 transition-all hover:bg-primary-container/40"></div>
          </div>
          <div className="flex justify-between px-2 pt-4 text-[10px] uppercase tracking-widest font-bold text-on-surface-variant opacity-50">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </div>
        
        {/* Recent Activity List */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-white shadow-sm flex flex-col h-[400px]">
          <h4 className="text-lg font-bold text-on-surface mb-6">Recent Activity</h4>
          <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-bold text-on-surface">New Lead Acquired</p>
                <p className="text-xs text-on-surface-variant">Enterprise Solutions Inc. added to &apos;Hot&apos; pipeline.</p>
                <span className="text-[10px] text-outline-variant font-label mt-1 block">2 MINS AGO</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-tertiary-container mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-bold text-on-surface">Task Completed</p>
                <p className="text-xs text-on-surface-variant">Quarterly growth review for North Region.</p>
                <span className="text-[10px] text-outline-variant font-label mt-1 block">45 MINS AGO</span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-sm font-bold text-on-surface">Meeting Scheduled</p>
                <p className="text-xs text-on-surface-variant">Consultation with Global Logistics Group.</p>
                <span className="text-[10px] text-outline-variant font-label mt-1 block">2 HOURS AGO</span>
              </div>
            </div>
          </div>
          <button className="mt-auto pt-4 text-xs font-bold text-primary hover:underline text-left">View All Logs</button>
        </div>
      </section>
    </>
  );
}
