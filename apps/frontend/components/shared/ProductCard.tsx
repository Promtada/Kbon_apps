'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Star, Leaf, Check, Zap } from 'lucide-react';
import { useCart, CartProduct } from '../../store/useCartStore';

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

export function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const hasDiscount = product.originalPrice != null && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0 || added) return;
    addItem(product as CartProduct, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) return;
    addItem(product as CartProduct, 1);
    router.push('/cart');
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
    >
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        {hasDiscount && (
          <div className="absolute left-3 top-3 z-10 rounded-lg bg-[#22C55E] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            -{discountPct}%
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute right-3 top-3 z-10 rounded-lg bg-rose-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Sold Out
          </div>
        )}

        {product.mainImageUrl && !imgError ? (
          <img
            src={product.mainImageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-200">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <Leaf size={28} className="text-emerald-300" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
              No Image
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category + Warranty */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
            {product.category}
          </span>
          {product.warranty && product.warranty !== 'ไม่มีรับประกัน' && (
            <div className="flex items-center gap-1 text-slate-400">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-medium">ประกัน {product.warranty}</span>
            </div>
          )}
        </div>

        {/* Name */}
        <h3 className="text-lg font-extrabold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-[#22C55E]">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Features */}
        {product.features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {product.features.slice(0, 2).map((feature) => (
              <span
                key={feature}
                className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Price + Actions */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              {hasDiscount && (
                <p className="mb-0.5 text-[11px] font-medium text-slate-400 line-through">
                  ฿{product.originalPrice?.toLocaleString('th-TH')}
                </p>
              )}
              <p className="font-display text-2xl font-black tracking-tight text-[#22C55E]">
                ฿{product.price.toLocaleString('th-TH')}
              </p>
            </div>

            <button
              id={`add-to-cart-${product.id}`}
              onClick={handleAddToCart}
              aria-label={`เพิ่ม ${product.name} ลงตะกร้า`}
              disabled={product.stock === 0}
              className={`relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl transition-all duration-300 ${
                product.stock === 0
                  ? 'cursor-not-allowed bg-slate-100 text-slate-300'
                  : added
                  ? 'scale-110 bg-[#22C55E] text-white shadow-[0_8px_20px_rgba(34,197,94,0.25)]'
                  : 'bg-slate-50 text-slate-600 hover:bg-[#22C55E] hover:text-white hover:shadow-[0_8px_20px_rgba(34,197,94,0.25)]'
              }`}
            >
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
                  added ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                }`}
              >
                <Check size={18} strokeWidth={3} />
              </span>
              <span
                className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${
                  added ? 'scale-125 opacity-0' : 'scale-100 opacity-100'
                }`}
              >
                <ShoppingCart size={18} strokeWidth={2.2} />
              </span>
            </button>
          </div>

          {product.stock > 0 && (
            <button
              id={`buy-now-${product.id}`}
              onClick={handleBuyNow}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-600 transition-all duration-200 hover:border-[#22C55E] hover:bg-[#22C55E] hover:text-white hover:shadow-[0_8px_20px_rgba(34,197,94,0.2)]"
            >
              <Zap size={12} strokeWidth={2.5} />
              ซื้อทันที
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
