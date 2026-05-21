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
        setError(data.message ?? 'Login failed. Please try again.');
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
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f8fafc] text-slate-900 selection:bg-[#abc4ff] selection:text-slate-900">
      
      {/* Subtle Mesh / Radial Background */}
      <div className="pointer-events-none absolute inset-0 z-0 flex justify-center">
        <div className="absolute -top-[20%] w-[800px] h-[600px] rounded-full bg-[#e2eafc] opacity-50 blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[#c1d3fe] opacity-30 blur-[100px]" />
      </div>

      {/* Header (Absolute Top) */}
      <header className="absolute top-0 w-full px-6 py-6 z-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#abc4ff] shadow-sm">
              <span className="material-symbols-outlined text-[14px] text-white">hub</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-800">VirtualCGO</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span className="text-xs font-medium uppercase tracking-wider">Enterprise Access</span>
          </div>
        </div>
      </header>

      {/* Main Login Container */}
      <main className="relative z-10 w-full max-w-[400px] px-4">
        
        {/* Title Area */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">
            Log in to your account
          </h1>
          <p className="text-sm text-slate-500">
            Enter your credentials to access the operations dashboard.
          </p>
        </div>

        {/* The Card */}
        <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/70 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl bg-red-50/50 p-4 border border-red-100">
                <span className="material-symbols-outlined mt-0.5 text-[18px] text-red-500">info</span>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs font-semibold text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="name@company.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:bg-white focus:border-[#abc4ff] focus:bg-white focus:ring-4 focus:ring-[#abc4ff]/20"
              />
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-semibold text-slate-700">
                  Password
                </label>
                <Link href="#" className="text-xs font-medium text-slate-500 hover:text-[#abc4ff] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:bg-white focus:border-[#abc4ff] focus:bg-white focus:ring-4 focus:ring-[#abc4ff]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-slate-800 hover:shadow-md active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <p className="mt-8 text-center text-xs font-medium text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="#" className="text-slate-800 hover:text-[#abc4ff] transition-colors">
            Contact your administrator
          </Link>
        </p>
      </main>

      {/* Global Footer (Absolute Bottom) */}
      <footer className="absolute bottom-6 w-full text-center z-10">
        <p className="text-xs text-slate-400 font-medium">
          Protected by enterprise-grade encryption.
        </p>
      </footer>
    </div>
  );
}
