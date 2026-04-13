'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, Package } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { STORAGE_KEYS } from '../lib/storageKeys';
import { API_BASE } from '../lib/axios';
import { ProductCard } from '../components/shared/ProductCard';
import { HeroSection } from './components/landing/HeroSection';
import { FeatureSection } from './components/landing/FeatureSection';
import { HowItWorksSection } from './components/landing/HowItWorksSection';
import { SocialProofSection } from './components/landing/SocialProofSection';
import { CtaSection } from './components/landing/CtaSection';
import type { LandingMetrics, Product, SiteSettings } from './components/landing/types';

interface LandingUser {
  id?: string;
  name: string;
  role: string;
  image?: string | null;
}

const initialMetrics: LandingMetrics = {
  totalProducts: 0,
  startingPrice: null,
  activeTestimonials: 0,
};

function FeaturedProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-[430px] animate-pulse rounded-2xl border border-slate-100 bg-white p-4"
        >
          <div className="aspect-square rounded-xl bg-slate-50" />
          <div className="mt-5 space-y-3 px-1">
            <div className="h-4 w-1/3 rounded-full bg-slate-100" />
            <div className="h-5 w-4/5 rounded-full bg-slate-100" />
            <div className="h-4 w-full rounded-full bg-slate-100" />
            <div className="h-4 w-2/3 rounded-full bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [user, setUser] = useState<LandingUser | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [metrics, setMetrics] = useState<LandingMetrics>(initialMetrics);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const fetchLandingData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [productsRes, settingsRes] = await Promise.all([
          fetch(`${API_BASE}/products?sortBy=createdAt&sortOrder=desc`),
          fetch(`${API_BASE}/settings`),
        ]);

        if (!productsRes.ok || !settingsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const productsData: Product[] = await productsRes.json();
        const settingsData: SiteSettings = await settingsRes.json();
        const publishedProducts = productsData.filter((product) => product.isPublished);
        const activeTestimonials =
          settingsData.testimonials?.filter((testimonial) => testimonial.isActive).length || 0;

        setFeaturedProducts(publishedProducts.slice(0, 4));
        setSettings(settingsData);
        setMetrics({
          totalProducts: publishedProducts.length,
          startingPrice:
            publishedProducts.length > 0
              ? publishedProducts.reduce(
                (lowestPrice, product) => Math.min(lowestPrice, product.price),
                publishedProducts[0].price
              )
              : null,
          activeTestimonials,
        });
      } catch (fetchError) {
        console.error('Failed to fetch landing page data:', fetchError);
        setError('ไม่สามารถโหลดข้อมูลหน้าเว็บไซต์ได้ในขณะนี้');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <Navbar user={user} />

      <main className="flex-1">
        <HeroSection settings={settings} metrics={metrics} featuredProducts={featuredProducts} />
        <FeatureSection />
        <HowItWorksSection />

        {/* Featured Products */}
        <section id="products" className="section-shell">
          <div className="page-shell">
            {/* Section Header */}
            <div className="mx-auto max-w-2xl text-center">
              <div className="section-kicker mx-auto">Featured Products</div>
              <h2 className="section-title mt-6">
                สินค้าแนะนำสำหรับฟาร์มยุคใหม่
              </h2>
              <p className="section-copy mt-4">
                คัดสรรอุปกรณ์และระบบที่ทีมฟาร์มเลือกใช้มากที่สุด
                พร้อมรายละเอียดที่ช่วยตัดสินใจได้เร็วขึ้น
              </p>
            </div>

            {/* View All Link */}
            <div className="mt-6 text-center">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#22C55E] transition-colors duration-200 hover:text-[#16A34A]"
              >
                ดูสินค้าทั้งหมด
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Product Grid */}
            <div className="mt-12">
              {isLoading ? (
                <FeaturedProductsSkeleton />
              ) : error ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-2xl border border-slate-100 bg-white px-6 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <AlertCircle size={28} />
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-slate-900">โหลดข้อมูลสินค้าไม่สำเร็จ</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">{error}</p>
                  </div>
                </div>
              ) : featuredProducts.length === 0 ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center gap-4 rounded-2xl border border-slate-100 bg-white px-6 py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                    <Package size={28} />
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-slate-900">ยังไม่มีสินค้าแนะนำ</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      เมื่อมีสินค้าเผยแพร่บนระบบแล้ว หน้านี้จะแสดงรายการเด่นให้อัตโนมัติ
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <SocialProofSection testimonials={settings?.testimonials || []} />
        <CtaSection metrics={metrics} />
      </main>

      <Footer />
    </div>
  );
}
