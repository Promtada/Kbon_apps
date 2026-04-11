'use client';

import React, { useState, Suspense } from 'react';
import api from '../../../lib/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ดึง token จาก URL (เช่น ?token=xyz...)
  const token = searchParams.get('token');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!token) {
      return setError('Token ไม่ถูกต้องหรือไม่พบ Token ในลิงก์');
    }

    if (password !== confirmPassword) {
      return setError('รหัสผ่านไม่ตรงกัน');
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword: password,
      });

      setMessage('เปลี่ยนรหัสผ่านสำเร็จแล้ว! กำลังพากลับไปหน้าเข้าสู่ระบบ...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] bg-white/80 backdrop-blur-3xl rounded-[3rem] p-12 shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-white/60 z-10 text-center animate-in zoom-in-95 duration-700">
      
      <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-3xl flex items-center justify-center text-[#22C55E]">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
          </div>
      </div>

      <h2 className="text-3xl font-black text-slate-900 tracking-tight">ตั้งรหัสผ่านใหม่</h2>
      <p className="text-slate-400 mt-4 text-sm font-medium">
        กรุณากำหนดรหัสผ่านใหม่ที่ปลอดภัย <br/> สำหรับบัญชี Kbon ของคุณ
      </p>

      {message ? (
        <div className="mt-8 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-sm font-bold animate-in fade-in">
          {message}
        </div>
      ) : (
        <form onSubmit={handleReset} className="mt-10 space-y-5">
          <div className="text-left">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">New Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="block w-full bg-white border-2 border-slate-50 rounded-2xl py-4 px-6 text-slate-900 font-medium placeholder:text-slate-300 focus:border-[#22C55E] focus:ring-8 focus:ring-[#22C55E]/5 transition-all outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="text-left">
            <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Confirm Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="block w-full bg-white border-2 border-slate-50 rounded-2xl py-4 px-6 text-slate-900 font-medium placeholder:text-slate-300 focus:border-[#22C55E] focus:ring-8 focus:ring-[#22C55E]/5 transition-all outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full bg-[#22C55E] text-white font-black py-4.5 rounded-2xl shadow-[0_15px_30px_rgba(34,197,94,0.25)] hover:bg-[#1eb054] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-sm"
          >
            {loading ? 'Updating...' : 'เปลี่ยนรหัสผ่าน'}
          </button>
        </form>
      )}
    </div>
  );
}

// Next.js 13+ ต้องการ Suspense เมื่อใช้ useSearchParams ใน Client Component
export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] font-sans relative overflow-hidden p-6">
      <img 
        src="https://images.unsplash.com/photo-1558449028-b53a39d100fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
        className="absolute inset-0 h-full w-full object-cover blur-[8px] opacity-40"
        alt="Background"
      />
      <Suspense fallback={<div className="z-10 text-[#22C55E] font-bold">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}