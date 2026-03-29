'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User } from 'lucide-react'; 

export default function Navbar({ user }: { user?: any }) {
  const pathname = usePathname();

  // สร้าง Initials จากชื่อ User เพื่อทำเป็น Avatar (เช่น "Kbon Admin" -> "KA")
  const initials = user?.name 
    ? user.name.split(' ').map((n: any) => n[0]).join('').substring(0, 2).toUpperCase() 
    : '?';

  // 🌟 เพิ่มลิงก์เมนูตรงกลาง (เหมือนรูป Sigma)
  const navLinks = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'สินค้าทั้งหมด', href: '/products' },
    { name: 'เกี่ยวกับเรา', href: '/about' },
    { name: 'ติดต่อเรา', href: '/contact' },
  ];

  // 🌟 กำหนดหน้าที่จะเด้งไปเมื่อคลิกที่โปรไฟล์ (แยกตาม Role)
  const profilePath = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* --- 1. ด้านซ้าย: โลโก้ --- */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#22C55E] rounded-xl flex items-center justify-center text-white font-black text-xs">
             K
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tighter">
            Kbon <span className="text-[#22C55E]">Platform</span>
          </h1>
        </Link>

        {/* --- 2. ตรงกลาง: เมนูนำทาง (ซ่อนเมื่อจอเล็ก) --- */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-sm font-bold transition-colors ${
                pathname === link.href ? 'text-[#22C55E]' : 'text-slate-500 hover:text-[#22C55E]'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* --- 3. ด้านขวา: ไอคอนตะกร้า และ โปรไฟล์ --- */}
        <div className="flex items-center gap-6">
          
          {/* ตะกร้าสินค้า (ใส่เลข 2 จำลองไว้ก่อน) */}
          <Link href="/cart" className="relative text-slate-600 hover:text-[#22C55E] transition-colors">
            <ShoppingCart size={24} strokeWidth={2.5} />
            <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border border-white">
              2
            </span>
          </Link>

          {/* โปรไฟล์: ไม่มี Dropdown แล้ว! คลิกแล้วไปหน้า Dashboard เลย */}
          {user ? (
            <Link 
              href={profilePath}
              className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 cursor-pointer"
            >
              {/* รูป Avatar */}
              {user.image ? (
                 <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                 <div className="w-9 h-9 bg-emerald-50 rounded-full flex items-center justify-center text-[#22C55E] font-black text-xs border border-emerald-100">
                    {initials}
                 </div>
              )}
              
              {/* ชื่อและ Role (ซ่อนในมือถือ) */}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-black text-slate-800 leading-none">{user.name}</p>
                <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{user.role}</p>
              </div>
            </Link>
          ) : (
            // กรณีที่ยังไม่ได้ Login (แสดงไอคอนคนเปล่าๆ)
            <Link href="/login" className="flex items-center justify-center w-10 h-10 bg-slate-50 rounded-full text-slate-400 hover:text-[#22C55E] hover:bg-emerald-50 transition-all">
              <User size={20} strokeWidth={2.5} />
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}