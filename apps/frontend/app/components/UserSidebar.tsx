'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, MapPin, Settings, LogOut } from 'lucide-react';
import { useCart } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearCart } = useCart();

  const links = [
    { name: 'ภาพรวมฟาร์ม', href: '/account', icon: <LayoutDashboard size={20} /> },
    { name: 'ประวัติการสั่งซื้อ', href: '/account/orders', icon: <Package size={20} /> },
    { name: 'สมุดที่อยู่', href: '/account/addresses', icon: <MapPin size={20} /> },
    { name: 'ตั้งค่าบัญชี', href: '/account/settings', icon: <Settings size={20} /> },
  ];

  const handleLogout = async () => {
    // 1. Clear Zustand stores
    useAuthStore.getState().logout();
    clearCart();

    // 2. Nuke ALL storage
    localStorage.clear();
    sessionStorage.clear();

    // 3. Nuke ALL cookies as a failsafe
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });

    // 4. FORCE HARD RELOAD to login (destroys bfcache — no zombie sessions)
    window.location.href = '/login';
  };

  return (
    <aside className="w-full h-full bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 flex flex-col min-h-[500px]">
      <div className="mb-8 px-4">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">เมนูส่วนตัว</h2>
        <p className="text-xs text-slate-400 font-medium mt-1">จัดการข้อมูลบัญชีและการสั่งซื้อ</p>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all duration-200 group ${
                isActive
                  ? 'bg-emerald-50 text-[#22C55E] shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <div
                className={`${
                  isActive ? 'text-[#22C55E]' : 'text-slate-400 group-hover:text-slate-600'
                } transition-colors`}
              >
                {link.icon}
              </div>
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 mt-6 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 group"
        >
          <div className="text-slate-400 group-hover:text-red-500 transition-colors">
            <LogOut size={20} />
          </div>
          ออกจากระบบ
        </button>
      </div>
    </aside>
  );
}
