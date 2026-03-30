'use client';

import React, { useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { Save, User, Mail, Phone, Calendar } from 'lucide-react';

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);

  // Split name into first/last for the form
  const nameParts = (user?.name || '').split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] || '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  return (
    <div className="space-y-6">

      {/* ─── Profile Header Card ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-[72px] h-[72px] bg-gradient-to-br from-emerald-400 to-green-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-emerald-200/40">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-[3px] border-white" />
          </div>

          {/* User info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black text-slate-900 tracking-tight truncate">
              {user?.name || 'Guest User'}
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-0.5 truncate">{user?.email || ''}</p>
          </div>

          {/* Role badge */}
          <span className="px-4 py-1.5 bg-emerald-50 text-[#22C55E] text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
            {user?.role || 'USER'}
          </span>
        </div>
      </div>

      {/* ─── Personal Info Form Card ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">

        {/* Section title with green accent border */}
        <h2 className="text-xl font-bold text-slate-800 border-l-4 border-emerald-500 pl-3 mb-8">
          ข้อมูลส่วนตัว
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* First Name */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <User size={13} className="text-slate-400" />
              ชื่อจริง
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="กรอกชื่อจริง"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <User size={13} className="text-slate-400" />
              นามสกุล
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="กรอกนามสกุล"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
            />
          </div>

          {/* Email (disabled) */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Mail size={13} className="text-slate-400" />
              อีเมล
            </label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-3 bg-slate-100/60 border border-slate-100 rounded-xl text-sm font-medium text-slate-400 cursor-not-allowed outline-none"
            />
            <p className="text-[10px] text-slate-300 font-medium mt-1.5 ml-1">
              ไม่สามารถเปลี่ยนอีเมลได้
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Phone size={13} className="text-slate-400" />
              เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0xx-xxx-xxxx"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
            />
          </div>

          {/* Date of Birth — full width */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Calendar size={13} className="text-slate-400" />
              วันเกิด
            </label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full md:w-1/2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-slate-50">
          <button
            type="button"
            onClick={() => alert('บันทึกสำเร็จ! (Mock)')}
            className="flex items-center gap-2 px-6 py-3 bg-[#22C55E] text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-200/40 hover:bg-[#1eb054] hover:shadow-lg hover:shadow-emerald-200/60 active:scale-[0.97] transition-all duration-200"
          >
            <Save size={16} />
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </div>
    </div>
  );
}
