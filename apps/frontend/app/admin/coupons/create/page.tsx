'use client';

import React, { useState } from 'react';
import api from '../../../../lib/axios';
import { toast } from 'sonner';
import { Percent, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateCouponPage() {
  const router = useRouter();
  
  const [isCreating, setIsCreating] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'FIXED' | 'PERCENTAGE'>('FIXED');
  const [discountValue, setDiscountValue] = useState<string>('');
  const [minOrderValue, setMinOrderValue] = useState<string>('0');
  const [maxDiscount, setMaxDiscount] = useState<string>('');
  const [usageLimit, setUsageLimit] = useState<string>('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue || isNaN(Number(discountValue))) {
      toast.error('ข้อมูลไม่ครบถ้วน', { description: 'กรุณากรอกรหัสและมูลค่าส่วนลดให้ถูกต้อง' });
      return;
    }
    
    setIsCreating(true);
    try {
      await api.post('/coupons', {
        code: code.toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue) || 0,
        maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
        usageLimit: usageLimit ? Number(usageLimit) : undefined,
      });

      toast.success('สร้างคูปองสำเร็จ!');
      router.push('/admin/coupons'); // Redirect back to list
    } catch (err: any) {
      toast.error('สร้างคูปองล้มเหลว', { description: err?.response?.data?.message || err.message });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/coupons"
          className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            สร้างคูปองใหม่
          </h1>
          <p className="text-sm text-slate-500 mt-1">กำหนดเงื่อนไขส่วนลดสำหรับลูกค้า</p>
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
        <h3 className="font-black text-lg text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
          <Percent size={20} className="text-emerald-500" />
          ข้อมูลรหัสส่วนลด
        </h3>
        
        <form onSubmit={handleCreate} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">รหัสโค้ด (CODE)</label>
            <input
              required
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="เช่น WELCOME10, FREESHIP"
              className="w-full bg-white border border-slate-300 rounded-xl px-5 py-3.5 text-sm font-bold uppercase text-slate-800 placeholder-slate-400 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all"
            />
            <p className="text-xs text-slate-400 mt-1.5 ml-1">ลูกค้าจะใช้รหัสนี้ตอนชำระเงิน (ระบบจะแปลงเป็นพิมพ์ใหญ่ให้อัตโนมัติ)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ประเภทส่วนลด</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-xl px-5 py-3.5 text-sm font-medium text-slate-800 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all"
              >
                <option value="FIXED">ส่วนลดบาทตายตัว (฿)</option>
                <option value="PERCENTAGE">ส่วนลดเปอร์เซ็นต์ (%)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                มูลค่าส่วนลด {discountType === 'PERCENTAGE' && '(%)'}
              </label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === 'FIXED' ? 'เช่น 100 บาท' : 'เช่น 10 เปอร์เซ็นต์'}
                className="w-full bg-white border border-slate-300 rounded-xl px-5 py-3.5 text-sm font-bold text-slate-800 placeholder-slate-400 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">ยอดสั่งซื้อขั้นต่ำ (฿)</label>
              <input
                type="number"
                min="0"
                value={minOrderValue}
                onChange={(e) => setMinOrderValue(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-5 py-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all"
              />
              <p className="text-xs text-slate-400 mt-1.5 ml-1">ใส่ 0 หากไม่มีขั้นต่ำ</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex gap-1">
                ส่วนลดสูงสุด (฿)
              </label>
              <input
                type="number"
                min="0"
                disabled={discountType === 'FIXED'}
                value={maxDiscount}
                onChange={(e) => setMaxDiscount(e.target.value)}
                placeholder={discountType === 'FIXED' ? 'ใช้ได้กับส่วนลดเปอร์เซ็นต์เท่านั้น' : 'ใส่ 0 ถ้าไม่มีลิมิต'}
                className="w-full bg-white border border-slate-300 rounded-xl px-5 py-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">จำกัดสิทธิ์การใช้งาน (จำนวนครั้ง)</label>
            <input
              type="number"
              min="1"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              placeholder="ปล่อยว่างหากต้องการให้ใช้ได้ไม่จำกัดจำนวนครั้ง"
              className="w-full bg-white border border-slate-300 rounded-xl px-5 py-3.5 text-sm font-medium text-slate-800 placeholder-slate-400 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all"
            />
          </div>

          <div className="pt-8 flex gap-4 border-t border-slate-100">
            <Link
              href="/admin/coupons"
              className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 text-slate-600 font-bold py-4 rounded-xl transition-colors text-center text-sm"
            >
              ยกเลิก
            </Link>
            <button
              type="submit"
              disabled={isCreating}
              className="flex-[2] bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all flex justify-center items-center gap-2 text-sm"
            >
              {isCreating ? <Loader2 size={18} className="animate-spin" /> : 'บันทึกคูปองเข้าสู่ระบบ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
