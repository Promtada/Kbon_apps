'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function Navbar({ user }: { user?: any }) {
  const pathname = usePathname();
  const { totalItems, clearCart } = useCart();
  const [adminAvatar, setAdminAvatar] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const authUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use the prop if passed (SSR fallback), otherwise rely on the persistent Zustand store
  const activeUser = isMounted ? (isAuthenticated ? authUser : null) : user;

  useEffect(() => {
    if (activeUser?.role === 'ADMIN') {
      fetch('http://localhost:4000/api/settings')
        .then((res) => res.json())
        .then((data) => {
          if (data.admin_avatar_url) setAdminAvatar(data.admin_avatar_url);
        })
        .catch((err) => console.error('Failed to fetch global settings for avatar', err));
    }
  }, [activeUser]);

  const initials = activeUser?.name
    ? activeUser.name.split(' ').map((n: any) => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  const navLinks = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'สินค้าทั้งหมด', href: '/products' },
    { name: 'เกี่ยวกับเรา', href: '/about' },
    { name: 'ติดต่อเรา', href: '/contact' },
  ];

  const profilePath = activeUser?.role === 'ADMIN' ? '/admin/dashboard' : '/account';

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#22C55E] rounded-xl flex items-center justify-center text-white font-black text-xs">
            K
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tighter">
            Kbon <span className="text-[#22C55E]">Platform</span>
          </h1>
        </Link>

        {/* Center nav */}
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

        {/* Right side */}
        <div className="flex items-center gap-6">

          {/* Cart icon → navigates to /cart */}
          <Link
            href="/cart"
            id="navbar-cart-link"
            aria-label={`ตะกร้าสินค้า${totalItems > 0 ? ` (${totalItems} ชิ้น)` : ''}`}
            className="relative text-slate-600 hover:text-[#22C55E] transition-colors"
          >
            <ShoppingCart size={24} strokeWidth={2.5} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white px-0.5 tabular-nums">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          {/* Profile */}
          {activeUser ? (
            <Link
              href={profilePath}
              className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 cursor-pointer"
            >
              {(activeUser.image || adminAvatar) ? (
                <img src={adminAvatar || activeUser.image} alt={activeUser.name} className="w-9 h-9 rounded-full object-cover" />
              ) : (
                <div className="w-9 h-9 bg-emerald-50 rounded-full flex items-center justify-center text-[#22C55E] font-black text-xs border border-emerald-100">
                  {initials}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-black text-slate-800 leading-none">{activeUser.name}</p>
                <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{activeUser.role}</p>
              </div>
            </Link>
          ) : (
            <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-[#22C55E] text-white rounded-xl font-bold hover:bg-[#1eb054] hover:shadow-lg hover:shadow-green-200 transition-all text-sm">
              <User size={16} strokeWidth={2.5} />
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}