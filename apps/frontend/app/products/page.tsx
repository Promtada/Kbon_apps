'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ProductCard } from '../../components/shared/ProductCard';
import {
  Search,
  Loader2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
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
  mainImageUrl?: string | null;
}

// ---- Constants ------------------------------------------------------------

const API_BASE = 'http://localhost:4000/api';
const ITEMS_PER_PAGE = 8;

const CATEGORIES = ['ทั้งหมด', 'Automation', 'Set', 'Nutrient', 'Hardware'];

const CATEGORY_LABELS: Record<string, string> = {
  'ทั้งหมด': 'ทั้งหมด',
  Automation: 'Automation',
  Set: 'Combo Set',
  Nutrient: 'Nutrients & pH',
  Hardware: 'Hardware',
};

// ---- Sub-components -------------------------------------------------------

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] p-4 border border-slate-100 animate-pulse h-full flex flex-col">
      <div className="aspect-square bg-slate-50 rounded-[2rem] mb-6" />
      <div className="flex-1 space-y-4 px-2">
        <div className="h-4 bg-slate-100 rounded-full w-1/3" />
        <div className="h-6 bg-slate-100 rounded-full w-4/5" />
        <div className="h-4 bg-slate-100 rounded-full w-full" />
        <div className="h-4 bg-slate-100 rounded-full w-2/3 mt-auto" />
      </div>
      <div className="pt-4 mt-6 border-t border-slate-50 flex justify-between items-center px-2">
        <div className="h-8 bg-slate-100 rounded-full w-1/3" />
        <div className="h-10 w-10 bg-slate-100 rounded-2xl" />
      </div>
    </div>
  );
}

function EmptyState({ searchTerm, category }: { searchTerm: string; category: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-28 text-center bg-white rounded-[3rem] border border-slate-100">
      <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
        <Package size={36} className="text-[#22C55E]" />
      </div>
      <h3 className="text-2xl font-black text-slate-800 mb-2">ไม่พบสินค้า</h3>
      <p className="text-slate-500 font-medium max-w-md">
        {searchTerm
          ? `ไม่พบสินค้าที่ตรงกับ "${searchTerm}" ในหมวด ${CATEGORY_LABELS[category]}`
          : `ยังไม่มีสินค้าในหมวด ${CATEGORY_LABELS[category]}`}
      </p>
    </div>
  );
}

// ---- Pagination Component -------------------------------------------------

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build page number array with ellipsis
  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = [];
    const delta = 1; // pages around current

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (rangeStart > 2) pages.push('...');
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (rangeEnd < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      aria-label="Product pagination"
      className="flex items-center justify-center gap-2 mt-14"
    >
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold text-slate-600 bg-white border border-slate-200 shadow-sm
                   hover:border-[#22C55E] hover:text-[#22C55E] hover:shadow-md
                   disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:hover:shadow-sm
                   transition-all duration-200"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">ก่อนหน้า</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {pageNumbers.map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="w-10 h-10 flex items-center justify-center text-slate-400 font-bold text-sm"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              aria-current={currentPage === page ? 'page' : undefined}
              className={`w-10 h-10 rounded-full text-sm font-black transition-all duration-200 ${
                currentPage === page
                  ? 'bg-[#22C55E] text-white shadow-lg shadow-[#22C55E]/30 scale-110'
                  : 'bg-white text-slate-600 border border-slate-200 shadow-sm hover:border-[#22C55E] hover:text-[#22C55E] hover:shadow-md'
              }`}
            >
              {page}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold text-slate-600 bg-white border border-slate-200 shadow-sm
                   hover:border-[#22C55E] hover:text-[#22C55E] hover:shadow-md
                   disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200 disabled:hover:text-slate-600 disabled:hover:shadow-sm
                   transition-all duration-200"
      >
        <span className="hidden sm:inline">ถัดไป</span>
        <ChevronRight size={16} />
      </button>
    </nav>
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
  const [currentPage, setCurrentPage] = useState(1);

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

  // Reset to page 1 whenever filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

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

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll back to the grid top
    document.getElementById('product-grid-anchor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900">
      <Navbar user={user} />

      <main className="flex-grow">

        {/* ---- Hero Banner ---- */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-16 px-6">
          {/* Decorative blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#22C55E]/20 rounded-full blur-[120px]" />
            <div className="absolute -bottom-16 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-10">
              <Link href="/" className="hover:text-[#22C55E] transition-colors">หน้าแรก</Link>
              <ChevronRight size={14} />
              <span className="text-[#22C55E]">สินค้าทั้งหมด</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                  Kbon Store
                  <span className="block text-[#22C55E] mt-2">Smart Farming Gear</span>
                </h1>
                <p className="text-slate-400 mt-5 text-lg font-medium max-w-lg leading-relaxed">
                  Discover high-end hydroponic automation, absolute precision nutrients, and professional tier hardware for modern growers.
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

        {/* ---- Inline Search + Filter Bar ---- */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

              {/* Search Input */}
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                <input
                  type="text"
                  id="product-search"
                  placeholder="ค้นหาสินค้า, หมวดหมู่, อุปกรณ์..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-full py-3 pl-11 pr-5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#22C55E]/20 focus:border-[#22C55E] shadow-sm placeholder:text-slate-400 placeholder:font-medium transition-all"
                />
              </div>

              {/* Divider (desktop only) */}
              <div className="hidden sm:block w-px h-8 bg-slate-200 flex-shrink-0" />

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 flex-shrink-0" style={{ scrollbarWidth: 'none' }}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                      activeCategory === cat
                        ? 'bg-[#22C55E] text-white shadow-md shadow-[#22C55E]/30 scale-105'
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                    }`}
                  >
                    {CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* ---- Filters & Grid ---- */}
        <section
          id="product-grid-anchor"
          className="max-w-7xl mx-auto px-6 py-12 lg:py-16 scroll-mt-20"
        >

          {/* Result count */}
          {!isLoading && !error && (
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px bg-slate-200 flex-1" />
              <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest whitespace-nowrap px-4 bg-white border border-slate-200 rounded-full py-2">
                พบ {filteredProducts.length} รายการ
                {activeCategory !== 'ทั้งหมด' && ` · ${CATEGORY_LABELS[activeCategory]}`}
                {totalPages > 1 && ` · หน้า ${currentPage}/${totalPages}`}
              </p>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
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
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-300"
              style={{ minHeight: isLoading ? 'auto' : undefined }}
            >
              {isLoading
                ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => <ProductCardSkeleton key={i} />)
                : paginatedProducts.length === 0
                ? <EmptyState searchTerm={searchTerm} category={activeCategory} />
                : paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && filteredProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

        </section>
      </main>

      <Footer />
    </div>
  );
}
