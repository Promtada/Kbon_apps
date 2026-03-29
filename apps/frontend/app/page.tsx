'use client';

import React, { useEffect, useState } from 'react';
// ✅ แก้ไข Path: ใช้ ./components เพราะอยู่ในระดับเดียวกันภายใต้โฟลเดอร์ app
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ShoppingCart, Leaf, Zap, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);

  // เช็คสถานะ Login เพื่อส่งไปให้ Navbar โชว์ Profile
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const combos = [
    { name: 'PH AUTOMATION', price: '฿1,500', discount: '50% Off', icon: <Zap className="text-amber-500" /> },
    { name: 'STARTER COMBO', price: '฿2,900', discount: '฿750 Off', icon: <Leaf className="text-emerald-500" /> },
    { name: 'PRO COMBO', price: '฿5,500', discount: 'Hot Deal', icon: <Globe className="text-blue-500" /> },
    { name: 'EXPERT COMBO', price: '฿8,900', discount: 'Best Value', icon: <Zap className="text-[#22C55E]" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* 🌟 ส่ง user ไปให้ Navbar เพื่อให้ Profile Dropdown ทำงาน */}
      <Navbar user={user} />

      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <section className="relative overflow-hidden pt-20 pb-32 px-4">
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-[#22C55E] px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-8 animate-bounce">
              <Leaf size={14} /> The Future of Farming is here
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter text-slate-800">
              The Best Automated <br /> 
              <span className="text-[#22C55E] drop-shadow-sm">Hydroponics System</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-12 font-medium leading-relaxed">
              ประหยัดเวลาด้วยระบบ Kbon: ควบคุมค่า pH และการจ่ายปุ๋ยอัตโนมัติ 
              แม่นยำทุกหยด ดูแลฟาร์มของคุณได้จากทุกที่ผ่านมือถือ
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto bg-[#22C55E] text-white px-10 py-5 rounded-2xl font-black shadow-xl shadow-green-200 hover:bg-[#1eb054] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                เริ่มใช้งานฟรี <ArrowRight size={20} />
              </Link>
              <button className="w-full sm:w-auto bg-white text-slate-600 border-2 border-slate-100 px-10 py-5 rounded-2xl font-black hover:bg-slate-50 transition-all">
                ดูวิดีโอสาธิต
              </button>
            </div>
          </div>

          {/* ตกแต่งพื้นหลังด้วยวงกลมเบลอๆ (Glassmorphism Style) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0">
             <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-[100px]"></div>
             <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-100/40 rounded-full blur-[120px]"></div>
          </div>
        </section>

        {/* --- Automation Combos Section --- */}
        <section className="py-24 bg-white rounded-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                  Automation Combos
                </h2>
                <div className="w-20 h-2 bg-[#22C55E] mt-4 rounded-full"></div>
              </div>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.3em]">Shop the collection</p>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {combos.map((item, index) => (
                <div key={index} className="group bg-[#F8FAFC] rounded-[2.5rem] p-2 border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-500">
                  <div className="relative aspect-square bg-slate-200 rounded-[2rem] overflow-hidden mb-6 flex items-center justify-center text-slate-400 group-hover:scale-[0.98] transition-transform">
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-white text-[#22C55E] text-[10px] font-black py-1.5 px-3 rounded-xl shadow-sm uppercase tracking-widest">
                      {item.discount}
                    </div>
                    {/* Placeholder Icon */}
                    <div className="scale-[2.5] opacity-20">{item.icon}</div>
                    <span className="absolute bottom-4 text-[10px] font-bold uppercase tracking-widest opacity-40">Product Image</span>
                  </div>

                  <div className="p-4 pt-0">
                    <h3 className="font-black text-lg text-slate-800 mb-1">{item.name}</h3>
                    <p className="text-[#22C55E] font-black text-xl mb-6">{item.price}</p>
                    
                    <button className="w-full bg-white border-2 border-slate-100 text-slate-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 group-hover:bg-[#22C55E] group-hover:text-white group-hover:border-[#22C55E] transition-all">
                      <ShoppingCart size={18} /> สั่งซื้อเลย
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}