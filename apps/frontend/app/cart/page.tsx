'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Leaf,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
} from 'lucide-react';

export default function CartPage() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity, clearCart } = useCart();
  const user = useAuthStore((s) => s.user);

  const shippingFee = totalPrice >= 1500 ? 0 : 80;
  const grandTotal = totalPrice + shippingFee;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900">
      <Navbar user={user} />

      <main className="flex-grow">

        {/* ---- Page Header ---- */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <Link href="/" className="hover:text-[#22C55E] transition-colors">หน้าแรก</Link>
            <ChevronRight size={12} />
            <Link href="/products" className="hover:text-[#22C55E] transition-colors">สินค้าทั้งหมด</Link>
            <ChevronRight size={12} />
            <span className="text-slate-600">ตะกร้าสินค้า</span>
          </div>
        </div>

        <section className="max-w-7xl mx-auto px-6 py-10 lg:py-14">

          {/* Page title */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <ShoppingBag size={22} className="text-[#22C55E]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">ตะกร้าสินค้า</h1>
              <p className="text-sm text-slate-400 font-medium mt-0.5">
                {totalItems > 0 ? `${totalItems} ชิ้นรอการสั่งซื้อ` : 'ยังไม่มีสินค้าในตะกร้า'}
              </p>
            </div>
          </div>

          {/* ---- Empty State ---- */}
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-28 text-center bg-white rounded-[3rem] border border-slate-100">
              <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                <Leaf size={40} className="text-[#22C55E] opacity-50" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-3">ตะกร้าของคุณว่างเปล่า</h2>
              <p className="text-slate-400 font-medium max-w-xs leading-relaxed mb-8">
                เลือกสินค้าที่คุณสนใจแล้วกด "เพิ่มลงตะกร้า" หรือ "ซื้อทันที"
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#22C55E] text-white font-black rounded-2xl shadow-lg shadow-green-200 hover:bg-[#1eb054] hover:-translate-y-0.5 transition-all text-sm"
              >
                เลือกดูสินค้า
                <ArrowRight size={18} />
              </Link>
            </div>
          )}

          {/* ---- Main Layout: Items + Summary ---- */}
          {items.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

              {/* ---- Item List (left 2 cols) ---- */}
              <div className="lg:col-span-2 space-y-4">

                {/* Clear all */}
                <div className="flex justify-end">
                  <button
                    onClick={clearCart}
                    className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 size={13} />
                    ล้างตะกร้าทั้งหมด
                  </button>
                </div>

                {/* Items */}
                {items.map((item) => (
                  <CartItemRow
                    key={item.product.id}
                    item={item}
                    onRemove={() => removeItem(item.product.id)}
                    onIncrement={() => updateQuantity(item.product.id, item.quantity + 1)}
                    onDecrement={() => updateQuantity(item.product.id, item.quantity - 1)}
                  />
                ))}

                {/* Continue shopping */}
                <div className="pt-2">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#22C55E] hover:text-[#1eb054] transition-colors"
                  >
                    ← เลือกสินค้าเพิ่มเติม
                  </Link>
                </div>
              </div>

              {/* ---- Order Summary (right col) ---- */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm sticky top-28 space-y-5">
                  <h2 className="text-base font-black text-slate-900">สรุปคำสั่งซื้อ</h2>

                  {/* Line items */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center text-slate-600 font-medium">
                      <span>ราคาสินค้า ({totalItems} ชิ้น)</span>
                      <span className="font-bold">฿{totalPrice.toLocaleString('th-TH')}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 font-medium">
                      <span>ค่าจัดส่ง</span>
                      {shippingFee === 0 ? (
                        <span className="text-[#22C55E] font-black">ฟรี</span>
                      ) : (
                        <span className="font-bold">฿{shippingFee.toLocaleString('th-TH')}</span>
                      )}
                    </div>

                    {/* Free shipping progress */}
                    {shippingFee > 0 && (
                      <div className="bg-emerald-50 rounded-xl p-3 text-xs text-emerald-700 font-bold flex items-center gap-2">
                        <Tag size={13} />
                        เพิ่มอีก ฿{(1500 - totalPrice).toLocaleString('th-TH')} เพื่อรับส่งฟรี!
                      </div>
                    )}
                    {shippingFee === 0 && (
                      <div className="bg-emerald-50 rounded-xl p-3 text-xs text-emerald-700 font-bold flex items-center gap-2">
                        <Truck size={13} />
                        คุณได้รับสิทธิ์จัดส่งฟรี!
                      </div>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                    <span className="font-black text-slate-900">ยอดรวมสุทธิ</span>
                    <span className="text-2xl font-black text-[#22C55E]">
                      ฿{grandTotal.toLocaleString('th-TH')}
                    </span>
                  </div>

                  {/* Checkout button */}
                  <Link
                    id="checkout-btn"
                    href="/checkout"
                    className="w-full py-4 bg-[#22C55E] hover:bg-[#1eb054] text-white font-black text-base rounded-2xl shadow-xl shadow-green-200 flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98] hover:-translate-y-0.5"
                  >
                    สั่งซื้อสินค้า
                    <ArrowRight size={20} />
                  </Link>

                  {/* Trust badges */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { icon: <ShieldCheck size={14} className="text-[#22C55E]" />, text: 'ปลอดภัย' },
                      { icon: <Truck size={14} className="text-blue-500" />, text: 'จัดส่งเร็ว' },
                      { icon: <RotateCcw size={14} className="text-amber-500" />, text: 'คืนได้ 7 วัน' },
                    ].map((b, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 bg-slate-50 rounded-xl py-2.5 px-1">
                        {b.icon}
                        <span className="text-[10px] font-bold text-slate-500">{b.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

// ---- CartItemRow ----------------------------------------------------------

interface CartItemRowProps {
  item: { product: import('../../store/useCartStore').CartProduct; quantity: number };
  onRemove: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

function CartItemRow({ item, onRemove, onIncrement, onDecrement }: CartItemRowProps) {
  const { product, quantity } = item;
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex items-center gap-5 bg-white rounded-[1.75rem] p-4 sm:p-5 border border-slate-100 hover:border-emerald-100 hover:shadow-md transition-all duration-200">
      {/* Thumbnail */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-100">
        {product.mainImageUrl && !imgError ? (
          <img
            src={product.mainImageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <Leaf size={24} className="text-[#22C55E] opacity-40" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-black text-[#22C55E] uppercase tracking-wider">
          {product.category}
        </span>
        <p className="font-black text-slate-800 text-sm sm:text-base leading-snug mt-0.5 line-clamp-2">
          {product.name}
        </p>
        <p className="text-[#22C55E] font-black text-base mt-1">
          ฿{product.price.toLocaleString('th-TH')}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-end gap-3 flex-shrink-0">
        {/* Qty adjuster */}
        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-0.5">
          <button
            onClick={onDecrement}
            aria-label="ลดจำนวน"
            className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
          >
            <Minus size={13} strokeWidth={2.5} />
          </button>
          <span className="w-8 text-center text-sm font-black text-slate-800 tabular-nums">
            {quantity}
          </span>
          <button
            onClick={onIncrement}
            aria-label="เพิ่มจำนวน"
            className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-500 hover:text-[#22C55E] hover:bg-emerald-50 transition-colors shadow-sm"
          >
            <Plus size={13} strokeWidth={2.5} />
          </button>
        </div>

        {/* Line total */}
        <p className="text-right">
          <span className="text-[11px] text-slate-400 font-bold block">รวม</span>
          <span className="font-black text-slate-800">
            ฿{(product.price * quantity).toLocaleString('th-TH')}
          </span>
        </p>

        {/* Remove */}
        <button
          onClick={onRemove}
          aria-label={`ลบ ${product.name}`}
          className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl p-1.5 transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
