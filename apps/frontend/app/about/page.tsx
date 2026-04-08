'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { STORAGE_KEYS } from '../../lib/storageKeys';
import { Sprout, ShieldCheck, Cpu, Leaf, Users, Target } from 'lucide-react';

export default function AboutPage() {
  const [user, setUser] = useState<any>(null);

  // Restore user session
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) setUser(JSON.parse(saved));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900">
      <Navbar user={user} />

      <main className="flex-grow">
        {/* ---- Hero Section ---- */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 pt-32 pb-24 px-6 md:pt-40 md:pb-32">
          {/* Decorative background blurs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#22C55E]/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px]" />
          </div>

          <div className="max-w-5xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-widest mb-6">
              <Leaf size={14} /> เกี่ยวกับเรา
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8">
              ขับเคลื่อนอนาคตของ
              <span className="block text-[#22C55E] mt-2">Smart Agriculture</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              Kbon Platform มุ่งมั่นที่จะยกระดับมาตรฐานการทำฟาร์มแบบไฮโดรโปนิกส์ผ่านเทคโนโลยีอัตโนมัติ 
              เพื่อให้การปลูกพืชเป็นเรื่องง่าย แม่นยำ และยั่งยืนสำหรับทุกคน
            </p>
          </div>
        </section>

        {/* ---- Mission & Vision ---- */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#22C55E]/20 to-teal-500/20 blur-3xl transform -skew-y-6 rounded-[3rem]" />
              <img 
                src="https://images.unsplash.com/photo-1581577663583-097560da423d?q=80&w=2000&auto=format&fit=crop" 
                alt="Modern hydroponics farming" 
                className="relative rounded-[2.5rem] shadow-xl border border-white object-cover aspect-[4/3] w-full"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100 hidden md:flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Target size={24} className="text-[#22C55E]" />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-800">100%</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">ความแม่นยำสูงสุด</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-6">
                ทำไมถึงต้องเป็น <span className="text-[#22C55E]">Kbon?</span>
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-8">
                เพราะเราเชื่อว่าเกษตรกรรมไม่ใช่เรื่องที่พึ่งพาเพียงดินและสภาพอากาศอีกต่อไป 
                เราตระหนักดีว่าเกษตรกรยุคใหม่ต้องการความแน่นอน ประสิทธิภาพ และการควบคุมที่สมบูรณ์แบบ 
                ระบบของ Kbon จึงถูกออกแบบมาเพื่อลดความผิดพลาดจากปัจจัยแวดล้อม และเพิ่มผลผลิตด้วยเทคโนโลยีอัจฉริยะแบบเรียลไทม์
              </p>
              
              <div className="space-y-6">
                {/* Feature 1 */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Cpu size={24} className="text-[#22C55E]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800">Automation Technology</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1">
                      เซนเซอร์ล้ำสมัยที่ควบคุมสภาพแวดล้อม อุณหภูมิ และค่าปุ๋ย (pH/EC) อย่างอัตโนมัติ
                    </p>
                  </div>
                </div>
                {/* Feature 2 */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={24} className="text-[#22C55E]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800">Industrial Grade Quality</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1">
                      ทุกชิ้นส่วนและอุปกรณ์ผ่านการคัดสรรและทดสอบเพื่อให้ทนทานต่อการใช้งานเชิงพาณิชย์
                    </p>
                  </div>
                </div>
                {/* Feature 3 */}
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Sprout size={24} className="text-[#22C55E]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800">Sustainable Farming</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mt-1">
                      ประหยัดน้ำและทรัพยากรถึง 80% ปลอดภัยจากสารเคมีตกค้าง เป็นมิตรต่อสิ่งแวดล้อม
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Our Team Section ---- */}
        <section className="bg-white border-t border-slate-100 py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">เกี่ยวกับทีมงานของเรา</h2>
              <div className="w-16 h-1.5 bg-[#22C55E] rounded-full mx-auto mt-4 mb-4" />
              <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                เบื้องหลังความสำเร็จของ Kbon คือกลุ่มวิศวกรผู้เชี่ยวชาญด้าน IoT และนักนวัตกรรมทางการเกษตร
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {/* Team Member 1 */}
              <div className="text-center group">
                <div className="w-40 h-40 mx-auto rounded-full bg-slate-100 mb-6 overflow-hidden border-4 border-white shadow-lg transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-emerald-200/50">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop" alt="CEO" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-black text-slate-800">Sirapop</h3>
                <p className="text-sm font-bold text-[#22C55E] uppercase tracking-wider mt-1">CEO & Founder</p>
              </div>

              {/* Team Member 2 */}
              <div className="text-center group">
                <div className="w-40 h-40 mx-auto rounded-full bg-slate-100 mb-6 overflow-hidden border-4 border-white shadow-lg transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-emerald-200/50">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" alt="CTO" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-black text-slate-800">Jane Doe</h3>
                <p className="text-sm font-bold text-[#22C55E] uppercase tracking-wider mt-1">Chief Technology Officer</p>
              </div>

              {/* Team Member 3 */}
              <div className="text-center group">
                <div className="w-40 h-40 mx-auto rounded-full bg-slate-100 mb-6 overflow-hidden border-4 border-white shadow-lg transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-emerald-200/50">
                  <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop" alt="Head of R&D" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-black text-slate-800">John Smith</h3>
                <p className="text-sm font-bold text-[#22C55E] uppercase tracking-wider mt-1">Head of R&D</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
