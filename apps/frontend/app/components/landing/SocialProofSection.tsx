import { Quote, Star, User } from 'lucide-react';
import type { Testimonial } from './types';

interface SocialProofSectionProps {
  testimonials: Testimonial[];
}

export function SocialProofSection({ testimonials }: SocialProofSectionProps) {
  const activeTestimonials = testimonials.filter((testimonial) => testimonial.isActive);

  if (activeTestimonials.length === 0) {
    return null;
  }

  return (
    <section className="section-shell bg-[#FAFAFA]">
      <div className="page-shell">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="section-kicker mx-auto">Social Proof</div>
          <h2 className="section-title mt-6">
            ความมั่นใจจากผู้ใช้งานจริง
          </h2>
          <p className="section-copy mt-4">
            เสียงตอบรับจากทีมฟาร์มที่ใช้ Kbon ในการดูแลระบบไฮโดรโปนิกส์ทุกวัน
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeTestimonials.slice(0, 6).map((testimonial, index) => (
            <div
              key={testimonial.id || index}
              className="group flex flex-col rounded-2xl border border-slate-100 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            >
              {/* Top: Quote + Stars */}
              <div className="flex items-center justify-between">
                <Quote size={24} className="text-emerald-200" />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <p className="mt-5 flex-1 text-base leading-relaxed text-slate-600">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                {testimonial.avatarUrl ? (
                  <img
                    src={testimonial.avatarUrl}
                    alt={testimonial.authorName}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-[#22C55E]">
                    <User size={18} />
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {testimonial.authorName}
                  </p>
                  <p className="text-xs font-medium text-slate-400">
                    {testimonial.authorRole || 'Kbon Customer'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
