import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { LandingMetrics } from './types';

interface CtaSectionProps {
  metrics: LandingMetrics;
}

export function CtaSection({ metrics }: CtaSectionProps) {
  return (
    <section id="pricing" className="section-shell">
      <div className="page-shell">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 px-6 py-16 text-center sm:px-12 sm:py-20 lg:px-20 lg:py-24">
          {/* Decorative */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
              Ready to grow?
            </p>

            <h2 className="mt-4 font-display text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              พร้อมเริ่มระบบที่เหมาะกับฟาร์มของคุณแล้วหรือยัง
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-slate-300">
              {metrics.startingPrice
                ? `สินค้าเริ่มต้นจาก ฿${metrics.startingPrice.toLocaleString('th-TH')} พร้อมส่งฟรีทั่วประเทศ`
                : 'เลือกชุดเริ่มต้นที่เหมาะกับการใช้งาน พร้อมส่งฟรีทั่วประเทศ'}
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-[#22C55E] px-8 py-4 text-sm font-extrabold text-white shadow-[0_12px_32px_rgba(34,197,94,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#16A34A] hover:shadow-[0_16px_40px_rgba(34,197,94,0.4)]"
              >
                ดูสินค้าทั้งหมด
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2.5 rounded-2xl border border-white/20 bg-white/10 px-8 py-4 text-sm font-extrabold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
              >
                คุยกับทีมงาน
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
