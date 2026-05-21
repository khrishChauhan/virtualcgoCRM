'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? 'Login failed. Please verify your credentials.');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#fafcff] text-slate-900 selection:bg-[#abc4ff]/40 selection:text-slate-900 font-sans">
      
      {/* Premium Ambient Background Mesh */}
      <div className="pointer-events-none absolute inset-0 z-0 flex justify-center overflow-hidden">
        {/* Soft primary glow */}
        <div className="absolute -top-[10%] w-[1000px] h-[600px] rounded-[100%] bg-gradient-to-b from-[#e2eafc]/60 to-transparent opacity-80 blur-[80px]" />
        {/* Secondary accent glow */}
        <div className="absolute top-[30%] -left-[20%] w-[600px] h-[600px] rounded-[100%] bg-[#c1d3fe]/30 blur-[120px]" />
        <div className="absolute top-[20%] -right-[20%] w-[500px] h-[500px] rounded-[100%] bg-[#abc4ff]/20 blur-[100px]" />
      </div>

      {/* Header (Absolute Top) */}
      <header className="absolute top-0 w-full px-8 py-8 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-b from-[#abc4ff] to-[#8dafff] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_2px_4px_rgba(171,196,255,0.3)]">
              <span className="material-symbols-outlined text-[16px] text-white">hub</span>
            </div>
            <span className="text-[15px] font-bold tracking-tight text-slate-800">VirtualCGO</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span className="text-[11px] font-semibold uppercase tracking-widest">Enterprise Secure</span>
          </div>
        </div>
      </header>

      {/* Main Login Container */}
      <main className="relative z-10 w-full max-w-[420px] px-5 pb-16">
        
        {/* Title Area */}
        <div className="mb-8 text-center">
          <h1 className="mb-2.5 text-[28px] font-semibold tracking-[-0.02em] text-slate-900">
            Welcome back
          </h1>
          <p className="text-[15px] text-slate-500">
            Sign in to your operations dashboard.
          </p>
        </div>

        {/* The Card - Quiet Luxury Glassmorphism */}
        <div className="group relative overflow-hidden rounded-[24px] bg-white/70 p-10 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_12px_48px_rgba(171,196,255,0.12)] backdrop-blur-2xl transition-all duration-500 hover:shadow-[0_4px_8px_rgba(0,0,0,0.02),0_16px_56px_rgba(171,196,255,0.16)] before:absolute before:inset-0 before:-z-10 before:rounded-[24px] before:border before:border-white/80 before:shadow-[inset_0_1px_1px_rgba(255,255,255,1)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 rounded-2xl bg-red-50/80 p-4 border border-red-100/50 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 ease-out">
                <span className="material-symbols-outlined mt-0.5 text-[18px] text-red-500">error</span>
                <p className="text-[13px] font-medium leading-relaxed text-red-800">{error}</p>
              </div>
            )}

            {/* Input Group */}
            <div className="flex flex-col gap-5">
              
              {/* Email Input */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[13px] font-medium text-slate-700">
                  Email
                </label>
                <div className="relative group/input">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    required
                    autoComplete="email"
                    className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)]"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-[13px] font-medium text-slate-700">
                    Password
                  </label>
                  <Link href="#" className="text-[13px] font-medium text-slate-400 transition-colors hover:text-[#abc4ff]">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group/input">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-[14px] border border-slate-200/80 bg-slate-50/50 px-4 py-3 pr-10 text-[14px] text-slate-900 outline-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] placeholder:text-slate-400 hover:bg-slate-50 focus:border-[#abc4ff] focus:bg-white focus:shadow-[0_0_0_3px_rgba(171,196,255,0.25)] tracking-wide"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 relative flex w-full items-center justify-center gap-2 rounded-[14px] bg-[#0f172a] px-4 py-3.5 text-[14px] font-medium text-white shadow-[0_2px_8px_rgba(15,23,42,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[#1e293b] hover:shadow-[0_4px_12px_rgba(15,23,42,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center">
          <p className="text-[13px] text-slate-500">
            Need access?{' '}
            <Link href="#" className="font-medium text-slate-700 transition-colors hover:text-[#abc4ff]">
              Contact your administrator
            </Link>
          </p>
        </div>
      </main>

    </div>
  );
}
