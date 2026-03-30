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
      className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-100/60 transition-all duration-500 flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative w-full aspect-square bg-slate-50 rounded-[2rem] overflow-hidden mb-6 flex items-center justify-center group-hover:bg-white transition-colors">
        {hasDiscount && (
          <div className="absolute top-4 left-4 z-10 bg-[#22C55E] text-white text-[11px] font-black py-1.5 px-3.5 rounded-xl shadow-md uppercase tracking-widest leading-none">
            -{discountPct}%
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-[11px] font-black py-1.5 px-3.5 rounded-xl shadow-md uppercase tracking-widest leading-none">
            Sold Out
          </div>
        )}

        {product.mainImageUrl && !imgError ? (
          <img
            src={product.mainImageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-emerald-100 group-hover:scale-105 transition-transform duration-500">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center shadow-inner">
              <Leaf size={32} className="text-[#22C55E] opacity-70" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">No Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#22C55E] bg-emerald-50 px-2.5 py-1 rounded-lg">
            {product.category}
          </span>
          {product.warranty && product.warranty !== 'ไม่มีรับประกัน' && (
            <div className="flex items-center gap-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-[10px] text-slate-400 font-bold tracking-tight">ประกัน {product.warranty}</span>
            </div>
          )}
        </div>

        <h3 className="font-extrabold text-[17px] text-slate-800 mb-2 leading-snug line-clamp-2 group-hover:text-[#22C55E] transition-colors">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-5 font-medium flex-1">
            {product.description}
          </p>
        )}

        {/* Price & Actions */}
        <div className="mt-auto pt-4 border-t border-slate-50">
          {/* Price row */}
          <div className="flex items-end justify-between mb-3">
            <div>
              {hasDiscount && (
                <p className="text-[11px] text-slate-400 line-through font-bold mb-0.5">
                  ฿{product.originalPrice?.toLocaleString('th-TH')}
                </p>
              )}
              <p className="text-2xl font-black text-[#22C55E] leading-none tracking-tight">
                ฿{product.price.toLocaleString('th-TH')}
              </p>
            </div>

            {/* Add to Cart button */}
            <button
              id={`add-to-cart-${product.id}`}
              onClick={handleAddToCart}
              aria-label={`เพิ่ม ${product.name} ลงตะกร้า`}
              disabled={product.stock === 0}
              className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm overflow-hidden ${
                product.stock === 0
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  : added
                  ? 'bg-[#22C55E] text-white shadow-lg shadow-green-200 scale-110'
                  : 'bg-slate-50 text-[#22C55E] group-hover:bg-[#22C55E] group-hover:text-white group-hover:shadow-lg group-hover:shadow-green-200 group-hover:-translate-y-1'
              }`}
            >
              <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${added ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
                <Check size={20} strokeWidth={3} />
              </span>
              <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${added ? 'opacity-0 scale-125' : 'opacity-100 scale-100'}`}>
                <ShoppingCart size={20} strokeWidth={2.5} />
              </span>
            </button>
          </div>

          {/* Buy Now link — only shown when in stock */}
          {product.stock > 0 && (
            <button
              id={`buy-now-${product.id}`}
              onClick={handleBuyNow}
              className="w-full py-2 rounded-xl border border-[#22C55E]/30 text-[#22C55E] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#22C55E] hover:text-white hover:border-[#22C55E] hover:shadow-md hover:shadow-green-200 transition-all duration-200"
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
