'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '../../store/useCartStore';

export default function Navbar({ user }: { user?: any }) {
  const pathname = usePathname();
  const { totalItems, clearCart } = useCart();
  const [adminAvatar, setAdminAvatar] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetch('http://localhost:4000/api/settings')
        .then((res) => res.json())
        .then((data) => {
          if (data.admin_avatar_url) setAdminAvatar(data.admin_avatar_url);
        })
        .catch((err) => console.error('Failed to fetch global settings for avatar', err));
    }
  }, [user]);

  const initials = user?.name
    ? user.name.split(' ').map((n: any) => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  const navLinks = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'สินค้าทั้งหมด', href: '/products' },
    { name: 'เกี่ยวกับเรา', href: '/about' },
    { name: 'ติดต่อเรา', href: '/contact' },
  ];

  const profilePath = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';

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
          {user ? (
            <div className="relative group">
              <div className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 cursor-pointer">
                {(user.image || adminAvatar) ? (
                  <img src={adminAvatar || user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 bg-emerald-50 rounded-full flex items-center justify-center text-[#22C55E] font-black text-xs border border-emerald-100">
                    {initials}
                  </div>
                )}
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-black text-slate-800 leading-none">{user.name}</p>
                  <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{user.role}</p>
                </div>
              </div>

              {/* Enhanced Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                <Link href={profilePath} className="block px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#22C55E] hover:bg-emerald-50 mx-2 rounded-lg">
                  ไปที่แดชบอร์ด
                </Link>
                <div className="border-t border-slate-100 my-1 mx-2"></div>
                <button
                  onClick={() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('admin-token');
                    clearCart();
                    window.location.reload();
                  }}
                  className="w-[calc(100%-1rem)] mx-2 text-left flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut size={16} />
                  ออกจากระบบ
                </button>
              </div>
            </div>
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