'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Leaf, Play } from 'lucide-react';
import type { LandingMetrics, Product, SiteSettings } from './types';

interface HeroSectionProps {
  settings: SiteSettings | null;
  metrics: LandingMetrics;
  featuredProducts: Product[];
}

const fallbackSlides = [
  {
    id: 'fallback-1',
    imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1600&auto=format&fit=crop',
    targetUrl: '/products',
  },
  {
    id: 'fallback-2',
    imageUrl: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?q=80&w=1600&auto=format&fit=crop',
    targetUrl: '/contact',
  },
];

export function HeroSection({ settings, metrics, featuredProducts }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = useMemo(() => {
    const activeBanners = settings?.banners?.filter((banner) => banner.isActive);
    if (activeBanners && activeBanners.length > 0) {
      return activeBanners;
    }

    if (settings?.heroMediaUrl) {
      return [
        {
          id: 'hero-media',
          imageUrl: settings.heroMediaUrl,
          targetUrl: '/products',
        },
      ];
    }

    return fallbackSlides;
  }, [settings]);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const headlineSource = settings?.mainHeadline?.trim()
    ? settings.mainHeadline
    : 'SMART DOSING|FOR HYDROPONICS';
  const [headline, highlight] = headlineSource.split('|').map((part) => part?.trim());
  const subheadline = settings?.subHeadline?.trim()
    ? settings.subHeadline
    : 'ประหยัดเวลาด้วยระบบ Kbon ควบคุมค่า pH และการจ่ายปุ๋ยอัตโนมัติ แม่นยำทุกหยด ดูแลฟาร์มของคุณได้จากทุกที่';

  const activeSlideIndex = slides.length > 0 ? currentSlide % slides.length : 0;

  return (
    <section className="relative overflow-hidden bg-white">
      <div className="page-shell">
        <div className="grid min-h-[calc(100vh-120px)] items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          {/* ---- Left: Text Content ---- */}
          <div className="relative z-10 max-w-xl animate-fade-in-up">
            {/* Kicker */}
            <div className="section-kicker mb-8">
              <Leaf size={14} />
              Smart Hydroponic Platform
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              {headline}
              {highlight && (
                <span className="block text-[#22C55E]">{highlight}</span>
              )}
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-lg leading-relaxed text-slate-500 sm:text-xl">
              {subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href={slides[activeSlideIndex]?.targetUrl || '/products'}
                className="button-primary text-base"
              >
                เริ่มเลือกโซลูชัน
                <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="button-secondary text-base">
                <Play size={16} className="text-[#22C55E]" />
                ขอคำปรึกษาฟรี
              </Link>
            </div>

            {/* Metrics Row */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-100 pt-8">
              <div>
                <p className="font-display text-3xl font-black tracking-tight text-slate-900">
                  {metrics.totalProducts || 0}+
                </p>
                <p className="mt-1 text-sm font-medium text-slate-400">
                  สินค้าพร้อมใช้งาน
                </p>
              </div>
              <div>
                <p className="font-display text-3xl font-black tracking-tight text-slate-900">
                  {metrics.startingPrice
                    ? `฿${metrics.startingPrice.toLocaleString('th-TH')}`
                    : 'พร้อมเริ่ม'}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-400">
                  ราคาเริ่มต้น
                </p>
              </div>
              <div>
                <p className="font-display text-3xl font-black tracking-tight text-slate-900">
                  {metrics.activeTestimonials > 0
                    ? `${metrics.activeTestimonials}+`
                    : '24/7'}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-400">
                  {metrics.activeTestimonials > 0 ? 'รีวิวจากลูกค้า' : 'ซัพพอร์ตทีม'}
                </p>
              </div>
            </div>
          </div>

          {/* ---- Right: Hero Image ---- */}
          <div className="relative animate-fade-in-up [animation-delay:150ms]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.08)] lg:aspect-[5/4]">
              {slides.map((slide, index) => (
                <div
                  key={slide.id || index}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === activeSlideIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={slide.imageUrl}
                    alt="Kbon platform showcase"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}

              {/* Slide Indicators */}
              {slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.id || index}
                      type="button"
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === activeSlideIndex
                          ? 'w-8 bg-[#22C55E]'
                          : 'w-2 bg-white/60 hover:bg-white/90'
                      }`}
                      aria-label={`เปลี่ยนไปยังภาพ ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 -left-4 hidden rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] lg:flex lg:items-center lg:gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <Leaf size={18} className="text-[#22C55E]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Automation Control</p>
                <p className="text-xs font-medium text-slate-400">24/7 monitoring</p>
              </div>
            </div>

            {/* Decorative blur */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-emerald-100/50 blur-3xl" />
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-64 w-64 rounded-full bg-emerald-50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-80 w-80 rounded-full bg-emerald-50/50 blur-3xl" />
    </section>
  );
}
