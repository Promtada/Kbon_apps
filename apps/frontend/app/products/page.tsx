'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  ShoppingCart,
  Search,
  SlidersHorizontal,
  Leaf,
  Loader2,
  AlertCircle,
  ChevronRight,
  Star,
  Package,
} from 'lucide-react';

// ---- Types ----------------------------------------------------------------

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
}

// ---- Constants ------------------------------------------------------------

const API_BASE = 'http://localhost:4000/api';

const CATEGORIES = ['ทั้งหมด', 'Automation', 'Set', 'Nutrient', 'Hardware'];

const CATEGORY_LABELS: Record<string, string> = {
  'ทั้งหมด': 'ทั้งหมด',
  Automation: 'Automation System',
  Set: 'Combo Set',
  Nutrient: 'Nutrients & pH',
  Hardware: 'Hardware Parts',
};

// ---- Sub-components -------------------------------------------------------

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] p-3 border border-slate-100 animate-pulse">
      <div className="aspect-square bg-slate-100 rounded-[2rem] mb-5" />
      <div className="px-2 pb-2 space-y-3">
        <div className="h-3 bg-slate-100 rounded-full w-1/3" />
        <div className="h-5 bg-slate-100 rounded-full w-4/5" />
        <div className="h-4 bg-slate-100 rounded-full w-full" />
        <div className="h-4 bg-slate-100 rounded-full w-2/3" />
        <div className="h-12 bg-slate-100 rounded-2xl mt-4" />
      </div>
    </div>
  );
}

