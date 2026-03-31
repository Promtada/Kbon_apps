'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '../../../store/useAuthStore';
import api from '../../../lib/axios';
import { Save, User, Mail, Phone, Calendar, Loader2 } from 'lucide-react';

// ─── Zod Schema ───
const profileSchema = z.object({
  firstName: z.string().min(1, 'กรุณากรอกชื่อจริง'),
  lastName: z.string().min(1, 'กรุณากรอกนามสกุล'),
  phone: z
    .string()
    .regex(/^0\d{8,9}$/, 'เบอร์โทรศัพท์ไม่ถูกต้อง (เช่น 0812345678)')
    .or(z.literal('')),
  dob: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// ─── Helpers ───
function splitName(fullName: string | undefined) {
  const parts = (fullName || '').trim().split(' ');
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
}

function formatDateForInput(dateStr: string | undefined | null): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toISOString().split('T')[0];
  } catch {
    return '';
  }
}

// ═══════════════════════════════════════════════════
export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const { firstName: defFirst, lastName: defLast } = splitName(user?.name);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: defFirst,
      lastName: defLast,
      phone: user?.phone || '',
      dob: formatDateForInput(user?.dob),
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─── Submit handler ───
  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim();

      const payload: Record<string, any> = { name: fullName };
      if (data.phone) payload.phone = data.phone;
      if (data.dob) payload.dob = data.dob;

      const res = await api.patch('/auth/me/profile', payload);

      // Update Zustand store → Navbar / Sidebar update instantly
      updateUser({
        name: res.data.name,
        phone: res.data.phone,
        dob: res.data.dob,
        ...(res.data.avatarUrl && { image: res.data.avatarUrl }),
      });

      toast.success('บันทึกสำเร็จ!', {
        description: 'ข้อมูลส่วนตัวของคุณถูกอัปเดตแล้ว',
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
      toast.error('บันทึกไม่สำเร็จ', { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Initials for avatar ───
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : '?';

  // ═══════════════════════════════════════════════════
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
            <p className="text-sm text-slate-400 font-medium mt-0.5 truncate">
              {user?.email || ''}
            </p>
          </div>

          {/* Role badge */}
          <span className="px-4 py-1.5 bg-emerald-50 text-[#22C55E] text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
            {user?.role || 'USER'}
          </span>
        </div>
      </div>

      {/* ─── Personal Info Form Card ─── */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8"
      >
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
              {...register('firstName')}
              placeholder="กรอกชื่อจริง"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-50 outline-none transition-all ${
                errors.firstName ? 'border-red-300 bg-red-50/30' : 'border-slate-100'
              }`}
            />
            {errors.firstName && (
              <p className="text-[11px] text-red-500 font-medium mt-1.5 ml-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <User size={13} className="text-slate-400" />
              นามสกุล
            </label>
            <input
              type="text"
              {...register('lastName')}
              placeholder="กรอกนามสกุล"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-50 outline-none transition-all ${
                errors.lastName ? 'border-red-300 bg-red-50/30' : 'border-slate-100'
              }`}
            />
            {errors.lastName && (
              <p className="text-[11px] text-red-500 font-medium mt-1.5 ml-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email (disabled — not part of form) */}
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
              {...register('phone')}
              placeholder="0xx-xxx-xxxx"
              className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-50 outline-none transition-all ${
                errors.phone ? 'border-red-300 bg-red-50/30' : 'border-slate-100'
              }`}
            />
            {errors.phone && (
              <p className="text-[11px] text-red-500 font-medium mt-1.5 ml-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Date of Birth — full width */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              <Calendar size={13} className="text-slate-400" />
              วันเกิด
            </label>
            <input
              type="date"
              {...register('dob')}
              className="w-full md:w-1/2 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:border-emerald-300 focus:ring-4 focus:ring-emerald-50 outline-none transition-all"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-slate-50">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-[#22C55E] text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-200/40 hover:bg-[#1eb054] hover:shadow-lg hover:shadow-emerald-200/60 active:scale-[0.97] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              <>
                <Save size={16} />
                บันทึกการเปลี่ยนแปลง
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
