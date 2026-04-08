'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { STORAGE_KEYS } from '../../lib/storageKeys';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [user, setUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restore user session for the Navbar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network delay for effect
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('ส่งข้อความสำเร็จ!', {
        description: 'ขอบคุณที่ติดต่อเรา ทีมงานจะรีบตอบกลับคุณโดยเร็วที่สุด',
        icon: <CheckCircle2 className="text-emerald-500" />,
      });
      // Optionally reset form here
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900">
      <Navbar user={user} />

      <main className="flex-grow">
        {/* ---- Minimal Hero ---- */}
        <section className="bg-white border-b border-slate-100 pt-32 pb-16 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">
              ติดต่อ<span className="text-[#22C55E]">ทีมงาน Kbon</span>
            </h1>
            <div className="w-16 h-1.5 bg-[#22C55E] rounded-full mx-auto my-6" />
            <p className="text-slate-500 text-lg font-medium">
              มีคำถามเกี่ยวกับสินค้า วิธีการใช้งาน หรือสนใจติดตั้งระบบฟาร์มอัจฉริยะ? 
              <br className="hidden md:inline" /> เรายินดีให้คำปรึกษาและพร้อมช่วยเหลือคุณเสมอ
            </p>
          </div>
        </section>

        {/* ---- Contact Form & Info Grid ---- */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 items-start">
            
            {/* Left Column: Form (spans 3 columns on large screens) */}
            <div className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-[#22C55E]" />
              <h2 className="text-2xl font-black text-slate-800 mb-8">ส่งข้อความหาเรา</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 block">ชื่อ - นามสกุล <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="text" 
                      placeholder="เช่น สมชาย ใจดี"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-[#22C55E]/20 focus:border-[#22C55E] outline-none transition-all placeholder:text-slate-400 text-slate-800"
                    />
                  </div>
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-600 block">อีเมล <span className="text-red-500">*</span></label>
                    <input 
                      required
                      type="email" 
                      placeholder="เช่น somchai@example.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-[#22C55E]/20 focus:border-[#22C55E] outline-none transition-all placeholder:text-slate-400 text-slate-800"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 block">หัวข้อเรื่อง <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    placeholder="เรื่องที่คุณต้องการติดต่อ"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-[#22C55E]/20 focus:border-[#22C55E] outline-none transition-all placeholder:text-slate-400 text-slate-800"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 block">ข้อความ <span className="text-red-500">*</span></label>
                  <textarea 
                    required
                    rows={5}
                    placeholder="อธิบายรายละเอียดหรือคำถามที่คุณต้องการทราบ..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-[#22C55E]/20 focus:border-[#22C55E] outline-none transition-all placeholder:text-slate-400 text-slate-800 resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto px-8 py-4 bg-[#22C55E] text-white rounded-2xl font-black text-sm hover:bg-[#1eb054] hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg shadow-[#22C55E]/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        กำลังส่งข้อความ...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send size={16} /> ส่งข้อความ
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Information (spans 2 columns) */}
            <div className="lg:col-span-2 space-y-8">
              
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 h-full flex flex-col justify-center">
                <h3 className="text-xl font-black text-slate-800 mb-8 border-b border-slate-100 pb-4">ช่องทางการติดต่อ</h3>
                
                <ul className="space-y-8">
                  {/* Email */}
                  <li className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#22C55E] flex items-center justify-center flex-shrink-0">
                      <Mail size={22} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">อีเมล</p>
                      <a href="mailto:support@kbon.com" className="text-base font-bold text-slate-700 hover:text-[#22C55E] transition-colors">
                        support@kbon.com
                      </a>
                    </div>
                  </li>

                  {/* Phone */}
                  <li className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#22C55E] flex items-center justify-center flex-shrink-0">
                      <Phone size={22} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">เบอร์โทรศัพท์ติดต่อ</p>
                      <a href="tel:0889914444" className="text-base font-bold text-slate-700 hover:text-[#22C55E] transition-colors">
                        088-991-XXXX
                      </a>
                    </div>
                  </li>

                  {/* Location */}
                  <li className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#22C55E] flex items-center justify-center flex-shrink-0">
                      <MapPin size={22} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">ที่ตั้งสำนักงาน</p>
                      <address className="text-sm font-medium text-slate-600 not-italic leading-relaxed">
                        สำนักงานใหญ่ Kbon Platform<br />
                        ตำบลน้ำน้อย, อำเภอหาดใหญ่<br />
                        จังหวัดสงขลา 90110
                      </address>
                    </div>
                  </li>

                  {/* Business Hours */}
                  <li className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#22C55E] flex items-center justify-center flex-shrink-0">
                      <Clock size={22} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">เวลาทำการ</p>
                      <p className="text-sm font-medium text-slate-600">
                        จันทร์ - ศุกร์<br />
                        <span className="font-bold text-slate-800">เวลา 09:00 น. - 18:00 น.</span>
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