function EmptyState({ searchTerm, category }: { searchTerm: string; category: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-28 text-center">
      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
        <Package size={36} className="text-[#22C55E]" />
      </div>
      <h3 className="text-xl font-black text-slate-700 mb-2">ไม่พบสินค้า</h3>
      <p className="text-slate-400 text-sm max-w-xs">
        {searchTerm
          ? `ไม่พบสินค้าที่ตรงกับ "${searchTerm}" ในหมวด ${CATEGORY_LABELS[category]}`
          : `ยังไม่มีสินค้าในหมวด ${CATEGORY_LABELS[category]}`}
      </p>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const hasDiscount =
    product.originalPrice != null && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-[#F8FAFC] rounded-[2.5rem] p-3 border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-2xl hover:shadow-emerald-100/60 transition-all duration-500 flex flex-col"
    >
      {/* Image area */}
      <div className="relative aspect-square bg-white rounded-[2rem] overflow-hidden mb-4 flex items-center justify-center border border-slate-100 group-hover:border-emerald-100 transition-colors">
        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute top-4 left-4 z-10 bg-[#22C55E] text-white text-[10px] font-black py-1.5 px-3 rounded-xl shadow-sm uppercase tracking-widest">
            -{discountPct}%
          </div>
        )}
        {/* Stock badge */}
        {product.stock === 0 && (
          <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-[10px] font-black py-1.5 px-3 rounded-xl shadow-sm uppercase tracking-widest">
            หมด
          </div>
        )}
        {/* Product image placeholder */}
        <div className="flex flex-col items-center gap-3 text-slate-300 group-hover:scale-105 transition-transform duration-500">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full flex items-center justify-center shadow-inner">
              <Leaf size={40} className="text-[#22C55E] opacity-60" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-black text-[#22C55E]">K</span>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Product Image</span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-2 pb-2">
        {/* Category tag */}
        <span className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] mb-2">
          {product.category}
        </span>

        {/* Product name */}
        <h3 className="font-black text-base text-slate-800 mb-1.5 leading-snug line-clamp-2 min-h-[2.8rem]">
          {product.name}
        </h3>

        {/* Description snippet */}
        {product.description && (
          <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-3 font-medium">
            {product.description}
          </p>
        )}

        {/* Features (first 2 only) */}
        {product.features.length > 0 && (
          <ul className="space-y-1 mb-4">
            {product.features.slice(0, 2).map((f, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-500 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] mt-1 flex-shrink-0" />
                <span className="line-clamp-1">{f}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-4 mt-2">
          <span className="text-2xl font-black text-[#22C55E]">
            ฿{product.price.toLocaleString('th-TH')}
          </span>
          {hasDiscount && (
            <span className="text-sm text-slate-400 line-through font-medium">
              ฿{product.originalPrice!.toLocaleString('th-TH')}
            </span>
          )}
        </div>

        {/* Warranty */}
        {product.warranty && product.warranty !== 'ไม่มีรับประกัน' && (
          <div className="flex items-center gap-1.5 mb-4">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-[10px] text-slate-400 font-bold">รับประกัน {product.warranty}</span>
          </div>
        )}

        {/* CTA — styled div, outer Link handles navigation */}
        <div
          className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
            product.stock === 0
              ? 'bg-slate-100 text-slate-400'
              : 'bg-white border-2 border-slate-100 text-slate-600 group-hover:bg-[#22C55E] group-hover:text-white group-hover:border-[#22C55E] group-hover:shadow-lg group-hover:shadow-green-200 group-hover:-translate-y-0.5'
          }`}
        >
          {product.stock === 0 ? (
            'สินค้าหมด'
          ) : (
            <>
              <ShoppingCart size={16} />
              ดูรายละเอียด
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// ---- Page -----------------------------------------------------------------

export default function ProductsPage() {
  const [user, setUser] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');

  // Restore user session
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Fetch published products
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data: Product[] = await res.json();
      // Filter only published products client-side
      setAllProducts(data.filter((p) => p.isPublished));
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาลองใหม่ภายหลัง');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter logic
  const filteredProducts = allProducts.filter((p) => {
    const matchesCategory = activeCategory === 'ทั้งหมด' || p.category === activeCategory;
    const matchesSearch =
      searchTerm === '' ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900">
      <Navbar user={user} />

      <main className="flex-grow">

        {/* ---- Hero Banner ---- */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-6">
          {/* Decorative blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#22C55E]/20 rounded-full blur-[120px]" />
            <div className="absolute -bottom-16 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">
              <Link href="/" className="hover:text-[#22C55E] transition-colors">หน้าแรก</Link>
              <ChevronRight size={14} />
              <span className="text-[#22C55E]">สินค้าทั้งหมด</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-5">
                  <Leaf size={12} />
                  Kbon Hydroponics Store
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.1]">
                  สินค้าทั้งหมด
                  <span className="block text-[#22C55E] mt-1">Smart Farming Collection</span>
                </h1>
                <p className="text-slate-400 mt-4 text-base font-medium max-w-lg leading-relaxed">
                  อุปกรณ์ไฮโดรโปนิกส์อัจฉริยะ ออกแบบมาเพื่อเกษตรกรยุคใหม่
                </p>
              </div>

              {/* Stats */}
              {!isLoading && (
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-black text-white">{allProducts.length}</p>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">สินค้า</p>
                  </div>
                  <div className="w-px bg-slate-700" />
                  <div className="text-center">
                    <p className="text-3xl font-black text-white">{CATEGORIES.length - 1}</p>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">หมวดหมู่</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ---- Filters & Grid ---- */}
        <section className="max-w-7xl mx-auto px-6 py-12">

          {/* Search + Filter bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 shadow-sm placeholder:text-slate-300"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-shrink-0">
              <SlidersHorizontal size={16} className="text-slate-300 flex-shrink-0 ml-1" />
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    activeCategory === cat
                      ? 'bg-[#22C55E] text-white shadow-md shadow-green-200'
                      : 'bg-white text-slate-500 border border-slate-100 hover:border-[#22C55E]/30 hover:text-[#22C55E]'
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Result count */}
          {!isLoading && !error && (
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-6">
              แสดง {filteredProducts.length} รายการ
              {activeCategory !== 'ทั้งหมด' && ` · ${CATEGORY_LABELS[activeCategory]}`}
              {searchTerm && ` · ค้นหา "${searchTerm}"`}
            </p>
          )}

          {/* Error state */}
          {error && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle size={32} className="text-red-400" />
              </div>
              <h3 className="font-black text-slate-700 text-lg">โหลดสินค้าไม่สำเร็จ</h3>
              <p className="text-slate-400 text-sm max-w-xs text-center">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-2 px-6 py-3 bg-[#22C55E] text-white rounded-2xl font-black text-sm hover:bg-[#1eb054] transition-colors shadow-lg shadow-green-200"
              >
                ลองใหม่
              </button>
            </div>
          )}

          {/* Product grid */}
          {!error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
                : filteredProducts.length === 0
                ? <EmptyState searchTerm={searchTerm} category={activeCategory} />
                : filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>
          )}

        </section>
      </main>

      <Footer />
    </div>
  );
}
