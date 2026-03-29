'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit, Trash2, Filter, Loader2 } from 'lucide-react';
// import api from '../../../../lib/axios'; // เตรียมนำเข้า api ไว้ใช้เรียก Backend

export default function AdminProductsPage() {
  // 🌟 กำหนด State เป็น Array ว่าง รอรับข้อมูลจาก API
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 โครงสร้างสำหรับดึงข้อมูลจาก Backend (NestJS + Prisma)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // TODO: ปลดคอมเมนต์ด้านล่างนี้เมื่อ Backend API เสร็จแล้ว
        // const response = await api.get('/products');
        // setProducts(response.data);

        // จำลองเวลาโหลด 1 วินาที (ลบออกได้เมื่อต่อ API จริง)
        setTimeout(() => {
          setProducts([]); // ตอนนี้จะเป็น Array ว่างไปก่อน
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?')) {
      try {
        // TODO: ยิง API เพื่อลบข้อมูลจริงใน Database
        // await api.delete(`/products/${id}`);
        
        // อัปเดต State หน้าจอ
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Failed to delete product', error);
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">จัดการสินค้า</h1>
          <p className="text-slate-400 text-sm mt-1">จำนวนสินค้าทั้งหมด {products.length} รายการ</p>
        </div>
        <Link 
          href="/admin/products/create"
          className="bg-[#22C55E] text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-green-200 hover:bg-[#1eb054] hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
        >
          <Plus size={18} strokeWidth={3} /> เพิ่มสินค้าใหม่
        </Link>
      </div>

      {/* --- Search Bar --- */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อสินค้า หรือ รหัส..." 
            className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#22C55E]/20 outline-none disabled:opacity-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* --- Products Table --- */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">รหัส</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">ชื่อสินค้า</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">หมวดหมู่</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">ราคา</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-center">สต็อก</th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              
              {/* 🌟 แสดงสถานะ Loading ระหว่างรอข้อมูล */}
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                      <Loader2 size={32} className="animate-spin text-[#22C55E]" />
                      <p className="font-bold text-sm animate-pulse">กำลังโหลดข้อมูลสินค้า...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* ... (เหมือนเดิม) ... */}
                  </tr>
                ))
              ) : (
                /* 🌟 แสดงข้อความเมื่อไม่มีข้อมูล (Array ว่าง) */
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                        <Search size={24} className="text-slate-300" />
                      </div>
                      <p className="font-black text-slate-600">ยังไม่มีสินค้าในระบบ</p>
                      <p className="text-xs font-medium mt-1">คลิกปุ่ม "เพิ่มสินค้าใหม่" เพื่อเริ่มต้น</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}