'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '../../../../store/useAuthStore';
import api from '../../../../lib/axios';
import { Save, User, Phone, Lock, Loader2, KeyRound } from 'lucide-react';

// ─── Zod Schemas ───
const profileSchema = z.object({
  firstName: z.string().min(1, 'กรุณากรอกชื่อจริง'),
  lastName: z.string().min(1, 'กรุณากรอกนามสกุล'),
  phone: z
    .string()
    .regex(/^0\d{8,9}$/, 'เบอร์โทรศัพท์ไม่ถูกต้อง (เช่น 0812345678)')
    .or(z.literal('')),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'กรุณากรอกรหัสผ่านปัจจุบัน'),
  newPassword: z.string().min(6, 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร'),
  confirmPassword: z.string().min(1, 'กรุณายืนยันรหัสผ่านใหม่'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "รหัสผ่านใหม่ไม่ตรงกัน",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// ─── Helpers ───
function splitName(fullName: string | undefined) {
  const parts = (fullName || '').trim().split(' ');
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  };
}

export default function AccountSettingsPage() {
  const user = useAuthStore((s: any) => s.user);
  const updateUser = useAuthStore((s: any) => s.updateUser);

  const { firstName: defFirst, lastName: defLast } = splitName(user?.name);

  // ─── Profile Form ───
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: defFirst,
      lastName: defLast,
      phone: user?.phone || '',
    },
  });

  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsProfileSubmitting(true);
    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim();
      const payload: Record<string, any> = { name: fullName };
      if (data.phone !== undefined) payload.phone = data.phone;

      const res = await api.patch('/auth/me/profile', payload);

      updateUser({
        name: res.data.name,
        phone: res.data.phone,
      });

      toast.success('บันทึกสำเร็จ', {
        description: 'ข้อมูลส่วนตัวของคุณถูกอัปเดตแล้ว',
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
      toast.error('บันทึกไม่สำเร็จ', { description: msg });
    } finally {
      setIsProfileSubmitting(false);
    }
  };

  // ─── Password Form ───
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsPasswordSubmitting(true);
    try {
      await api.patch('/auth/me/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success('เปลี่ยนรหัสผ่านสำเร็จ', {
        description: 'คุณสามารถใช้รหัสผ่านใหม่ในการเข้าสู่ระบบครั้งต่อไป',
      });
      resetPasswordForm();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'รหัสผ่านปัจจุบันไม่ถูกต้อง หรือเกิดข้อผิดพลาด';
      toast.error('เปลี่ยนรหัสผ่านไม่สำเร็จ', { description: msg });
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  const inputClass = (hasError?: boolean) => `
    w-full px-4 py-3 bg-slate-50 border rounded-xl text-[13px] font-semibold text-slate-800 
    placeholder:text-slate-400 placeholder:font-medium focus:bg-white focus:outline-none transition-all
    ${hasError ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-4 focus:ring-red-50' : 'border-slate-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50'}
  `;

  return (
    <div className="max-w-4xl space-y-6">
      
      {/* ─── Profile Details Card ─── */}
      <form
        onSubmit={handleProfileSubmit(onProfileSubmit)}
        className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="p-6 sm:p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
             <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
               <User size={20} className="text-emerald-500" />
               ข้อมูลส่วนตัว
             </h2>
             <p className="text-[13px] font-medium text-slate-500 mt-1">อัปเดตข้อมูลเพื่อให้เราสามารถติดต่อคุณได้</p>
           </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                ชื่อจริง
              </label>
              <div className="relative">
                 <input
                   type="text"
                   {...registerProfile('firstName')}
                   placeholder="กรอกชื่อจริง"
                   className={inputClass(!!profileErrors.firstName)}
                 />
              </div>
              {profileErrors.firstName && (
                <p className="text-[11px] text-red-500 font-bold mt-1.5 ml-1">{profileErrors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                นามสกุล
              </label>
              <input
                type="text"
                {...registerProfile('lastName')}
                placeholder="กรอกนามสกุล"
                className={inputClass(!!profileErrors.lastName)}
              />
              {profileErrors.lastName && (
                <p className="text-[11px] text-red-500 font-bold mt-1.5 ml-1">{profileErrors.lastName.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                เบอร์โทรศัพท์
              </label>
              <div className="relative md:w-1/2">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone size={15} />
                </div>
                <input
                  type="tel"
                  {...registerProfile('phone')}
                  placeholder="08X XXX XXXX"
                  className={inputClass(!!profileErrors.phone) + " pl-10"}
                />
              </div>
              {profileErrors.phone && (
                <p className="text-[11px] text-red-500 font-bold mt-1.5 ml-1">{profileErrors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="pt-6 mt-2 border-t border-slate-50 flex justify-end">
            <button
              type="submit"
              disabled={isProfileSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold text-[13px] rounded-xl shadow-sm shadow-emerald-200 hover:bg-emerald-600 hover:shadow-md hover:shadow-emerald-200 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isProfileSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isProfileSubmitting ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
            </button>
          </div>
        </div>
      </form>

      {/* ─── Change Password Card ─── */}
      <form
        onSubmit={handlePasswordSubmit(onPasswordSubmit)}
        className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
      >
        <div className="p-6 sm:p-8 border-b border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
             <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
               <KeyRound size={20} className="text-slate-600" />
               รหัสผ่านและความปลอดภัย
             </h2>
             <p className="text-[13px] font-medium text-slate-500 mt-1">อัปเดตรหัสผ่านเพื่อรักษาความปลอดภัยของบัญชี</p>
           </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 md:w-1/2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                รหัสผ่านปัจจุบัน
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={15} />
                </div>
                <input
                  type="password"
                  {...registerPassword('currentPassword')}
                  placeholder="••••••••"
                  className={inputClass(!!passwordErrors.currentPassword) + " pl-10"}
                />
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-[11px] text-red-500 font-bold mt-1.5 ml-1">{passwordErrors.currentPassword.message}</p>
              )}
            </div>

            <div className="w-full h-[1px] bg-slate-100 md:col-span-2 my-2"></div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                รหัสผ่านใหม่
              </label>
              <div className="relative">
                <input
                  type="password"
                  {...registerPassword('newPassword')}
                  placeholder="ความยาวอย่างน้อย 6 ตัวอักษร"
                  className={inputClass(!!passwordErrors.newPassword)}
                />
              </div>
              {passwordErrors.newPassword && (
                <p className="text-[11px] text-red-500 font-bold mt-1.5 ml-1">{passwordErrors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                ยืนยันรหัสผ่านใหม่
              </label>
              <div className="relative">
                <input
                  type="password"
                  {...registerPassword('confirmPassword')}
                  placeholder="กรุณาพิมพ์รหัสผ่านใหม่อีกครั้ง"
                  className={inputClass(!!passwordErrors.confirmPassword)}
                />
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-[11px] text-red-500 font-bold mt-1.5 ml-1">{passwordErrors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div className="pt-6 mt-2 border-t border-slate-50 flex justify-end">
            <button
              type="submit"
              disabled={isPasswordSubmitting}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold text-[13px] rounded-xl shadow-sm hover:bg-slate-800 hover:shadow-md active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isPasswordSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isPasswordSubmitting ? 'กำลังบันทึก...' : 'เปลี่ยนรหัสผ่าน'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
