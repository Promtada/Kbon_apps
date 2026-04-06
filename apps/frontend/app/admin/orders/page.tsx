'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  ShoppingCart, Search, ChevronRight, User as UserIcon,
  Loader2, AlertTriangle, Package, Truck, CheckCircle2,
  RefreshCw, XCircle, DollarSign,
} from 'lucide-react';
import api from '../../../lib/axios';

// ─── Types ───
interface OrderItem {
  product: {
    name: string;
    mainImageUrl: string | null;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    avatarUrl: string | null;
  };
  items: OrderItem[];
}

// ─── Status configs ───
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-slate-50 text-slate-600 border-slate-200',
  PREPARING: 'bg-amber-50 text-amber-600 border-amber-200',
  SHIPPED: 'bg-blue-50 text-blue-600 border-blue-200',
  DELIVERED: 'bg-[#22C55E]/10 text-[#22C55E] border-green-200',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200',
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: 'รอดำเนินการ',
  PREPARING: 'กำลังเตรียมสินค้า',
  SHIPPED: 'กำลังจัดส่ง',
  DELIVERED: 'จัดส่งสำเร็จ',
  CANCELLED: 'ยกเลิกแล้ว',
};
const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <RefreshCw size={14} />,
  PREPARING: <Package size={14} />,
  SHIPPED: <Truck size={14} />,
  DELIVERED: <CheckCircle2 size={14} />,
  CANCELLED: <XCircle size={14} />,
};

const PAYMENT_COLORS: Record<string, string> = {
  PAID: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  UNPAID: 'bg-rose-50 text-rose-600 border-rose-200',
  REFUNDED: 'bg-slate-100 text-slate-600 border-slate-300',
};
const PAYMENT_LABELS: Record<string, string> = {
  PAID: 'ชำระแล้ว',
  UNPAID: 'รอชำระเงิน',
  REFUNDED: 'คืนเงินแล้ว',
};

// ═══════════════════════════════════════════════════
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถโหลดข้อมูลคำสั่งซื้อได้');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <ShoppingCart className="text-[#22C55E]" size={32} />
            รายการคำสั่งซื้อ
          </h1>
          <p className="text-slate-500 font-medium mt-1">บริหารจัดการคำสั่งซื้อ การจัดส่ง และการชำระเงิน</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="ค้นหา Order ID หรือชื่อลูกค้า..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#22C55E]/20 focus:border-[#22C55E] shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 size={40} className="animate-spin text-[#22C55E] mb-4" />
            <p className="font-bold animate-pulse">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500">
            <p className="font-bold flex items-center gap-2"><AlertTriangle size={20} /> {error}</p>
            <button onClick={fetchOrders} className="mt-4 px-4 py-2 bg-slate-100 rounded-xl text-slate-600 font-bold hover:bg-slate-200">
              ลองใหม่
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-4 rounded-tl-[2rem]">Order ID & วันที่</th>
                  <th className="px-6 py-4">ลูกค้า</th>
                  <th className="px-6 py-4">สินค้า</th>
                  <th className="px-6 py-4 text-right">ยอดสุทธิ</th>
                  <th className="px-6 py-4 text-center">การชำระเงิน</th>
                  <th className="px-6 py-4 text-center">การจัดส่ง</th>
                  <th className="px-6 py-4 text-right rounded-tr-[2rem]">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-slate-400 font-medium">
                      ไม่พบข้อมูลคำสั่งซื้อ
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-sm font-black text-slate-800">#{order.id.slice(-8).toUpperCase()}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 flex-shrink-0 overflow-hidden">
                            {order.user.avatarUrl ? (
                              <img src={order.user.avatarUrl} alt={order.user.name} className="w-full h-full object-cover" />
                            ) : (
                              <UserIcon size={16} className="text-[#22C55E]" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 truncate max-w-[150px]">{order.user.name}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{order.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-600">
                        <div className="flex items-center gap-2">
                          <Package size={14} className="text-slate-400" />
                          {order.items.length} รายการ
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-black text-slate-800">
                          ฿{order.totalAmount.toLocaleString('th-TH')}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center min-w-[5rem] gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${PAYMENT_COLORS[order.paymentStatus] || PAYMENT_COLORS.UNPAID}`}>
                          {order.paymentStatus === 'PAID' && <DollarSign size={12} />}
                          {PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center justify-center min-w-[5rem] gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[order.status]}`}>
                          {STATUS_ICONS[order.status]} {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-[#22C55E] hover:border-[#22C55E] hover:text-white transition-all shadow-sm group-hover:shadow-md"
                        >
                          ดูรายละเอียด <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
