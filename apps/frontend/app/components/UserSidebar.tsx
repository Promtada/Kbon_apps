'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, MapPin, Settings, LogOut } from 'lucide-react';
import { useCart } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function UserSidebar() {
  const pathname = usePathname();
  const { clearCart } = useCart();

  const links = [
    { name: 'ภาพรวมบัญชี', href: '/account', icon: <LayoutDashboard size={18} /> },
    { name: 'ประวัติการสั่งซื้อ', href: '/account/orders', icon: <Package size={18} /> },
    { name: 'สมุดที่อยู่', href: '/account/addresses', icon: <MapPin size={18} /> },
    { name: 'ตั้งค่าบัญชี', href: '/account/settings', icon: <Settings size={18} /> },
  ];

  const handleLogout = async () => {
    // 1. Clear Zustand stores
    useAuthStore.getState().logout();
    clearCart();

    // 2. Nuke ALL storage
    localStorage.clear();
    sessionStorage.clear();

    // 3. Nuke ALL cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });

    // 4. Hard reload to login (destroys bfcache)
    window.location.href = '/login';
  };

  return (
    <aside className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col">

      {/* Header */}
      <div className="mb-5 px-2">
        <h2 className="text-sm font-black text-slate-800 tracking-tight">บัญชีของฉัน</h2>
        <p className="text-[10px] text-slate-300 font-medium mt-0.5">จัดการข้อมูลและการสั่งซื้อ</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[13px] transition-all duration-150 group ${
                isActive
                  ? 'bg-emerald-50 text-[#22C55E]'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <span
                className={`${
                  isActive ? 'text-[#22C55E]' : 'text-slate-400 group-hover:text-slate-500'
                } transition-colors`}
              >
                {link.icon}
              </span>
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="pt-4 mt-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[13px] text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-150 group"
        >
          <LogOut size={18} className="text-red-300 group-hover:text-red-500 transition-colors" />
          ออกจากระบบ
        </button>
      </div>
    </aside>
  );
}
