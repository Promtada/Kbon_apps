'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Package } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#22C55E', '#10B981', '#34D399', '#fcd34d']
    });
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl shadow-green-900/5 border border-slate-100 text-center animate-[fadeIn_0.5s_ease]">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-50 to-green-100 rounded-full flex items-center justify-center shadow-inner animate-[bounce_1s_ease-in-out]">
            <CheckCircle2 size={48} className="text-[#22C55E]" strokeWidth={2.5} />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            ชำระเงินสำเร็จ!
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            ขอบคุณสำหรับคำสั่งซื้อ เราได้รับข้อมูลและกำลังเตรียมจัดส่งสินค้าให้คุณโดยเร็วที่สุด
          </p>
          
          {sessionId && (
            <div className="mt-6 inline-block bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100/80">
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider text-center">
                หมายเลขอ้างอิง <br/>
                <span className="font-mono text-slate-500 opacity-80 break-all">{sessionId}</span>
              </p>
            </div>
          )}
        </div>

        <div className="pt-8 space-y-4">
          <Link
            href="/account/orders"
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#22C55E] text-white font-black text-sm rounded-2xl shadow-lg shadow-green-200 hover:bg-[#1eb054] hover:-translate-y-0.5 transition-all active:scale-[0.98]"
          >
            <Package size={18} />
            ดูรายการคำสั่งซื้อ
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-600 font-black text-sm rounded-2xl border-2 border-slate-100 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98]"
          >
            เลือกซื้อสินค้าต่อ
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-50/50">
        <div className="animate-pulse w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center">
          <CheckCircle2 size={32} className="text-emerald-200" />
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
