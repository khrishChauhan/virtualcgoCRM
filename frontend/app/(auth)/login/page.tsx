'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate login
    setTimeout(() => {
      setIsSubmitting(false);
      window.location.href = '/dashboard';
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen text-on-surface">
      {/* TopNavBar */}
      <header className="flex items-center justify-center w-full px-8 py-6 bg-transparent font-display text-label-sm fixed top-0 z-50">
        <div className="max-w-7xl w-full flex justify-between items-center">
          <div className="text-2xl font-black tracking-tight text-primary dark:text-primary-fixed-dim">VirtualCGO</div>
          <div className="hidden md:flex gap-8">
            {/* Navigation is suppressed for transactional page but brand anchor remains */}
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            <span className="text-primary font-bold">Secure Access</span>
          </div>
        </div>
      </header>
      
      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center px-4 pt-20 pb-12">
        <div className="w-full max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Branding/Identity Element */}
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
              
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-label-sm font-semibold text-on-surface-variant" htmlFor="email">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
                  <input className="w-full pl-11 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary transition-all duration-200 outline-none placeholder:text-outline-variant" id="email" placeholder="name@company.com" required type="email" />
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
                  <input className="w-full pl-11 pr-12 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary-container focus:border-primary transition-all duration-200 outline-none placeholder:text-outline-variant" id="password" placeholder="••••••••" required type={showPassword ? 'text' : 'password'} />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary" onClick={() => setShowPassword(!showPassword)} type="button">
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              
              {/* Sign In Button */}
              <button disabled={isSubmitting} className="w-full py-4 bg-primary-container text-on-primary-container font-bold rounded-lg hover:brightness-95 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm" type="submit">
                {isSubmitting ? (
                  <><span className="material-symbols-outlined animate-spin">refresh</span> Processing...</>
                ) : (
                  <><span>Sign In</span><span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
                )}
              </button>
              
              {/* Divider */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-outline-variant opacity-30"></div>
                <span className="flex-shrink mx-4 text-xs font-medium text-outline uppercase tracking-widest">Or continue with</span>
                <div className="flex-grow border-t border-outline-variant opacity-30"></div>
              </div>
              
              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[20px] text-primary">account_circle</span>
                  <span className="text-label-sm font-semibold">Google</span>
                </button>
                <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[20px] text-[#1877F2]">login</span>
                  <span className="text-label-sm font-semibold">SSO</span>
                </button>
              </div>
            </form>
            
            {/* Signup Link */}
            <p className="mt-10 text-center text-label-sm text-on-surface-variant font-label">
              Don&apos;t have an account? 
              <Link href="#" className="text-primary font-bold hover:underline ml-1">Create an account</Link>
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
        <div className="text-on-surface-variant dark:text-outline-variant order-2 md:order-1">
          © 2024 VirtualCGO. All rights reserved.
        </div>
        <div className="flex gap-6 order-1 md:order-2">
          <Link href="#" className="text-on-surface-variant dark:text-outline-variant hover:text-primary transition-colors duration-200">Privacy Policy</Link>
          <Link href="#" className="text-on-surface-variant dark:text-outline-variant hover:text-primary transition-colors duration-200">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
