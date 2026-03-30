'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

export default function AddressBookPage() {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm min-h-[500px]">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
          <MapPin className="text-[#22C55E]" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">สมุดที่อยู่</h1>
          <p className="text-sm font-medium text-slate-400 mt-1">จัดการที่อยู่สำหรับจัดส่งสินค้า</p>
        </div>
      </div>

      <div className="h-64 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 gap-3">
        <MapPin size={40} className="text-slate-300" />
        <p className="font-bold">ระบบกำลังอยู่ระหว่างการพัฒนา</p>
      </div>
    </div>
  );
}
