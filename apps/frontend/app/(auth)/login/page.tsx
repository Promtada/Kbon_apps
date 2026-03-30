'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { STORAGE_KEYS } from '../../../lib/storageKeys';
import { useAuthStore } from '../../../store/useAuthStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const authUser = useAuthStore((state) => state.user);

  // Step 1: Mark as mounted so we know localStorage is safe to access
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Step 2: Only check auth + redirect AFTER the component has mounted on the client
  useEffect(() => {
    if (!isMounted) return;

    // Check with store first, ensuring the user object is valid and has a role (to avoid stale 'Sigma' data false-positives)
    if (isAuthenticated && authUser && 'role' in authUser) {
      const dest = authUser.role === 'ADMIN' ? '/admin/dashboard' : '/account';
      window.location.href = dest;
      return;
    } else if (isAuthenticated && (!authUser || !('role' in authUser))) {
      // Stale or malformed data detected, purge it to prevent redirect loops.
      useAuthStore.getState().logout();
    }

    const savedEmail = localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL);
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
    
    setIsLoading(false);
  }, [isMounted, isAuthenticated, authUser, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        email,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;

      // จัดการระบบ Remember Me
      if (rememberMe) {
        localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, email);
      } else {
        localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
      }

      // 🌟 1. Call login from the exact new useAuthStore
      login(user, accessToken);
      
      const expiryDays = rememberMe ? 30 : 7;
      const cookieOptions = { expires: expiryDays, secure: true, sameSite: 'strict' as const };
      
      Cookies.set('access_token', accessToken, cookieOptions);
      Cookies.set('refresh_token', refreshToken, cookieOptions);

      // 🌟 2. แยกทางไปตาม Role หลัง Login สำเร็จ (hard redirect เพื่อให้ cookie ถูก set ก่อน middleware เช็ค)
      const destination = user.role === 'ADMIN' ? '/admin/dashboard' : '/account';
      window.location.href = destination;

    } catch (err: any) {
      setError(err.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22C55E]"></div>
          <p className="text-sm font-bold text-slate-400 animate-pulse">Checking access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden relative">
      
      {/* --- ฝั่งซ้าย: รูปภาพพร้อมรอยตัดเฉียง --- */}
      <div 
        className="absolute inset-0 hidden lg:block w-[65%] z-0 overflow-hidden shadow-[25px_0_50px_rgba(0,0,0,0.1)]"
        style={{ clipPath: 'polygon(0 0, 100% 0, 65% 100%, 0 100%)' }}
      >
        <img
          className="absolute inset-0 h-full w-full object-cover scale-105 transition-transform duration-[30s] ease-linear hover:scale-115"
          src="https://images.unsplash.com/photo-1558449028-b53a39d100fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Smart Hydroponics Farm"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-green-900/10 to-transparent"></div>
      </div>

      <Link 
        href="/" 
        className="absolute top-8 left-8 z-30 flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-5 py-2.5 rounded-2xl text-white text-sm font-bold shadow-xl hover:bg-white hover:text-[#22C55E] transition-all duration-500"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      <div className="relative flex flex-1 flex-col justify-center items-end px-6 py-12 lg:pr-[8%] xl:pr-[12%] z-10">
        <div className="w-full max-w-[440px] bg-white/80 backdrop-blur-3xl rounded-[3rem] p-10 md:p-14 shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-white/60 animate-in fade-in slide-in-from-right-10 duration-1000">
          
          <div className="mb-10 text-left">
            <p className="text-lg font-semibold text-slate-400">Welcome back,</p>
            <h2 className="text-4xl font-black text-[#22C55E] mt-1 tracking-tighter">Kbon Platform</h2>
            <div className="w-16 h-2 bg-[#22C55E] mt-4 rounded-full shadow-[0_4px_12px_rgba(34,197,94,0.3)]"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Email address</label>
              <input
                type="email"
                required
                placeholder="you@email.com"
                className="block w-full bg-white border-2 border-slate-50 rounded-2xl py-4 px-6 text-slate-900 font-medium placeholder:text-slate-300 focus:border-[#22C55E] focus:ring-8 focus:ring-[#22C55E]/5 transition-all outline-none disabled:opacity-50"
                value={email}
                disabled={isSubmitting}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400">Password</label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs font-bold text-[#22C55E] hover:text-[#16a34a] transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                className="block w-full bg-white border-2 border-slate-50 rounded-2xl py-4 px-6 text-slate-900 font-medium placeholder:text-slate-300 focus:border-[#22C55E] focus:ring-8 focus:ring-[#22C55E]/5 transition-all outline-none disabled:opacity-50"
                value={password}
                disabled={isSubmitting}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center ml-1">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-200 text-[#22C55E] focus:ring-[#22C55E]/20 cursor-pointer shadow-sm"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2.5 block text-xs font-bold text-slate-400 cursor-pointer hover:text-slate-600 transition-colors">
                Remember my email
              </label>
            </div>

            {error && (
              <p className="text-xs text-red-500 font-bold text-center bg-red-50 py-3 rounded-2xl border border-red-100 animate-pulse">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#22C55E] text-white font-black py-5 rounded-2xl shadow-[0_15px_30px_rgba(34,197,94,0.25)] hover:bg-[#1eb054] hover:shadow-none hover:translate-y-0.5 active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-sm disabled:bg-slate-300 disabled:shadow-none disabled:translate-y-0"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-12">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute w-full border-t border-slate-100"></div>
              <span className="relative bg-white/0 px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Social Auth</span>
            </div>

            <button
              type="button"
              onClick={() => alert('Coming soon...')}
              className="flex w-full items-center justify-center gap-4 bg-white border-2 border-slate-50 rounded-2xl py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-100 transition-all duration-300 shadow-sm"
            >
              <svg className="h-5 w-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.64 24.55c0-1.63-.15-3.2-.41-4.72H24v9.02h12.74c-.55 2.87-2.17 5.31-4.61 6.94l7.21 5.59c4.21-3.88 6.64-9.6 6.64-16.14z"/>
                <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.21-5.59c-2.21 1.48-5.03 2.37-8.68 2.37-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Sign in with Google
            </button>

            <p className="mt-12 text-center text-sm font-bold text-slate-300">
              หิ้วกระถางมาใหม่? <Link href="/register" className="text-[#22C55E] hover:text-[#16a34a] underline decoration-2 underline-offset-8 transition-all">สร้างบัญชีที่นี่</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}