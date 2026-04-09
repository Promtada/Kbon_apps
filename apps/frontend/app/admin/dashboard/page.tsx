'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  MoreHorizontal, 
  Download,
  ChevronRight,
  Loader2
} from 'lucide-react';
import api from '../../../lib/axios';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingShipments: 0,
    lowStockCount: 0,
    recentOrders: [] as any[],
    topProducts: [] as any[]
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/dashboard/summary');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard summary', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Paid': return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold border border-emerald-100">Paid</span>;
      case 'Pending': return <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold border border-amber-100">Pending</span>;
      case 'Shipped': return <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold border border-blue-100">Shipped</span>;
      case 'Delivered': return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">Delivered</span>;
      default: return <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center text-slate-400 gap-3">
          <Loader2 size={32} className="animate-spin text-[#22C55E]" />
          <p className="text-sm font-bold animate-pulse tracking-wide">กำลังโหลดข้อมูล Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">ภาพรวมธุรกิจ (Business Overview)</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">ติดตามยอดขายและสถานะการดำเนินงานของแพลตฟอร์ม</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 px-6 py-3 rounded-[1.2rem] text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-all">
              <Download size={16} /> Export Report
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Card 1: Revenue */}
          <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group hover:border-[#22C55E]/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">ยอดขายรวม (Total Revenue)</p>
                <h3 className="text-3xl font-black text-slate-800 mt-1">฿{data.totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 rounded-[1.2rem] bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <DollarSign size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
              <TrendingUp size={14} /> <span>+14.5% จากเดือนที่แล้ว</span>
            </div>
          </div>

          {/* Card 2: Orders */}
          <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">คำสั่งซื้อทั้งหมด (Total Orders)</p>
                <h3 className="text-3xl font-black text-slate-800 mt-1">{data.totalOrders.toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 rounded-[1.2rem] bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <ShoppingBag size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>นับจากวันที่ 1 ต.ค. 2026</span>
            </div>
          </div>

          {/* Card 3: Pending Shipments */}
          <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group hover:border-amber-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">รอจัดส่ง (Pending Shipments)</p>
                <h3 className="text-3xl font-black text-amber-500 mt-1">{data.pendingShipments.toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 rounded-[1.2rem] bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <Package size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600">
              <span>ต้องการการดำเนินการด่วน</span>
            </div>
          </div>

          {/* Card 4: Low Stock */}
          <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm relative overflow-hidden group hover:border-red-300 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">สินค้าใกล้หมด (Low Stock)</p>
                <h3 className="text-3xl font-black text-red-500 mt-1">{data.lowStockCount.toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 rounded-[1.2rem] bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <AlertTriangle size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-500">
              <span>สินค้าน้อยกว่า 5 ชิ้น</span>
            </div>
          </div>
        </div>

        {/* Main Content Area (Grid Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left side: Recent Orders Table (Col-span 2) */}
          <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-slate-800">คำสั่งซื้อล่าสุด (Recent Orders)</h3>
              <Link href="/admin/orders" className="text-sm font-bold text-[#22C55E] hover:text-[#1eb054] flex items-center gap-1 transition-colors">
                ดูทั้งหมด <ChevronRight size={16} />
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Order ID</th>
                    <th className="pb-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Customer Name</th>
                    <th className="pb-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Date</th>
                    <th className="pb-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="pb-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Total Amount</th>
                    <th className="pb-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-sm text-slate-400 font-medium">ไม่มีคำสั่งซื้อล่าสุด</td>
                    </tr>
                  ) : data.recentOrders.map((order, idx) => (
                    <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 text-sm font-bold text-slate-800">{order.id}</td>
                      <td className="py-4 text-sm font-bold text-slate-600">{order.customer}</td>
                      <td className="py-4 text-sm font-medium text-slate-500">{new Date(order.date).toLocaleDateString('th-TH')}</td>
                      <td className="py-4">{getStatusBadge(order.status)}</td>
                      <td className="py-4 text-sm font-black text-slate-800 text-right">฿{order.amount.toLocaleString()}</td>
                      <td className="py-4 text-center">
                        <Link href={`/admin/orders/${order.fullId}`} className="inline-block text-slate-400 hover:text-blue-500 transition-colors p-2 rounded-xl hover:bg-blue-50">
                          <MoreHorizontal size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right side: Top Products List (Col-span 1) */}
          <div className="lg:col-span-1 bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex flex-col">
            <h3 className="text-xl font-black text-slate-800 mb-6">สินค้าขายดี (Top Products)</h3>
            
            <div className="flex flex-col gap-6 flex-1">
              {data.topProducts.length === 0 ? (
                <div className="text-center text-sm text-slate-400 py-8 font-medium">ยังไม่มีข้อมูลสินค้า</div>
              ) : data.topProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4 group cursor-pointer">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100 group-hover:border-blue-200 transition-colors">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
                      ขายแล้ว <span className="text-slate-700">{product.sold}</span> ชิ้น
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm transition-colors">
              ดูรายงานสินค้าเพิ่มเติม
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}