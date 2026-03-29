'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('รหัสผ่านไม่ตรงกัน');
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:4000/api/auth/register', {
        name,
        email,
        password,
      });
      alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans overflow-hidden relative">
      
      {/* --- ฝั่งซ้าย: รูปภาพพร้อมรอยตัดเฉียงขวายาวทั้งหน้า --- */}
      <div 
        className="absolute inset-0 hidden lg:block w-[65%] z-0 overflow-hidden shadow-[20px_0_50px_rgba(0,0,0,0.1)]"
        style={{ clipPath: 'polygon(0 0, 100% 0, 65% 100%, 0 100%)' }}
      >
        <img
          className="absolute inset-0 h-full w-full object-cover scale-105"
          src="https://images.unsplash.com/photo-1558449028-b53a39d100fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
          alt="Smart Farm"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-green-900/10 to-transparent"></div>
      </div>

      {/* ปุ่ม Back to Home */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 z-30 flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-5 py-2.5 rounded-2xl text-white text-sm font-bold shadow-xl hover:bg-white hover:text-[#22C55E] transition-all duration-500"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      {/* --- ฝั่งขวา: ฟอร์มสมัครสมาชิก (Glassmorphism Box) --- */}
      <div className="relative flex flex-1 flex-col justify-center items-end px-6 py-12 lg:pr-[8%] xl:pr-[12%] z-10">
        
        <div className="w-full max-w-[460px] bg-white/80 backdrop-blur-3xl rounded-[3rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-white/60 animate-in fade-in slide-in-from-right-10 duration-1000">
          
          <div className="mb-8 text-left">
            <p className="text-lg font-semibold text-slate-400">Join us today,</p>
            <h2 className="text-4xl font-black text-[#22C55E] mt-1 tracking-tighter">Create Account</h2>
            <div className="w-16 h-2 bg-[#22C55E] mt-4 rounded-full shadow-[0_4px_12px_rgba(34,197,94,0.3)]"></div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="ชื่อ-นามสกุล"
                className="block w-full bg-white border-2 border-slate-50 rounded-2xl py-3.5 px-6 text-slate-900 font-medium placeholder:text-slate-300 focus:border-[#22C55E] focus:ring-8 focus:ring-[#22C55E]/5 transition-all outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@gmail.com"
                className="block w-full bg-white border-2 border-slate-50 rounded-2xl py-3.5 px-6 text-slate-900 font-medium placeholder:text-slate-300 focus:border-[#22C55E] focus:ring-8 focus:ring-[#22C55E]/5 transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="รหัสผ่าน"
                  className="block w-full bg-white border-2 border-slate-50 rounded-2xl py-3.5 px-6 text-slate-900 font-medium placeholder:text-slate-300 focus:border-[#22C55E] focus:ring-8 focus:ring-[#22C55E]/5 transition-all outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">Confirm</label>
                <input
                  type="password"
                  required
                  placeholder="ยืนยันรหัสผ่าน"
                  className="block w-full bg-white border-2 border-slate-50 rounded-2xl py-3.5 px-6 text-slate-900 font-medium placeholder:text-slate-300 focus:border-[#22C55E] focus:ring-8 focus:ring-[#22C55E]/5 transition-all outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-500 font-bold text-center bg-red-50 py-3 rounded-xl border border-red-100">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#22C55E] text-white font-black py-4.5 rounded-2xl shadow-[0_15px_30px_rgba(34,197,94,0.25)] hover:bg-[#1eb054] hover:shadow-none hover:translate-y-0.5 active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-sm mt-2"
            >
              {loading ? 'Creating...' : 'สมัครสมาชิก'}
            </button>
          </form>

          {/* Social Auth Section */}
          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute w-full border-t border-slate-100"></div>
              <span className="relative bg-white/0 px-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">Or register with</span>
            </div>

            {/* ปุ่ม Google แบบเต็มความกว้างพร้อม Inline SVG */}
            <button
              onClick={() => alert('Coming soon...')}
              className="flex w-full items-center justify-center gap-4 bg-white border-2 border-slate-50 rounded-2xl py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-100 transition-all duration-300 shadow-sm active:scale-[0.98]"
            >
              <svg className="h-5 w-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.64 24.55c0-1.63-.15-3.2-.41-4.72H24v9.02h12.74c-.55 2.87-2.17 5.31-4.61 6.94l7.21 5.59c4.21-3.88 6.64-9.6 6.64-16.14z"/>
                <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.21-5.59c-2.21 1.48-5.03 2.37-8.68 2.37-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

          <p className="mt-10 text-center text-sm font-bold text-slate-300">
            มีบัญชีอยู่แล้ว? <Link href="/login" className="text-[#22C55E] hover:text-[#16a34a] font-black">เข้าสู่ระบบ</Link>
          </p>
        </div>
      </div>
    </div>
  );
}