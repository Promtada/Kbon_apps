'use client';

import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ArrowRight, Package, AlertCircle, ShieldCheck, Droplet, Cpu, HeadphonesIcon, Star, User } from 'lucide-react';
import Link from 'next/link';
import { STORAGE_KEYS } from '../lib/storageKeys';
import { API_BASE } from '../lib/axios';
import { HeroCarousel } from '../components/shared/HeroCarousel';
import { ProductCard } from '../components/shared/ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  stock: number;
  category: string;
  warranty?: string | null;
  features: string[];
  isPublished: boolean;
  mainImageUrl?: string | null;
}

export default function LandingPage() {
  const [user, setUser] = useState<any>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<any>(null);

  // เช็คสถานะ Login เพื่อส่งไปให้ Navbar โชว์ Profile
  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const fetchFeaturedProductsAndSettings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [productsRes, settingsRes] = await Promise.all([
          fetch(`${API_BASE}/products?sortBy=createdAt&sortOrder=desc`),
          fetch(`${API_BASE}/settings`)
        ]);
        
        if (!productsRes.ok || !settingsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const data: Product[] = await productsRes.json();
        const settingsData = await settingsRes.json();

        // Filter out unpublished and take top 4
        setFeaturedProducts(data.filter(p => p.isPublished).slice(0, 4));
        setSettings(settingsData);
      } catch (err) {
        console.error('Failed to fetch landing page data:', err);
        setError('ไม่สามารถโหลดข้อมูลสินค้าได้');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedProductsAndSettings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* 🌟 ส่ง user ไปให้ Navbar เพื่อให้ Profile Dropdown ทำงาน */}
      <Navbar user={user} />

      <main className="flex-grow">
        {/* --- Hero Section --- */}
        <HeroCarousel settings={settings} />

        {/* --- What We Do (Features) Section --- */}
        <section className="py-20 bg-[#F8FAFC] relative z-10 -mt-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">ยกระดับการปลูกผักไฮโดรโปนิกส์ด้วยเทคโนโลยี</h2>
              <p className="text-slate-500 mt-4 max-w-2xl mx-auto font-medium">
                (Smart Farming for Everyone) ค้นพบโซลูชันที่ทำให้การดูแลฟาร์มของคุณง่ายขึ้น ประหยัดเวลา และได้ผลผลิตที่สม่ำเสมอกว่าเดิม
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-emerald-50 text-[#22C55E] rounded-2xl flex items-center justify-center mb-6">
                  <Cpu size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3">Automation System</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  ระบบอัตโนมัติอัจฉริยะ ควบคุมการจ่ายน้ำและปุ๋ยได้อย่างแม่นยำตลอด 24 ชั่วโมง
                </p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                  <Droplet size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3">Premium Nutrients</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  สารละลาย AB สูตรพิเศษที่ผ่านการวิจัยมาเพื่อพืชแต่ละชนิดโดยเฉพาะ
                </p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3">Quality Assurance</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  อุปกรณ์ทุกชิ้นผ่านการทดสอบและรับรองคุณภาพ พร้อมการรับประกันสินค้า
                </p>
              </div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                  <HeadphonesIcon size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3">24/7 Support</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  ทีมผู้เชี่ยวชาญพร้อมให้คำปรึกษาและแก้ไขปัญหาให้คุณได้ตลอดเวลา
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Featured Products Section --- */}
        <section className="py-24 bg-white rounded-[4rem] shadow-[0_-20px_50px_rgba(0,0,0,0.02)] relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                  Featured Products
                </h2>
                <p className="text-slate-500 font-bold mt-2">สินค้าคุณภาพที่เกษตรกรไว้วางใจ</p>
                <div className="w-20 h-2 bg-[#22C55E] mt-4 rounded-full"></div>
              </div>
              <Link href="/products" className="text-slate-500 font-bold hover:text-[#22C55E] flex items-center gap-1 transition-colors uppercase text-xs tracking-[0.2em]">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white rounded-[2.5rem] p-4 border border-slate-100 animate-pulse h-96">
                    <div className="w-full aspect-square bg-slate-50 rounded-[2rem] mb-6"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-slate-100 rounded-full w-1/3"></div>
                      <div className="h-6 bg-slate-100 rounded-full w-3/4"></div>
                      <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 border border-slate-100 rounded-[3rem] bg-slate-50">
                <AlertCircle size={32} className="text-red-400" />
                <p className="font-medium text-slate-500">{error}</p>
              </div>
            ) : featuredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 border border-slate-100 rounded-[3rem] bg-slate-50">
                <Package size={32} className="text-slate-300" />
                <p className="font-medium text-slate-500">ยังไม่มีสินค้าแนะนำ</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* --- Testimonials / Social Proof Section --- */}
        {settings?.testimonials && settings.testimonials.filter((t: any) => t.isActive).length > 0 && (
          <section className="py-24 bg-[#F8FAFC]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">เสียงจากผู้ใช้งานจริง</h2>
                <p className="text-slate-500 mt-4 font-medium">ความประทับใจจากลูกค้าที่เปลี่ยนฟาร์มให้สมาร์ทยิ่งขึ้น</p>
                <div className="w-20 h-2 bg-[#22C55E] mt-6 rounded-full mx-auto"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {settings.testimonials.filter((t: any) => t.isActive).map((review: any, index: number) => (
                  <div key={review.id || index} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-lg transition-transform duration-300">
                    <div>
                      <div className="flex gap-1 mb-4 text-orange-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" className="text-amber-400" />)}
                      </div>
                      <p className="text-slate-600 font-medium italic leading-relaxed mb-6">
                        &quot;{review.content}&quot;
                      </p>
                    </div>
                    <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                      {review.avatarUrl ? (
                        <img src={review.avatarUrl} alt={review.authorName} className="w-12 h-12 rounded-full object-cover border-2 border-slate-100" />
                      ) : (
                        <div className="w-12 h-12 rounded-full border-2 border-slate-100 bg-slate-100 flex items-center justify-center text-slate-400">
                          <User size={20} />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-slate-800">{review.authorName}</h4>
                        <p className="text-xs text-slate-500">{review.authorRole}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}