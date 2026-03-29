'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // ตรงนี้คือ API ฝั่ง Backend ที่จะทำหน้าที่ส่งเมล
      await axios.post('http://localhost:4000/api/auth/forgot-password', { email });
      setMessage('เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลของคุณเรียบร้อยแล้ว');
    } catch (err: any) {
      setError(err.response?.data?.message || 'ไม่พบอีเมลนี้ในระบบ หรือเกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden relative">
      
      {/* --- ฝั่งซ้าย: รูปภาพพร้อมรอยตัดเฉียง (เซตเดียวกับ Login) --- */}
      <div 
        className="absolute inset-0 hidden lg:block w-[65%] z-0 overflow-hidden shadow-[20px_0_50px_rgba(0,0,0,0.1)]"
        style={{ clipPath: 'polygon(0 0, 100% 0, 65% 100%, 0 100%)' }}
      >
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1558449028-b53a39d100fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Smart Farm"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-green-900/10 to-transparent"></div>
      </div>

      {/* --- ฝั่งขวา: กล่องกรอกเมลรีเซ็ต --- */}
      <div className="relative flex flex-1 flex-col justify-center items-end px-6 py-12 lg:pr-[8%] xl:pr-[12%] z-10">
        
        <div className="w-full max-w-[440px] bg-white/80 backdrop-blur-3xl rounded-[3rem] p-12 shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-white/60 animate-in zoom-in-95 duration-700 text-center">
          
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-[#22C55E]">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            </div>
          </div>

          <h2 className="text-3xl font-black text-slate-900 tracking-tight">ลืมรหัสผ่าน?</h2>
          <p className="text-slate-400 mt-4 text-sm font-medium leading-relaxed">
            กรุณากรอกอีเมลที่ใช้สมัครสมาชิก <br/> เพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่ครับ
          </p>

          {message ? (
            <div className="mt-8 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-sm font-bold animate-in fade-in transition-all">
              {message}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              <div className="text-left">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@gmail.com"
                  className="block w-full bg-white border-2 border-slate-50 rounded-2xl py-4.5 px-6 text-slate-900 font-medium placeholder:text-slate-300 focus:border-[#22C55E] focus:ring-8 focus:ring-[#22C55E]/5 transition-all outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#22C55E] text-white font-black py-5 rounded-2xl shadow-[0_15px_30px_rgba(34,197,94,0.25)] hover:bg-[#1eb054] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-sm"
              >
                {loading ? 'Sending...' : 'ส่งลิงก์รีเซ็ต'}
              </button>
            </form>
          )}

          <div className="mt-10">
            <Link href="/login" className="text-sm font-bold text-slate-400 hover:text-[#22C55E] transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}