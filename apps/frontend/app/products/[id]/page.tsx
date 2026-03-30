'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import {
  ChevronRight,
  ShoppingCart,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  AlertTriangle,
  Leaf,
  Minus,
  Plus,
  ArrowLeft,
  Star,
  Truck,
  RotateCcw,
  Package,
} from 'lucide-react';

// ---- Types ----------------------------------------------------------------

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface IncludedItem {
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

interface TechSpec {
  title: string;
  description: string;
}

interface ProductReview {
  id: string;
  rating: number;
  reviewerName?: string;
  comment?: string;
  createdAt: string;
}

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
  sku?: string | null;
  images?: ProductImage[];
  includedItems?: IncludedItem[] | null;
  techSpecs?: TechSpec[] | null;
  reviews?: ProductReview[];
}

// ---- Constants ------------------------------------------------------------

const API_BASE = 'http://localhost:4000/api';

// ---- Image Gallery --------------------------------------------------------

function ImageGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasImages = images && images.length > 0;

  // Sort: primary image first
  const sorted = hasImages
    ? [...images].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
    : [];

  const activeImage = sorted[activeIndex];

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-[2.5rem] overflow-hidden border border-slate-100 flex items-center justify-center">
        {hasImages ? (
          <img
            src={activeImage.url}
            alt={productName}
            className="w-full h-full object-contain p-6 transition-all duration-300"
          />
        ) : (
          /* Placeholder when no images */
          <div className="flex flex-col items-center justify-center gap-4 text-slate-300">
            <div className="relative">
              <div className="w-40 h-40 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-full flex items-center justify-center shadow-inner">
                <Leaf size={64} className="text-[#22C55E] opacity-40" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center shadow-sm">
                <span className="text-base font-black text-[#22C55E]">K</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-400">Product Image</p>
              <p className="text-[10px] text-slate-300 uppercase tracking-widest mt-1">Coming Soon</p>
            </div>
          </div>
        )}

        {/* Floating brand badge */}
        <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-emerald-100 text-[#22C55E] text-[10px] font-black px-3 py-1.5 rounded-xl shadow-sm uppercase tracking-widest">
          <Leaf size={10} />
          Kbon
        </div>
      </div>

      {/* Thumbnail strip — only shown if multiple images */}
      {sorted.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? 'border-[#22C55E] shadow-md shadow-green-100'
                  : 'border-slate-100 hover:border-slate-300'
              }`}
            >
              <img src={img.url} alt={`${productName} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Trust Badges ---------------------------------------------------------

function TrustBadges({ warranty }: { warranty?: string | null }) {
  const badges = [
    {
      icon: <ShieldCheck size={20} className="text-[#22C55E]" />,
      label: 'การรับประกัน',
      value: warranty && warranty !== 'ไม่มีรับประกัน' ? warranty : 'ไม่มีรับประกัน',
    },
    {
      icon: <Truck size={20} className="text-blue-500" />,
      label: 'จัดส่งฟรี',
      value: 'ทั่วประเทศ',
    },
    {
      icon: <RotateCcw size={20} className="text-amber-500" />,
      label: 'คืนสินค้าได้',
      value: 'ภายใน 7 วัน',
    },
    {
      icon: <Star size={20} className="text-purple-500 fill-purple-500" />,
      label: 'รับประกันคุณภาพ',
      value: 'Kbon Certified',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {badges.map((b, i) => (
        <div key={i} className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3.5">
          <div className="flex-shrink-0 w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
            {b.icon}
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{b.label}</p>
            <p className="text-xs font-black text-slate-700 mt-0.5">{b.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- What's In The Box ----------------------------------------------------

function WhatsInTheBox({ items }: { items: IncludedItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-slate-50 py-16 px-6 mt-12 rounded-[3rem] max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">What's in the box?</h2>
        <div className="w-16 h-1.5 bg-[#22C55E] rounded-full mx-auto mt-4" />
      </div>
      
      {/* Grid mimics the Growee layout with different sized cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {items.map((item, i) => (
          <div 
            key={i} 
            className={`bg-white rounded-[2rem] p-6 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow ${
              i === 0 ? 'col-span-2 row-span-2' : ''
            }`}
          >
            <h3 className={`font-black text-slate-800 ${i === 0 ? 'text-xl' : 'text-base'}`}>{item.title}</h3>
            {item.subtitle && <p className="text-sm text-slate-400 font-medium mb-4">{item.subtitle}</p>}
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="w-full max-w-[200px] h-auto object-contain mt-auto" />
            ) : (
              <div className="flex-1 w-full min-h-[100px] bg-slate-50 rounded-xl mt-4 flex items-center justify-center">
                <Package size={32} className="text-slate-300" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ---- Tech Specs -----------------------------------------------------------

function TechSpecs({ specs }: { specs: TechSpec[] }) {
  if (!specs || specs.length === 0) return null;

  return (
    <section className="bg-white py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">Tech Specs</h2>
        <div className="w-16 h-1.5 bg-[#22C55E] rounded-full mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
        {specs.map((spec, i) => (
          <div key={i}>
            <h3 className="font-bold text-slate-800 mb-1">{spec.title}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{spec.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---- Reviews --------------------------------------------------------------

function ReviewsList({ reviews }: { reviews: ProductReview[] }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-black text-slate-800 tracking-tight">Reviews</h2>
        <div className="w-16 h-1.5 bg-[#22C55E] rounded-full mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'} 
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {new Date(review.createdAt).toLocaleDateString('th-TH')}
              </span>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="font-black text-slate-800">{review.reviewerName || 'Anonymous'}</span>
              <span className="bg-emerald-50 text-[#22C55E] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={10} /> Verified Owner
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              {review.comment}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---- Page -----------------------------------------------------------------

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Restore user session
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/products/${id}`);
        if (res.status === 404) {
          setError('not_found');
          return;
        }
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data: Product = await res.json();

        // Security: hide unpublished products from public
        if (!data.isPublished) {
          setError('not_found');
          return;
        }

        setProduct(data);
      } catch (err) {
        console.warn('Network or generic error fetching product:', err);
        setError('load_error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Quantity helpers
  const incrementQty = () => {
    if (product && quantity < product.stock) setQuantity((q) => q + 1);
  };
  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1));

  // Derived values
  const hasDiscount = product?.originalPrice != null && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product!.originalPrice! - product!.price) / product!.originalPrice!) * 100)
    : 0;

  // ---- Loading state ----
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <Navbar user={user} />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-slate-400">
            <Loader2 size={44} className="animate-spin text-[#22C55E]" />
            <p className="font-bold text-sm animate-pulse">กำลังโหลดข้อมูลสินค้า...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ---- Not found / error state ----
  if (error) {
    const isNotFound = error === 'not_found';
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <Navbar user={user} />
        <main className="flex-grow flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="w-28 h-28 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              {isNotFound ? (
                <Package size={44} className="text-slate-300" />
              ) : (
                <AlertTriangle size={44} className="text-amber-400" />
              )}
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-3">
              {isNotFound ? '404' : 'เกิดข้อผิดพลาด'}
            </h1>
            <p className="text-slate-400 font-medium mb-8 leading-relaxed">
              {isNotFound
                ? 'ไม่พบสินค้าที่คุณกำลังหา อาจถูกลบหรือยังไม่เปิดให้บริการ'
                : 'ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาลองใหม่ภายหลัง'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/products"
                className="px-8 py-3.5 bg-[#22C55E] text-white rounded-2xl font-black text-sm shadow-lg shadow-green-200 hover:bg-[#1eb054] transition-all"
              >
                ← ดูสินค้าทั้งหมด
              </Link>
              {!isNotFound && (
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-3.5 bg-white border border-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all"
                >
                  ลองใหม่
                </button>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  // ---- Main render ----
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900">
      <Navbar user={user} />

      <main className="flex-grow">

        {/* Breadcrumb bar */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <Link href="/" className="hover:text-[#22C55E] transition-colors">หน้าแรก</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="hover:text-[#22C55E] transition-colors">สินค้าทั้งหมด</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600 truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>

        {/* Back button (mobile) */}
        <div className="md:hidden max-w-7xl mx-auto px-6 pt-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#22C55E] transition-colors"
          >
            <ArrowLeft size={16} /> กลับ
          </button>
        </div>

        {/* ===================== Two-column layout ===================== */}
        <section className="max-w-7xl mx-auto px-6 py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

            {/* ---- Left: Image Gallery ---- */}
            <div className="w-full">
              <ImageGallery images={product.images ?? []} productName={product.name} />
            </div>

            {/* ---- Right: Product Details (sticky on desktop) ---- */}
            <div className="lg:sticky lg:top-28 lg:self-start space-y-7">

              {/* Category + Badges row */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#22C55E] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                  {product.category}
                </span>
                {product.stock === 0 && (
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100">
                    สินค้าหมด
                  </span>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                    เหลือน้อย · {product.stock} ชิ้น
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-[#22C55E] px-3 py-1.5 rounded-xl shadow-sm shadow-green-200">
                    ลด {discountPct}%
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                {product.name}
              </h1>

              {/* SKU */}
              {product.sku && (
                <p className="text-[11px] font-mono text-slate-400">SKU: {product.sku}</p>
              )}

              {/* Key features list */}
              {product.features.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                    คุณสมบัติเด่น
                  </p>
                  {product.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle2 size={13} className="text-[#22C55E]" />
                      </div>
                      <span className="text-sm text-slate-700 font-medium leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                    รายละเอียดสินค้า
                  </p>
                  <p className="text-sm text-slate-600 leading-[1.9] font-medium">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-slate-100" />

              {/* Pricing */}
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ราคา</p>
                  <p className="text-4xl font-black text-[#22C55E] tracking-tight">
                    ฿{product.price.toLocaleString('th-TH')}
                  </p>
                </div>
                {hasDiscount && (
                  <div className="pb-1">
                    <p className="text-xl text-slate-400 line-through font-medium">
                      ฿{product.originalPrice!.toLocaleString('th-TH')}
                    </p>
                    <p className="text-xs font-black text-[#22C55E] text-right">
                      ประหยัด ฿{(product.originalPrice! - product.price).toLocaleString('th-TH')}
                    </p>
                  </div>
                )}
              </div>

              {/* Quantity selector */}
              {product.stock > 0 && (
                <div className="flex items-center gap-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">จำนวน</p>
                  <div className="flex items-center gap-1 bg-slate-100 rounded-2xl p-1">
                    <button
                      onClick={decrementQty}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-[#22C55E] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-black text-slate-800 text-lg tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQty}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-[#22C55E] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">มีสินค้า {product.stock} ชิ้น</p>
                </div>
              )}

              {/* Add to cart button */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  disabled={product.stock === 0}
                  className={`flex-1 py-4 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all duration-300 ${
                    product.stock === 0
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-[#22C55E] text-white shadow-xl shadow-green-200 hover:bg-[#1eb054] hover:-translate-y-0.5 hover:shadow-green-300 active:scale-[0.98]'
                  }`}
                >
                  <ShoppingCart size={20} strokeWidth={2.5} />
                  {product.stock === 0 ? 'สินค้าหมด' : 'เพิ่มลงตะกร้า'}
                </button>

                <button
                  disabled={product.stock === 0}
                  className={`sm:w-auto px-6 py-4 rounded-2xl font-black text-sm border-2 transition-all ${
                    product.stock === 0
                      ? 'border-slate-100 text-slate-300 cursor-not-allowed'
                      : 'border-[#22C55E] text-[#22C55E] hover:bg-emerald-50 active:scale-[0.98]'
                  }`}
                >
                  สั่งซื้อทันที
                </button>
              </div>

              {/* Trust badges */}
              <TrustBadges warranty={product.warranty} />

            </div>
          </div>
        </section>

        {/* ===================== What's in the Box ===================== */}
        {product.includedItems && <WhatsInTheBox items={product.includedItems} />}

        {/* ===================== Tech Specs ===================== */}
        {product.techSpecs && <TechSpecs specs={product.techSpecs} />}

        {/* ===================== Reviews ===================== */}
        {product.reviews && product.reviews.length > 0 && <ReviewsList reviews={product.reviews} />}

        {/* ===================== Related / Extra info section ===================== */}
        <section className="bg-white border-t border-slate-100 py-16 px-6 mt-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">สนใจสินค้าอื่น?</h2>
                <div className="w-12 h-1.5 bg-[#22C55E] rounded-full mt-3" />
              </div>
              <Link
                href="/products"
                className="flex items-center gap-2 text-sm font-black text-[#22C55E] hover:text-[#1eb054] transition-colors"
              >
                ดูสินค้าทั้งหมด <ChevronRight size={16} />
              </Link>
            </div>

            {/* Simple CTA card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 md:p-16 text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#22C55E]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                  <Leaf size={12} />
                  Kbon Hydroponics
                </div>
                <h3 className="text-3xl font-black text-white mb-3 tracking-tight">ระบบอัตโนมัติเพื่อเกษตรกรยุคใหม่</h3>
                <p className="text-slate-400 font-medium mb-8 max-w-md mx-auto">ควบคุม pH และจ่ายปุ๋ยอัตโนมัติ แม่นยำทุกหยด จากทุกที่ผ่านมือถือ</p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-[#22C55E] text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-green-900/30 hover:bg-[#1eb054] hover:-translate-y-0.5 transition-all text-sm"
                >
                  <ShoppingCart size={18} />
                  เลือกซื้อสินค้า
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
