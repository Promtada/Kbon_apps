'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../../store/useAuthStore';
import {
  Package,
  MapPin,
  Settings,
  ShoppingBag,
  TrendingUp,
  ChevronRight,
  Leaf,
  Droplets,
} from 'lucide-react';

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  const quickStats = [
    {
      label: 'ออเดอร์ทั้งหมด',
      value: '—',
      sub: 'รอดูข้อมูลจริง',
      icon: <ShoppingBag size={20} />,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'ที่อยู่บันทึกไว้',
      value: '—',
      sub: 'รอดูข้อมูลจริง',
      icon: <MapPin size={20} />,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      label: 'สถานะสมาชิก',
      value: 'Active',
      sub: 'บัญชีพร้อมใช้งาน',
      icon: <TrendingUp size={20} />,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
  ];

  const menuCards = [
    {
      label: 'ประวัติการสั่งซื้อ',
      desc: 'ดูออเดอร์ทั้งหมด ติดตามสถานะ และดาวน์โหลดใบเสร็จ',
      href: '/account/orders',
      icon: <Package size={24} />,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      hoverBorder: 'hover:border-blue-200',
    },
    {
      label: 'สมุดที่อยู่จัดส่ง',
      desc: 'จัดการที่อยู่สำหรับจัดส่งสินค้า เพิ่มหรือแก้ไขที่อยู่',
      href: '/account/addresses',
      icon: <MapPin size={24} />,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      hoverBorder: 'hover:border-amber-200',
    },
    {
      label: 'ตั้งค่าบัญชี',
      desc: 'แก้ไขข้อมูลส่วนตัว เปลี่ยนรหัสผ่าน และการแจ้งเตือน',
      href: '/account/settings',
      icon: <Settings size={24} />,
      color: 'text-violet-500',
      bg: 'bg-violet-50',
      border: 'border-violet-100',
      hoverBorder: 'hover:border-violet-200',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* ─── Profile Header ─── */}
      <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-4 right-8"><Leaf size={120} className="text-emerald-500" /></div>
          <div className="absolute bottom-4 right-48"><Droplets size={80} className="text-emerald-500" /></div>
        </div>

        <div className="relative p-8 md:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-200/50">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-[3px] border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>

            {/* User info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  {user?.name || 'Guest User'}
                </h1>
                <span className="px-3 py-1 bg-emerald-50 text-[#22C55E] text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 shadow-sm">
                  {user?.role || 'USER'}
                </span>
              </div>
              <p className="text-sm text-slate-400 font-medium mt-1.5">{user?.email || 'ไม่มีอีเมล'}</p>
              <p className="text-xs text-slate-300 font-medium mt-1">
                🌱 สมาชิก Kbon Platform
              </p>
            </div>

            {/* Edit profile shortcut */}
            <Link
              href="/account/settings"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-700 transition-all"
            >
              <Settings size={14} />
              แก้ไขโปรไฟล์
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Quick Stats ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickStats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-white rounded-2xl border ${stat.border} p-5 flex items-center gap-4 shadow-sm`}
          >
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
              <p className="text-xs text-slate-400 font-bold mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Section Label ─── */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-black text-slate-800 tracking-tight">จัดการบัญชี</h2>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      {/* ─── Menu Cards ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {menuCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={`group bg-white rounded-2xl border ${card.border} ${card.hoverBorder} shadow-sm hover:shadow-md p-6 transition-all duration-200`}
          >
            <div className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center ${card.color} mb-4 group-hover:scale-110 transition-transform duration-200`}>
              {card.icon}
            </div>
            <h3 className="text-sm font-black text-slate-800 group-hover:text-[#22C55E] transition-colors">
              {card.label}
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-1.5 leading-relaxed">
              {card.desc}
            </p>
            <div className="flex items-center gap-1 mt-4 text-xs font-bold text-slate-300 group-hover:text-[#22C55E] transition-colors">
              ดูรายละเอียด
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* ─── Kbon Branding Footer ─── */}
      <div className="text-center py-4">
        <p className="text-[10px] font-bold text-slate-200 uppercase tracking-[0.3em]">
          Kbon Platform — Smart Hydroponics for Everyone
        </p>
      </div>
    </div>
  );
}
