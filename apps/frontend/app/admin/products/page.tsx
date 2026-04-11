'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Loader2, PackageX, Package, CheckCircle2, XCircle } from 'lucide-react';

// ---- Type ----------------------------------------------------------------

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
  createdAt: string;
  updatedAt: string;
}

// ---- Component -----------------------------------------------------------

import { API_BASE } from '../../../lib/axios';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ---------- Fetch ----------
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setFetchError('ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาตรวจสอบว่า Backend กำลังทำงานอยู่');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ---------- Delete ----------
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${name}"?\nการกระทำนี้ไม่สามารถยกเลิกได้`)) return;
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      // Optimistic UI update — remove from local state
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('ไม่สามารถลบสินค้าได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  // ---------- Status toggle (optimistic) ----------
  const handleToggleStatus = async (product: Product) => {
    const newStatus = !product.isPublished;

    // Flip locally first for instant feedback
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, isPublished: newStatus } : p)),
    );

    try {
      const res = await fetch(`${API_BASE}/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: newStatus }),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
    } catch (error) {
      // Revert on failure
      console.error('Failed to toggle status:', error);
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isPublished: product.isPublished } : p)),
      );
      alert('ไม่สามารถเปลี่ยนสถานะได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  // ---------- Filter ----------
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ---------- Render ----------
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">จัดการสินค้า</h1>
          <p className="text-slate-400 text-sm mt-1">
            {isLoading
              ? 'กำลังโหลด...'
              : `จำนวนสินค้าทั้งหมด ${products.length} รายการ`}
          </p>
        </div>
        <Link
          href="/admin/products/create"
          className="bg-[#22C55E] text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-green-200 hover:bg-[#1eb054] hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
        >
          <Plus size={18} strokeWidth={3} /> เพิ่มสินค้าใหม่
        </Link>
      </div>

      {/* --- Search Bar --- */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input
            type="text"
            placeholder="ค้นหาชื่อสินค้า, หมวดหมู่, หรือ รหัส..."
            className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#22C55E]/20 outline-none disabled:opacity-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {/* Refresh button */}
        <button
          onClick={fetchProducts}
          disabled={isLoading}
          className="p-3 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors disabled:opacity-40"
          title="รีเฟรชข้อมูล"
        >
          <Loader2 size={18} className={isLoading ? 'animate-spin text-[#22C55E]' : ''} />
        </button>
      </div>

      {/* --- Products Table --- */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">รหัส</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">รูปภาพ</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">ชื่อสินค้า</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">หมวดหมู่</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">ราคา</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-center">สต็อก</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-center">สถานะ</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">

              {/* Loading state */}
              {isLoading && (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                      <Loader2 size={32} className="animate-spin text-[#22C55E]" />
                      <p className="font-bold text-sm animate-pulse">กำลังโหลดข้อมูลสินค้า...</p>
                    </div>
                  </td>
                </tr>
              )}

              {/* Error state */}
              {!isLoading && fetchError && (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                        <XCircle size={28} className="text-red-400" />
                      </div>
                      <p className="font-black text-slate-700">โหลดข้อมูลไม่สำเร็จ</p>
                      <p className="text-xs text-slate-400 max-w-sm">{fetchError}</p>
                      <button
                        onClick={fetchProducts}
                        className="mt-2 px-5 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                      >
                        ลองใหม่อีกครั้ง
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty state */}
              {!isLoading && !fetchError && filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                        <PackageX size={24} className="text-slate-300" />
                      </div>
                      <p className="font-black text-slate-600">
                        {searchTerm ? `ไม่พบสินค้าที่ตรงกับ "${searchTerm}"` : 'ยังไม่มีสินค้าในระบบ'}
                      </p>
                      {!searchTerm && (
                        <p className="text-xs font-medium mt-1">คลิกปุ่ม &ldquo;เพิ่มสินค้าใหม่&rdquo; เพื่อเริ่มต้น</p>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!isLoading && !fetchError && filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/70 transition-colors group">

                  {/* ID */}
                  <td className="px-6 py-4 align-middle">
                    <span className="font-mono text-[11px] text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                      {product.id.slice(0, 8)}…
                    </span>
                  </td>

                  {/* Image */}
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {(product as any).mainImageUrl ? (
                        <img 
                          src={(product as any).mainImageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Package size={20} className="text-slate-300" />
                      )}
                    </div>
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4 align-middle">
                    <p className="font-bold text-slate-800 max-w-[220px] truncate">{product.name}</p>
                    {product.sku && (
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {product.sku}</p>
                    )}
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4">
                    <p className="font-black text-[#22C55E]">
                      ฿{product.price.toLocaleString('th-TH')}
                    </p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-[11px] text-slate-400 line-through">
                        ฿{product.originalPrice.toLocaleString('th-TH')}
                      </p>
                    )}
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`font-black text-sm ${
                        product.stock === 0
                          ? 'text-red-500'
                          : product.stock <= 5
                          ? 'text-amber-500'
                          : 'text-slate-700'
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>

                  {/* Status — clickable toggle */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(product)}
                      title="คลิกเพื่อเปลี่ยนสถานะ"
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full transition-all hover:scale-105 active:scale-95 ${
                        product.isPublished
                          ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                          : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                      }`}
                    >
                      {product.isPublished
                        ? <><CheckCircle2 size={12} /> แสดงผล</>
                        : <><XCircle size={12} /> ซ่อนไว้</>}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                        title="แก้ไข"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="ลบ"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}