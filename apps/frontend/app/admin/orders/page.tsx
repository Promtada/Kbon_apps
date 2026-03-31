'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShoppingCart, Search, ChevronRight, User as UserIcon,
  Loader2, AlertTriangle, Package, Truck, CheckCircle2,
  RefreshCw, XCircle, DollarSign, X, Save, Leaf, MapPin,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../../lib/axios';

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
    avatarUrl: string | null;
  };
  items: OrderItem[];
}

// ─── Status configs ───
const ORDER_STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;
const PAYMENT_STATUSES = ['UNPAID', 'PAID', 'REFUNDED'] as const;

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-600 border-amber-200',
  PAID: 'bg-blue-50 text-blue-600 border-blue-200',
  SHIPPED: 'bg-purple-50 text-purple-600 border-purple-200',
  DELIVERED: 'bg-[#22C55E]/10 text-[#22C55E] border-green-200',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200',
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: 'รอดำเนินการ',
  PAID: 'เตรียมจัดส่ง',
  SHIPPED: 'กำลังจัดส่ง',
  DELIVERED: 'จัดส่งสำเร็จ',
  CANCELLED: 'ยกเลิก',
};
const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <RefreshCw size={14} />,
  PAID: <Package size={14} />,
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
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

  const handleOrderUpdated = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
    setSelectedOrder(null);
  };

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
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-[#22C55E] hover:border-[#22C55E] hover:text-white transition-all shadow-sm group-hover:shadow-md"
                        >
                          ดูรายละเอียด <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ─── Order Detail Modal ─── */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdated={handleOrderUpdated}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// ─── Order Detail Modal ───
// ═══════════════════════════════════════════════════
function OrderDetailModal({
  order,
  onClose,
  onUpdated,
}: {
  order: Order;
  onClose: () => void;
  onUpdated: (order: Order) => void;
}) {
  const [status, setStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [isSaving, setIsSaving] = useState(false);

  // Determine if anything changed
  const hasChanges =
    status !== order.status ||
    paymentStatus !== order.paymentStatus ||
    trackingNumber !== (order.trackingNumber || '');

  // Parse address
  let address: any = {};
  try {
    address = JSON.parse(order.shippingAddressSnapshot);
  } catch {}

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await api.patch(`/orders/${order.id}/status`, {
        status,
        paymentStatus,
        trackingNumber: trackingNumber || null,
      });

      if (res.data.success) {
        toast.success('อัปเดตสำเร็จ!', {
          description: `คำสั่งซื้อ #${order.id.slice(-8).toUpperCase()} อัปเดตแล้ว`,
        });
        onUpdated(res.data.order);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'ไม่สามารถอัปเดตสถานะได้';
      toast.error('เกิดข้อผิดพลาด', { description: Array.isArray(msg) ? msg[0] : msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
        <div
          className="bg-white rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 animate-[fadeIn_0.2s_ease]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ─── Modal Header ─── */}
          <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 md:px-8 py-5 flex items-center justify-between rounded-t-[2rem]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl flex items-center justify-center">
                <Package size={20} className="text-[#22C55E]" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  #{order.id.slice(-8).toUpperCase()}
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  {new Date(order.createdAt).toLocaleDateString('th-TH', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <X size={18} className="text-slate-500" />
            </button>
          </div>

          <div className="px-6 md:px-8 py-6 space-y-6">
            {/* ─── Customer Info ─── */}
            <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100 flex-shrink-0 overflow-hidden">
                {order.user.avatarUrl ? (
                  <img src={order.user.avatarUrl} alt={order.user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={20} className="text-[#22C55E]" />
                )}
              </div>
              <div>
                <p className="font-black text-slate-800">{order.user.name}</p>
                <p className="text-xs text-slate-400 font-medium">{order.user.email}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ยอดรวม</p>
                <p className="text-xl font-black text-[#22C55E]">฿{order.totalAmount.toLocaleString('th-TH')}</p>
              </div>
            </div>

            {/* ─── Shipping Address ─── */}
            {address.fullName && (
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <MapPin size={12} /> ที่อยู่จัดส่ง
                </p>
                <div className="bg-slate-50 rounded-xl p-4 text-sm font-medium text-slate-600 leading-relaxed">
                  <p className="font-bold text-slate-800">{address.fullName} · {address.phone}</p>
                  <p>{address.addressLine}</p>
                  <p>{address.province} {address.postalCode}</p>
                </div>
              </div>
            )}

            {/* ─── Items ─── */}
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                รายการสินค้า ({order.items.length})
              </p>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 bg-slate-50 rounded-xl p-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {item.product.mainImageUrl ? (
                        <img src={item.product.mainImageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Leaf size={14} className="text-[#22C55E] opacity-40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{item.product.name}</p>
                      <p className="text-xs text-slate-400">฿{item.priceAtPurchase.toLocaleString('th-TH')} × {item.quantity}</p>
                    </div>
                    <p className="text-sm font-black text-slate-700">
                      ฿{(item.priceAtPurchase * item.quantity).toLocaleString('th-TH')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── Admin Controls ─── */}
            <div className="border-t border-slate-100 pt-6 space-y-5">
              <p className="text-[10px] font-black text-[#22C55E] uppercase tracking-widest">
                ⚙️ จัดการสถานะคำสั่งซื้อ
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                      <option key={s} value={s}>
                        {STATUS_LABELS[s] || s}
                      </option>
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
                      <option key={s} value={s}>
                        {PAYMENT_LABELS[s] || s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tracking Number */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                  เลขพัสดุ (Tracking Number)
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="เช่น TH1234567890"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>

          {/* ─── Modal Footer ─── */}
          <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 md:px-8 py-4 flex items-center justify-between gap-4 rounded-b-[2rem]">
            <button
              onClick={onClose}
              className="px-6 py-3 text-slate-500 font-bold text-sm hover:text-slate-800 transition-colors"
            >
              ยกเลิก
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
              className="px-8 py-3 bg-[#22C55E] hover:bg-[#1eb054] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-black text-sm rounded-2xl shadow-lg shadow-green-200 transition-all flex items-center gap-2 active:scale-[0.98]"
            >
              {isSaving ? (
                <><Loader2 size={16} className="animate-spin" /> กำลังบันทึก...</>
              ) : (
                <><Save size={16} /> บันทึกการเปลี่ยนแปลง</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
