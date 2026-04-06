'use client';

import React, { useState, useEffect } from 'react';
import api from '../../../lib/axios';
import { toast } from 'sonner';
import { Percent, Plus, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Coupon {
  id: string;
  code: string;
  discountType: 'FIXED' | 'PERCENTAGE';
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number | null;
  expiresAt: string | null;
  usageLimit: number | null;
  usedCount: number;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCoupons = async () => {
    setIsRefreshing(true);
    try {
      const res = await api.get('/coupons');
      setCoupons(res.data);
    } catch (err: any) {
      toast.error('โหลดข้อมูลคูปองล้มเหลว', { description: err.message });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);


  const handleDelete = async (id: string, codeStr: string) => {
    if (!window.confirm(`ยืนยันการลบคูปอง ${codeStr}?`)) return;

    try {
      await api.delete(`/coupons/${id}`);
      toast.success(`ลบ ${codeStr} เรียบร้อยแล้ว`);
      fetchCoupons();
    } catch (err: any) {
      toast.error('ลบไม่สำเร็จ', { description: err?.response?.data?.message || err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">จัดการส่วนลด (Coupons)</h1>
          <p className="text-sm text-slate-500 mt-1">ตั้งค่ารหัสคูปอง โค้ดส่วนลด และข้อจำกัด</p>
        </div>
        <Link
          href="/admin/coupons/create"
          className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-200 flex items-center gap-2"
        >
          <Plus size={18} />
          สร้างคูปองใหม่
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 uppercase flex-col">
              <tr>
                <th className="px-6 py-4 font-bold rounded-tl-xl text-xs tracking-wider">รหัสโค้ด</th>
                <th className="px-6 py-4 font-bold text-xs tracking-wider">ประเภทส่วนลด</th>
                <th className="px-6 py-4 font-bold text-xs tracking-wider">มูลค่า</th>
                <th className="px-6 py-4 font-bold text-xs tracking-wider">ขั้นต่ำ</th>
                <th className="px-6 py-4 font-bold text-xs tracking-wider">การใช้งาน (Used/Limit)</th>
                <th className="px-6 py-4 font-bold rounded-tr-xl text-xs tracking-wider text-right">แอคชั่น</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2 text-slate-300" />
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex justify-center mb-3 text-slate-300">
                      <Percent size={32} />
                    </div>
                    ยังไม่มีข้อมูลคูปองส่วนลด
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-black text-emerald-600">{c.code}</td>
                    <td className="px-6 py-4">
                      {c.discountType === 'FIXED' ? (
                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-bold">ลดตายตัว (Baht)</span>
                      ) : (
                        <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded-md text-xs font-bold">ลดเปอร์เซ็นต์ (%)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-black">
                      {c.discountType === 'FIXED' ? `฿${c.discountValue.toLocaleString()}` : `${c.discountValue}%`}
                      {c.maxDiscount && <span className="text-xs text-slate-400 font-medium block">สูงสุด ฿{c.maxDiscount}</span>}
                    </td>
                    <td className="px-6 py-4 font-medium">฿{c.minOrderValue.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{c.usedCount}</span>
                        <span className="text-slate-400">/</span>
                        <span className="text-slate-500">{c.usageLimit || '∞'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(c.id, c.code)}
                        className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
