'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, Menu, ShoppingCart, User, X, Truck } from 'lucide-react';
import { useCart } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { API_BASE } from '../../lib/axios';

interface NavbarUser {
  name: string;
  role: string;
  image?: string | null;
}

export default function Navbar({ user }: { user?: NavbarUser | null }) {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const [adminAvatar, setAdminAvatar] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const authUser = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Scroll detection for navbar shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const activeUser = (isAuthenticated ? authUser : user) as NavbarUser | null;

  useEffect(() => {
    const fetchAvatar = () => {
      if (activeUser?.role === 'ADMIN') {
        fetch(`${API_BASE}/settings`)
          .then((res) => res.json())
          .then((data) => {
            if (data.adminAvatarUrl) setAdminAvatar(data.adminAvatarUrl);
          })
          .catch((err) => console.error('Failed to fetch global settings for avatar', err));
      }
    };

    fetchAvatar();

    const handleUpdate = () => fetchAvatar();
    window.addEventListener('kbon-settings-updated', handleUpdate);
    
    return () => window.removeEventListener('kbon-settings-updated', handleUpdate);
  }, [activeUser]);

  const initials = activeUser?.name
    ? activeUser.name.split(' ').map((part) => part[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  const navLinks = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'สินค้าทั้งหมด', href: '/products' },
    { name: 'บทความ', href: '/blog' },
    { name: 'เกี่ยวกับเรา', href: '/about' },
    { name: 'ติดต่อเรา', href: '/contact' },
  ];

  const profilePath = activeUser?.role === 'ADMIN' ? '/admin/dashboard' : '/account';
  const primaryCta = activeUser
    ? { href: '/products', label: 'เลือกสินค้า' }
    : { href: '/register', label: 'เริ่มใช้งาน' };

  const isLinkActive = (href: string) => (href === '/' ? pathname === href : pathname?.startsWith(href));

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ---- Announcement Bar ---- */}
      <div className="announcement-bar">
        <div className="flex items-center justify-center gap-2">
          <Truck size={14} />
          <span>จัดส่งฟรีทั่วประเทศ · Free Shipping Nationwide</span>
        </div>
      </div>

      {/* ---- Main Navbar ---- */}
      <div
        className={`border-b bg-white transition-shadow duration-300 ${
          scrolled ? 'shadow-[0_2px_16px_rgba(0,0,0,0.06)]' : 'border-slate-100'
        }`}
      >
        <div className="page-shell flex h-[72px] items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22C55E] text-white shadow-[0_8px_20px_rgba(34,197,94,0.25)]">
              <span className="font-display text-sm font-extrabold">KB</span>
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight text-slate-900">
              Kbon
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-bold transition-colors duration-200 ${
                  isLinkActive(link.href)
                    ? 'text-[#22C55E]'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <button
              onClick={openCart}
              id="navbar-cart-btn"
              aria-label={`ตะกร้าสินค้า${totalItems > 0 ? ` (${totalItems} ชิ้น)` : ''}`}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-all duration-200 hover:border-[#22C55E] hover:text-[#22C55E]"
            >
              <ShoppingCart size={18} strokeWidth={2.2} />
              {totalItems > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#22C55E] px-1 text-[10px] font-bold text-white">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Profile / Login */}
            <div className="hidden md:flex">
              {activeUser ? (
                <Link
                  href={profilePath}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-3 py-2 transition-all duration-200 hover:border-emerald-200 hover:shadow-sm"
                >
                  {(activeUser.image || adminAvatar) ? (
                    <img
                      src={adminAvatar || activeUser.image!}
                      alt={activeUser.name}
                      className="h-8 w-8 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-xs font-bold text-emerald-700">
                      {initials}
                    </div>
                  )}
                  <div className="hidden text-left sm:block">
                    <p className="text-sm font-bold text-slate-800">{activeUser.name}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{activeUser.role}</p>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition-all duration-200 hover:border-emerald-300 hover:text-emerald-700"
                >
                  เข้าสู่ระบบ
                </Link>
              )}
            </div>

            {/* CTA */}
            <Link
              href={primaryCta.href}
              className="hidden items-center gap-2 rounded-xl bg-[#22C55E] px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(34,197,94,0.25)] transition-all duration-200 hover:bg-[#16A34A] hover:shadow-[0_12px_28px_rgba(34,197,94,0.3)] md:inline-flex"
            >
              {primaryCta.label}
              <ArrowRight size={16} />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-all hover:border-[#22C55E] hover:text-[#22C55E] lg:hidden"
              aria-label={isMenuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ---- Mobile Overlay ---- */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* ---- Mobile Menu Panel ---- */}
      <div
        className={`fixed inset-x-4 top-[130px] z-50 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.12)] transition-all duration-300 lg:hidden ${
          isMenuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'
        }`}
      >
        <div className="space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
                isLinkActive(link.href)
                  ? 'bg-emerald-50 text-[#22C55E]'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
              <ArrowRight size={14} className="text-slate-300" />
            </Link>
          ))}
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          {activeUser ? (
            <Link
              href={profilePath}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3"
            >
              {(activeUser.image || adminAvatar) ? (
                <img
                  src={adminAvatar || activeUser.image!}
                  alt={activeUser.name}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-sm font-bold text-emerald-700">
                  {initials}
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-slate-800">{activeUser.name}</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">{activeUser.role}</p>
              </div>
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600"
            >
              <User size={16} />
              เข้าสู่ระบบ
            </Link>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              openCart();
              setIsMenuOpen(false);
            }}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600"
          >
            <ShoppingCart size={16} />
            เปิดตะกร้า
          </button>
          <Link
            href={primaryCta.href}
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#22C55E] px-4 py-3 text-sm font-extrabold text-white"
          >
            {primaryCta.label}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}
