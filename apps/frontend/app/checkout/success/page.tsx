'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuthStore } from '../../../store/useAuthStore';

export default function CheckoutSuccessPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar user={user} />
      
      <div className="flex-1 flex items-center justify-center p-6 py-20">
        <div className="bg-white max-w-lg w-full rounded-[3rem] p-10 md:p-14 text-center shadow-xl shadow-slate-100/50 border border-slate-100 relative overflow-hidden">
          
          <div className="absolute top-0 inset-x-0 h-2 bg-[#22C55E]" />

          <div className="relative inline-flex items-center justify-center w-28 h-28 bg-emerald-50 rounded-full mb-8">
            <div className="w-20 h-20 bg-[#22C55E] rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200 animate-[bounce_1s_ease_infinite]">
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 tracking-tighter">ขอบคุณที่ชำระเงิน!</h1>
          
          <p className="text-slate-500 font-medium leading-relaxed mb-10 text-sm md:text-base px-4">
            เราได้รับคำสั่งซื้อของคุณเรียบร้อยแล้ว<br className="hidden md:block"/>
            การจัดส่งจะถูกดำเนินการภายใน 24 ชั่วโมง และเราจะแจ้งข้อมูล Tracking ผ่านทางอีเมลของคุณ
          </p>

          <div className="flex flex-col gap-3">
             <Link 
               href="/products" 
               className="w-full py-4 bg-[#22C55E] text-white font-black rounded-2xl hover:bg-[#1eb054] hover:-translate-y-0.5 shadow-lg shadow-green-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
             >
               <ShoppingBag size={20} /> ช้อปปิ้งสินค้าต่อ
             </Link>
             <Link 
               href="/" 
               className="w-full py-4 text-slate-500 font-bold hover:text-slate-800 transition-colors"
             >
               กลับสู่หน้าหลัก <ArrowRight size={16} className="inline ml-1" />
             </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
