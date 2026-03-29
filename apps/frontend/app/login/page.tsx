'use client'; // บรรทัดนี้ห้ามหาย! เป็นตัวบอกว่าเป็นหน้าบ้าน

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
// 🌟 1. เพิ่มการนำเข้า js-cookie เข้ามา
import Cookies from 'js-cookie'; 

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        email,
        password,
      });

      // เก็บลง LocalStorage เหมือนเดิม (เพื่อให้ Navbar ฝั่ง Client ใช้งาน)
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // 🌟 2. หย่อน Token ลงใน Cookie เพื่อให้ Middleware (ด่านตรวจคนเข้าเมือง) มองเห็น
      Cookies.set('access_token', response.data.access_token, { expires: 7 }); // หมดอายุใน 7 วัน

      // ปิด alert ไว้เพื่อความสมูทในการเปลี่ยนหน้า
      // alert('เข้าสู่ระบบสำเร็จ! 🎉'); 
      router.push('/dashboard'); 
    } catch (err: any) {
      setError(err.response?.data?.message || 'อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-xl">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Kbon Platform</h2>
        {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 transition-colors">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}