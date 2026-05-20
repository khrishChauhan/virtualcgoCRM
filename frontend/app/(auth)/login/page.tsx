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
        // credentials: 'same-origin' is default — cookie will be set automatically
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message ?? 'Login failed. Please try again.');
        return;
      }

      // Cookie is set by the server (HttpOnly) — just redirect
      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-on-surface">
      {/* TopNavBar */}
      <header className="flex items-center justify-center w-full px-8 py-6 bg-transparent font-display text-label-sm fixed top-0 z-50">
        <div className="max-w-7xl w-full flex justify-between items-center">
          <div className="text-2xl font-black tracking-tight text-primary">VirtualCGO</div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            <span className="text-primary font-bold">Secure Access</span>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center px-4 pt-20 pb-12">
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">

          {/* Branding / Identity */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-container text-on-primary-container mb-6 shadow-sm">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
            </div>
            <h1 className="font-headline text-3xl font-extrabold text-on-primary-fixed mb-2">Welcome Back</h1>
            <p className="text-on-surface-variant font-label">Enter your credentials to access your dashboard</p>
          </div>

          {/* Login Card */}
          <div className="glass-card p-8 md:p-10 rounded-xl shadow-[0_20px_50px_rgba(69,94,146,0.08)] border border-surface-container">
            <form className="space-y-6" onSubmit={handleSubmit}>

              {/* Error Alert */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-error-container rounded-lg border border-error/20">
                  <span className="material-symbols-outlined text-error text-[20px] flex-shrink-0 mt-0.5">error</span>
                  <p className="text-sm font-medium text-on-error-container">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-label-sm font-semibold text-on-surface-variant" htmlFor="email">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                  <input
                    className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary transition-all duration-200 outline-none placeholder:text-outline-variant"
                    id="email"
                    name="email"
                    placeholder="name@company.com"
                    required
                    type="email"
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-label-sm font-semibold text-on-surface-variant" htmlFor="password">Password</label>
                  <Link href="#" className="text-label-sm font-bold text-primary hover:text-on-primary-container transition-colors">Forgot Password?</Link>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
                  <input
                    className="w-full pl-11 pr-12 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary transition-all duration-200 outline-none placeholder:text-outline-variant"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                disabled={isSubmitting}
                className="w-full py-4 bg-primary-container text-on-primary-container font-bold rounded-lg hover:brightness-95 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                id="login-submit-btn"
              >
                {isSubmitting ? (
                  <><span className="material-symbols-outlined animate-spin">refresh</span>Signing in...</>
                ) : (
                  <><span>Sign In</span><span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
                )}
              </button>
            </form>

            {/* Signup Link */}
            <p className="mt-10 text-center text-label-sm text-on-surface-variant font-label">
              Don&apos;t have an account?{' '}
              <Link href="#" className="text-primary font-bold hover:underline ml-1">Contact your admin</Link>
            </p>
          </div>

          {/* Trust Badge */}
          <div className="mt-12 flex flex-col items-center gap-4 text-outline text-label-sm opacity-60">
            <p className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">lock_person</span>
              AES-256 Enterprise Grade Encryption
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row items-center justify-center gap-6 w-full py-10 px-4 bg-transparent font-label text-label-sm">
        <div className="text-on-surface-variant order-2 md:order-1">
          © 2024 VirtualCGO. All rights reserved.
        </div>
        <div className="flex gap-6 order-1 md:order-2">
          <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-200">Privacy Policy</Link>
          <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors duration-200">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
