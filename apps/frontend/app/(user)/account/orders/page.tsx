'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../../../lib/axios';
import {
  Package, ShoppingBag, ArrowRight, Loader2, Clock,
  CheckCircle2, Truck, XCircle, CreditCard, Leaf, ChevronDown, ChevronUp,
} from 'lucide-react';

// ─── Types ───
interface OrderProduct {
  id: string;
  name: string;
  mainImageUrl?: string | null;
}

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  product: OrderProduct;
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentMethod?: string | null;
  paymentStatus: string;
  trackingNumber?: string | null;
  shippingAddressSnapshot: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// ─── Status config ───
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  PENDING: {
    label: 'รอดำเนินการ',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: <Clock size={13} strokeWidth={2.5} />,
  },
  PAID: {
    label: 'ชำระแล้ว',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: <CheckCircle2 size={13} strokeWidth={2.5} />,
  },
  SHIPPED: {
    label: 'จัดส่งแล้ว',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: <Truck size={13} strokeWidth={2.5} />,
  },
  DELIVERED: {
    label: 'ได้รับแล้ว',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: <CheckCircle2 size={13} strokeWidth={2.5} />,
  },
  CANCELLED: {
    label: 'ยกเลิก',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: <XCircle size={13} strokeWidth={2.5} />,
  },
};

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatOrderId(id: string) {
  return `#${id.slice(-8).toUpperCase()}`;
}

// ═══════════════════════════════════════════════════
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders/my-orders');
        setOrders(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'ไม่สามารถโหลดรายการสั่งซื้อได้');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ─── Loading ───
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader count={0} loading />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl" />
                <div className="space-y-2">
                  <div className="w-28 h-4 bg-slate-100 rounded-lg" />
                  <div className="w-40 h-3 bg-slate-50 rounded-lg" />
                </div>
              </div>
              <div className="w-24 h-7 bg-slate-100 rounded-full" />
            </div>
            <div className="h-16 bg-slate-50 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  // ─── Error ───
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader count={0} />
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={32} className="text-red-400" />
          </div>
          <h3 className="font-black text-slate-800 text-lg mb-2">เกิดข้อผิดพลาด</h3>
          <p className="text-sm text-slate-400 font-medium mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#22C55E] text-white font-bold text-sm rounded-xl"
          >
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  // ─── Empty ───
  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader count={0} />
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-[#22C55E] opacity-50" />
          </div>
          <h3 className="font-black text-slate-800 text-xl mb-2">ยังไม่มีคำสั่งซื้อ</h3>
          <p className="text-slate-400 font-medium text-sm max-w-xs mx-auto leading-relaxed mb-8">
            เมื่อคุณสั่งซื้อสินค้า รายการคำสั่งซื้อทั้งหมดจะปรากฏที่นี่
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#22C55E] text-white font-black text-sm rounded-2xl shadow-lg shadow-green-200 hover:bg-[#1eb054] hover:-translate-y-0.5 transition-all"
          >
            เลือกซื้อสินค้า
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // ─── Orders List ───
  return (
    <div className="space-y-6">
      <PageHeader count={orders.length} />

      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

// ─── Page Header ───
function PageHeader({ count, loading }: { count: number; loading?: boolean }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
        <Package size={22} className="text-[#22C55E]" />
      </div>
      <div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">ประวัติการสั่งซื้อ</h1>
        <p className="text-sm text-slate-400 font-medium mt-0.5">
          {loading
            ? 'กำลังโหลด...'
            : count > 0
            ? `${count} คำสั่งซื้อทั้งหมด`
            : 'ยังไม่มีคำสั่งซื้อ'}
        </p>
      </div>
    </div>
  );
}

// ─── Order Card ───
function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const status = getStatusConfig(order.status);
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  // Parse shipping address
  let shippingAddress: any = {};
  try {
    shippingAddress = JSON.parse(order.shippingAddressSnapshot);
  } catch {}

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:border-emerald-100 hover:shadow-md transition-all duration-300">

      {/* ─── Card Header ─── */}
      <div className="p-5 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          {/* Left: Order info */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-[#22C55E]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-slate-900 text-base">
                  {formatOrderId(order.id)}
                </h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${status.bg} ${status.color} ${status.border}`}>
                  {status.icon}
                  {status.label}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {formatDate(order.createdAt)} · {itemCount} ชิ้น
              </p>
            </div>
          </div>

          {/* Right: Total + Payment info */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ยอดรวม</p>
              <p className="text-xl font-black text-[#22C55E] tracking-tight">
                ฿{order.totalAmount.toLocaleString('th-TH')}
              </p>
            </div>
            {order.paymentMethod && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100">
                <CreditCard size={13} className="text-slate-400" />
                <span className="text-[11px] font-bold text-slate-500">{order.paymentMethod}</span>
              </div>
            )}
          </div>
        </div>

        {/* ─── Product thumbnails (always visible) ─── */}
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-3">
          <div className="flex -space-x-2">
            {order.items.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="w-10 h-10 rounded-xl bg-slate-50 border-2 border-white overflow-hidden flex items-center justify-center flex-shrink-0"
              >
                {item.product.mainImageUrl ? (
                  <img src={item.product.mainImageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <Leaf size={14} className="text-[#22C55E] opacity-40" />
                )}
              </div>
            ))}
            {order.items.length > 4 && (
              <div className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-white flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-black text-slate-500">+{order.items.length - 4}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 font-medium flex-1 truncate">
            {order.items.map((i) => i.product.name).join(', ')}
          </p>

          {/* Expand/collapse toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-bold text-[#22C55E] hover:text-[#1eb054] transition-colors flex-shrink-0"
          >
            {expanded ? 'ซ่อน' : 'ดูรายละเอียด'}
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* ─── Expanded Details ─── */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50/40 p-5 md:p-6 space-y-5 animate-[fadeIn_0.2s_ease]">

          {/* Item list */}
          <div className="space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">รายการสินค้า</p>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 bg-white rounded-xl p-3 border border-slate-100">
                <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {item.product.mainImageUrl ? (
                    <img src={item.product.mainImageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <Leaf size={16} className="text-[#22C55E] opacity-40" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.product.id}`}
                    className="text-sm font-black text-slate-800 hover:text-[#22C55E] transition-colors line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    ฿{item.priceAtPurchase.toLocaleString('th-TH')} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-black text-slate-700">
                  ฿{(item.priceAtPurchase * item.quantity).toLocaleString('th-TH')}
                </p>
              </div>
            ))}
          </div>

          {/* Shipping address */}
          {shippingAddress.fullName && (
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">ที่อยู่จัดส่ง</p>
              <div className="bg-white rounded-xl p-4 border border-slate-100 text-sm font-medium text-slate-600 leading-relaxed">
                <p className="font-bold text-slate-800">{shippingAddress.fullName}</p>
                <p>{shippingAddress.phone}</p>
                <p>{shippingAddress.addressLine}</p>
                <p>{shippingAddress.province} {shippingAddress.postalCode}</p>
              </div>
            </div>
          )}

          {/* Tracking number */}
          {order.trackingNumber && (
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">เลขพัสดุ</p>
              <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl">
                <Truck size={14} className="text-blue-500" />
                <span className="text-sm font-black text-blue-700 font-mono">{order.trackingNumber}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
