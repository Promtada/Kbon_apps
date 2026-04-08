'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Leaf } from 'lucide-react';

export function HeroCarousel({ settings }: { settings?: any }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fallback to static banners if no db ones
  const banners = settings?.banners && settings.banners.length > 0 
    ? settings.banners.filter((b: any) => b.isActive) 
    : [
        {
          id: 'fallback-1',
          imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop',
          targetUrl: '/register'
        }
      ];

  // Auto-play
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  // Text values
  const rawHeadline = settings?.mainHeadline || 'The Best Automated | Hydroponics System';
  const headlineParts = rawHeadline.split('|');
  const mainTitle = headlineParts[0]?.trim();
  const highlightTitle = headlineParts[1]?.trim();
  const subHeadline = settings?.subHeadline || 'ประหยัดเวลาด้วยระบบ Kbon: ควบคุมค่า pH และการจ่ายปุ๋ยอัตโนมัติ แม่นยำทุกหยด ดูแลฟาร์มของคุณได้จากทุกที่ผ่านมือถือ';

  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-24 md:pb-32 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="relative w-full rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden aspect-[4/5] md:aspect-[21/9] bg-slate-900 shadow-2xl group">
          
          {/* Slides */}
          {banners.map((banner: any, index: number) => (
            <div
              key={banner.id || index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full bg-slate-900 border-none overflow-hidden">
                {banner.imageUrl ? (
                  <img 
                    src={banner.imageUrl} 
                    alt="Hero Banner"
                    className={`w-full h-full object-cover object-center transition-transform duration-10000 ease-linear ${
                      index === currentSlide ? 'scale-100' : 'scale-105'
                    }`}
                  />
                ) : (
                  <div className={`w-full h-full bg-slate-800 transition-transform duration-10000 ease-linear ${
                    index === currentSlide ? 'scale-100' : 'scale-105'
                  }`} />
                )}
              </div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
              
              {/* Content Layer (Stays static visually as background rotates) */}
              {index === currentSlide && (
                <div className="absolute inset-0 flex flex-col justify-center items-start p-8 md:p-12 lg:p-20 z-10 w-full xl:w-2/3">
                  <div className="max-w-2xl lg:max-w-3xl">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 backdrop-blur-md animate-[fadeInUp_0.8s_ease_out]">
                      <Leaf size={14} /> The Future of Farming
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight md:leading-snug tracking-tight text-white animate-[fadeInUp_1s_ease_out]">
                      {mainTitle} {highlightTitle && <><br /><span className="text-[#22C55E] drop-shadow-md">{highlightTitle}</span></>}
                    </h2>
                    
                    <p className="text-gray-200 text-base md:text-lg lg:text-xl mb-10 font-medium leading-relaxed drop-shadow-sm animate-[fadeInUp_1.2s_ease_out]">
                      {subHeadline}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 animate-[fadeInUp_1.4s_ease_out] w-full sm:w-auto">
                      <Link href={banner.targetUrl || '/products'} className="w-full sm:w-auto bg-[#22C55E] text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-green-900/50 hover:bg-[#1eb054] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                        ช้อปเลย <ArrowRight size={20} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Navigation Arrows */}
          {banners.length > 1 && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 hover:scale-110"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 hover:scale-110"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
              {banners.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide 
                      ? 'w-8 h-2.5 bg-[#22C55E] shadow-lg shadow-green-500/50' 
                      : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

        </div>
      </div>
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
         <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-100/40 rounded-full blur-[120px]"></div>
      </div>
    </section>
  );
}
