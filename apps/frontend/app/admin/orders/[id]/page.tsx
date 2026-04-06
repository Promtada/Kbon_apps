'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Package, Truck, CheckCircle2, Clock, XCircle,
  RefreshCw, DollarSign, Save, Loader2, Leaf, MapPin,
  User as UserIcon, CreditCard, ShoppingBag, Hash, Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../../../lib/axios';

// ─── Types ───
interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  product: {
    id: string;
    name: string;
    mainImageUrl: string | null;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  trackingNumber: string | null;
  shippingAddressSnapshot: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatarUrl: string | null;
  };
  coupon?: {
    code: string;
    discountType: string;
    discountValue: number;
  } | null;
  items: OrderItem[];
}

const ORDER_STATUSES = ['PENDING', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;
const PAYMENT_STATUSES = ['UNPAID', 'PAID', 'REFUNDED'] as const;

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
  PENDING: <Clock size={14} />,
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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// ═══════════════════════════════════════════════════
export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editable fields
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        const data = res.data;
        setOrder(data);
        setStatus(data.status);
        setPaymentStatus(data.paymentStatus);
        setTrackingNumber(data.trackingNumber || '');
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setError('not_found');
        } else {
          setError('load_error');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const hasChanges = order && (
    status !== order.status ||
    paymentStatus !== order.paymentStatus ||
    trackingNumber !== (order.trackingNumber || '')
  );

  const handleSave = async () => {
    if (!order) return;
    setIsSaving(true);
    try {
      const res = await api.patch(`/orders/${order.id}/status`, {
        status,
        paymentStatus,
        trackingNumber: trackingNumber || null,
      });
      if (res.data.success) {
        setOrder(res.data.order);
        toast.success('อัปเดตสำเร็จ!', {
          description: `คำสั่งซื้อ #${order.id.slice(-8).toUpperCase()} อัปเดตแล้ว`,
        });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'ไม่สามารถอัปเดตสถานะได้';
      toast.error('เกิดข้อผิดพลาด', { description: Array.isArray(msg) ? msg[0] : msg });
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Loading ───
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400">
        <Loader2 size={44} className="animate-spin text-[#22C55E] mb-4" />
        <p className="font-bold text-sm animate-pulse">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
      </div>
    );
  }

  // ─── Error ───
  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          {error === 'not_found'
            ? <Package size={40} className="text-slate-300" />
            : <XCircle size={40} className="text-red-300" />
          }
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">
          {error === 'not_found' ? 'ไม่พบคำสั่งซื้อ' : 'เกิดข้อผิดพลาด'}
        </h2>
        <p className="text-slate-400 font-medium mb-8">
          {error === 'not_found'
            ? 'คำสั่งซื้อนี้อาจถูกลบหรือไม่มีอยู่ในระบบ'
            : 'ไม่สามารถโหลดข้อมูลได้ ลองใหม่อีกครั้ง'}
        </p>
        <Link
          href="/admin/orders"
          className="px-6 py-3 bg-[#22C55E] text-white font-bold text-sm rounded-xl"
        >
          ← กลับหน้ารวมคำสั่งซื้อ
        </Link>
      </div>
    );
  }

  // Parse address
  let address: any = {};
  try { address = JSON.parse(order.shippingAddressSnapshot); } catch {}

  const itemCount = order.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = order.items.reduce((sum, i) => sum + i.priceAtPurchase * i.quantity, 0);
  const shippingFee = order.totalAmount - subtotal;

  // ─── Main Render ───
  return (
    <div className="space-y-8">

      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:text-[#22C55E] hover:border-[#22C55E] transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                #{order.id.slice(-8).toUpperCase()}
              </h1>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${STATUS_COLORS[order.status]}`}>
                {STATUS_ICONS[order.status]}
                {STATUS_LABELS[order.status] || order.status}
              </span>
              <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${PAYMENT_COLORS[order.paymentStatus]}`}>
                {order.paymentStatus === 'PAID' && <DollarSign size={11} />}
                {PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
              <Calendar size={12} />
              สั่งซื้อเมื่อ {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Two-Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ════════════ Left Column (2/3) ════════════ */}
        <div className="lg:col-span-2 space-y-6">

          {/* Card 1: Items List */}
          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-black text-slate-800 flex items-center gap-2.5">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={17} className="text-[#22C55E]" />
                </div>
                รายการสินค้า
              </h2>
              <span className="text-xs font-bold text-slate-400">{itemCount} ชิ้น · {order.items.length} รายการ</span>
            </div>

            <div className="divide-y divide-slate-50">
              {order.items.map((item) => (
                <div key={item.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {item.product.mainImageUrl ? (
                      <img src={item.product.mainImageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Leaf size={18} className="text-[#22C55E] opacity-40" />
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
                      SKU: {item.product.id.slice(-6).toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-slate-400 font-medium">
                      ฿{item.priceAtPurchase.toLocaleString('th-TH')} × {item.quantity}
                    </p>
                    <p className="text-sm font-black text-slate-800 mt-0.5">
                      ฿{(item.priceAtPurchase * item.quantity).toLocaleString('th-TH')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Payment Summary */}
          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm p-6">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CreditCard size={17} className="text-[#22C55E]" />
              </div>
              สรุปยอดชำระ
            </h2>

            <div className="space-y-3 text-sm font-medium text-slate-600">
              <div className="flex justify-between items-center">
                <span>ราคาสินค้า ({itemCount} ชิ้น)</span>
                <span className="font-bold text-slate-800">฿{subtotal.toLocaleString('th-TH')}</span>
              </div>
              {order.coupon && (
                <div className="flex justify-between items-center text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100/50 mx--3">
                  <span className="font-bold text-xs uppercase tracking-wider">
                    ส่วนลด (Coupon: {order.coupon.code})
                  </span>
                  <span className="font-black text-sm">
                    {order.coupon.discountType === 'FIXED' 
                      ? `-฿${order.coupon.discountValue.toLocaleString('th-TH')}`
                      : `-${order.coupon.discountValue}%`}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>ค่าจัดส่ง</span>
                {shippingFee <= 0 ? (
                  <span className="font-black text-[#22C55E]">ฟรี</span>
                ) : (
                  <span className="font-bold text-slate-800">฿{shippingFee.toLocaleString('th-TH')}</span>
                )}
              </div>
              {order.paymentMethod && (
                <div className="flex justify-between items-center">
                  <span>ช่องทางชำระเงิน</span>
                  <span className="font-bold text-slate-800">{order.paymentMethod}</span>
                </div>
              )}
              <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-end">
                <span className="text-base font-black text-slate-800">ยอดรวมสุทธิ</span>
                <span className="text-2xl font-black text-[#22C55E]">฿{order.totalAmount.toLocaleString('th-TH')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════ Right Column (1/3) ════════════ */}
        <div className="lg:col-span-1 space-y-6">

          {/* Card 1: Customer & Address */}
          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm p-6 space-y-5">
            {/* Customer */}
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <UserIcon size={11} /> ข้อมูลลูกค้า
              </p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 flex-shrink-0 overflow-hidden">
                  {order.user.avatarUrl ? (
                    <img src={order.user.avatarUrl} alt={order.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={18} className="text-[#22C55E]" />
                  )}
                </div>
                <div>
                  <p className="font-black text-slate-800 text-sm">{order.user.name}</p>
                  <p className="text-xs text-slate-400 font-medium">{order.user.email}</p>
                  {order.user.phone && (
                    <p className="text-xs text-slate-400 font-medium">{order.user.phone}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Address */}
            {address.fullName && (
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <MapPin size={11} /> ที่อยู่จัดส่ง
                </p>
                <div className="space-y-1 text-sm font-medium text-slate-600 leading-relaxed">
                  <p className="font-bold text-slate-800">{address.fullName}</p>
                  <p>{address.phone}</p>
                  <p>{address.addressLine}</p>
                  <p>{address.province} {address.postalCode}</p>
                </div>
              </div>
            )}

            {/* Tracking */}
            {order.trackingNumber && (
              <>
                <div className="border-t border-slate-100" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Truck size={11} /> เลขพัสดุ
                  </p>
                  <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl">
                    <Hash size={13} className="text-blue-500" />
                    <span className="text-sm font-black text-blue-700 font-mono">{order.trackingNumber}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Card 2: Admin Management Controls */}
          <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm p-6 space-y-5">
            <p className="text-[10px] font-black text-[#22C55E] uppercase tracking-widest flex items-center gap-1.5">
              ⚙️ จัดการสถานะ
            </p>

            {/* Order Status */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                สถานะคำสั่งซื้อ
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all appearance-none cursor-pointer"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                สถานะการชำระเงิน
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all appearance-none cursor-pointer"
              >
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>{PAYMENT_LABELS[s]}</option>
                ))}
              </select>
            </div>

            {/* Tracking Number */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                เลขพัสดุ
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="เช่น TH1234567890"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all placeholder:text-slate-300"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="w-full py-3.5 bg-[#22C55E] hover:bg-[#1eb054] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-black text-sm rounded-2xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {isSaving ? (
                <><Loader2 size={16} className="animate-spin" /> กำลังบันทึก...</>
              ) : (
                <><Save size={16} /> บันทึกการเปลี่ยนแปลง</>
              )}
            </button>

            {hasChanges && (
              <p className="text-[11px] text-amber-600 font-medium text-center bg-amber-50 py-2 rounded-xl border border-amber-100">
                ⚠️ มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
