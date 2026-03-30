'use client';

import React, { useEffect, useRef } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Leaf, ArrowRight } from 'lucide-react';
import { useCart } from '../../store/useCartStore';

export default function CartDrawer() {
  const { items, isOpen, totalItems, totalPrice, removeItem, updateQuantity, closeCart, clearCart } =
    useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Trap focus / close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeCart();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, closeCart]);

  // Prevent body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      {/* ---- Backdrop ---- */}
      <div
        onClick={closeCart}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* ---- Drawer Panel ---- */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-label="ตะกร้าสินค้า"
        aria-modal="true"
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ---- Header ---- */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <ShoppingBag size={18} className="text-[#22C55E]" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">ตะกร้าสินค้า</h2>
              <p className="text-[11px] text-slate-400 font-bold">
                {totalItems > 0 ? `${totalItems} ชิ้น` : 'ยังไม่มีสินค้า'}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            id="cart-drawer-close"
            aria-label="ปิดตะกร้า"
            className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        {/* ---- Item List ---- */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {items.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center pb-10">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center">
                <Leaf size={32} className="text-[#22C55E] opacity-60" />
              </div>
              <p className="font-black text-slate-700 text-lg">ตะกร้าว่างเปล่า</p>
              <p className="text-slate-400 text-sm font-medium max-w-[200px]">
                เพิ่มสินค้าจากหน้าร้านเพื่อเริ่มต้นสั่งซื้อ
              </p>
              <button
                onClick={closeCart}
                className="mt-2 px-6 py-3 bg-[#22C55E] text-white font-black text-sm rounded-2xl hover:bg-[#1eb054] transition-colors shadow-lg shadow-green-200"
              >
                เลือกสินค้า
              </button>
            </div>
          ) : (
            items.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                onRemove={() => removeItem(item.product.id)}
                onIncrement={() => updateQuantity(item.product.id, item.quantity + 1)}
                onDecrement={() => updateQuantity(item.product.id, item.quantity - 1)}
              />
            ))
          )}
        </div>

        {/* ---- Footer ---- */}
        {items.length > 0 && (
          <div className="border-t border-slate-100 px-6 pt-4 pb-6 space-y-4">
            {/* Subtotal row */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500">ยอดรวมทั้งหมด</span>
              <span className="text-2xl font-black text-slate-900">
                ฿{totalPrice.toLocaleString('th-TH')}
              </span>
            </div>

            {/* Note */}
            <p className="text-[11px] text-slate-400 font-medium">
              ราคายังไม่รวมค่าจัดส่ง · คำนวณขั้นตอนถัดไป
            </p>

            {/* Checkout Button */}
            <button
              id="cart-checkout-btn"
              className="w-full py-4 bg-[#22C55E] hover:bg-[#1eb054] text-white font-black text-base rounded-2xl shadow-xl shadow-green-200 flex items-center justify-center gap-3 transition-all duration-200 active:scale-[0.98]"
            >
              สั่งซื้อสินค้า
              <ArrowRight size={20} />
            </button>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="w-full py-2.5 text-slate-400 hover:text-red-500 font-bold text-xs tracking-wide transition-colors"
            >
              ล้างตะกร้าทั้งหมด
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ---- CartItemRow Sub-component --------------------------------------------

interface CartItemRowProps {
  item: { product: import('../../store/useCartStore').CartProduct; quantity: number };
  onRemove: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

function CartItemRow({ item, onRemove, onIncrement, onDecrement }: CartItemRowProps) {
  const { product, quantity } = item;
  const [imgError, setImgError] = React.useState(false);

  return (
    <div className="flex items-start gap-4 p-3 bg-slate-50 rounded-2xl group hover:bg-white hover:shadow-md transition-all duration-200 border border-transparent hover:border-slate-100">
      {/* Thumbnail */}
      <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-100">
        {product.mainImageUrl && !imgError ? (
          <img
            src={product.mainImageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <Leaf size={20} className="text-[#22C55E] opacity-50" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-black text-[#22C55E] uppercase tracking-wider mb-0.5">
          {product.category}
        </p>
        <p className="text-sm font-black text-slate-800 leading-snug line-clamp-2 mb-2">
          {product.name}
        </p>

        <div className="flex items-center justify-between gap-2">
          {/* Qty adjuster */}
          <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-0.5">
            <button
              onClick={onDecrement}
              aria-label="ลดจำนวน"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-red-500 transition-colors"
            >
              <Minus size={13} strokeWidth={2.5} />
            </button>
            <span className="w-7 text-center text-sm font-black text-slate-800">{quantity}</span>
            <button
              onClick={onIncrement}
              aria-label="เพิ่มจำนวน"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-emerald-50 hover:text-[#22C55E] transition-colors"
            >
              <Plus size={13} strokeWidth={2.5} />
            </button>
          </div>

          {/* Line total */}
          <p className="text-base font-black text-[#22C55E]">
            ฿{(product.price * quantity).toLocaleString('th-TH')}
          </p>
        </div>
      </div>

      {/* Remove */}
      <button
        onClick={onRemove}
        aria-label={`ลบ ${product.name}`}
        className="w-8 h-8 flex-shrink-0 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors mt-0.5"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
