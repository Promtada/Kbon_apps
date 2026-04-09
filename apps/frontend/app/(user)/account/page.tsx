'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../../store/useAuthStore';
import { Settings, ShieldCheck, Mail, Phone, ExternalLink } from 'lucide-react';

export default function AccountPage() {
  const user = useAuthStore((s: any) => s.user);

  // Initials for avatar
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <div className="max-w-4xl space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-50 to-emerald-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 relative z-10">
          {/* Avatar */}
          <div className="relative group shrink-0">
             <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center text-white font-black text-4xl shadow-lg shadow-emerald-200/50">
               {initials}
             </div>
             <div className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-400 rounded-full border-[3px] border-white flex items-center justify-center shadow-sm">
                <ShieldCheck size={16} className="text-white" />
             </div>
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0 flex flex-col justify-center">
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {user?.name || 'Guest User'}
              </h1>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-black uppercase tracking-widest rounded-full border border-emerald-100/50 shadow-sm">
                {user?.role || 'USER'}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-[13px] font-medium text-slate-500 mb-8 justify-center sm:justify-start">
              <span className="flex items-center justify-center sm:justify-start gap-2">
                <Mail size={15} className="text-slate-400" />
                {user?.email || '-'}
              </span>
              <span className="hidden sm:inline text-slate-200">|</span>
              <span className="flex items-center justify-center sm:justify-start gap-2">
                <Phone size={15} className="text-slate-400" />
                {user?.phone || 'ยังไม่ได้ระบุเบอร์โทรศัพท์'}
              </span>
            </div>

            <div className="flex items-center justify-center sm:justify-start">
              <Link href="/account/settings">
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold text-[13px] rounded-xl hover:bg-slate-800 hover:shadow-md active:scale-[0.98] transition-all duration-200">
                  <Settings size={16} />
                  แก้ไขข้อมูลส่วนตัว
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Stats / Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
         <Link href="/account/orders" className="block group">
           <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex items-center justify-between hover:border-emerald-200 transition-all cursor-pointer">
              <div>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">ประวัติการสั่งซื้อ</p>
                 <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-500 transition-colors">ดูคำสั่งซื้อของคุณทั้งหมด</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                 <ExternalLink size={18} className="text-slate-400 group-hover:text-emerald-500" />
              </div>
           </div>
         </Link>

         <Link href="/account/addresses" className="block group">
           <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex items-center justify-between hover:border-emerald-200 transition-all cursor-pointer">
              <div>
                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">สมุดที่อยู่</p>
                 <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-500 transition-colors">จัดการที่อยู่จัดส่งของคุณ</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center transition-colors">
                 <ExternalLink size={18} className="text-slate-400 group-hover:text-emerald-500" />
              </div>
           </div>
         </Link>
      </div>
    </div>
  );
}
