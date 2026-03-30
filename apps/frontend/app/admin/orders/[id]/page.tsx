'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, User, Phone, Mail, MapPin, Package, 
  CheckCircle2, Zap, CreditCard, Truck, RefreshCw, XCircle, DollarSign, Calendar
} from 'lucide-react';
import Link from 'next/link';

interface ProductInfo {
  id: string;
  name: string;
  mainImageUrl: string | null;
}

interface OrderItem {
  id: string;
  quantity: number;
  priceAtPurchase: number;
  product: ProductInfo;
}

interface OrderDetail {
  id: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  shippingAddressSnapshot: string;
  trackingNumber: string | null;
  paymentMethod: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    avatarUrl: string | null;
  };
  items: OrderItem[];
}

const API_BASE = 'http://localhost:4000/api';

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

const PAYMENT_COLORS: Record<string, string> = {
  PAID: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  UNPAID: 'bg-rose-50 text-rose-600 border-rose-200',
  REFUNDED: 'bg-slate-100 text-slate-600 border-slate-300',
};
const PAYMENT_LABELS: Record<string, string> = {
  PAID: 'ชำระเงินแล้ว',
  UNPAID: 'รอการชำระเงิน',
  REFUNDED: 'คืนเงินแล้ว',
};

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/orders/${id}`);
      if (!res.ok) throw new Error('Order not found');
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูลคำสั่งซื้อ');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-400">
        <RefreshCw size={32} className="animate-spin text-[#22C55E] mb-4" />
        <p className="font-bold">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black text-slate-800 mb-2">ไม่พบคำสั่งซื้อนี้</h2>
        <button onClick={() => router.back()} className="text-[#22C55E] font-bold">← กลับไปหน้ารายการ</button>
      </div>
    );
  }

  let addressMeta: any = {};
  if (order.shippingAddressSnapshot) {
    try {
      addressMeta = JSON.parse(order.shippingAddressSnapshot);
    } catch (e) {}
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header + Back */}
      <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-[#22C55E] hover:border-[#22C55E] transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">รายละเอียดคำสั่งซื้อ</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">Order ID: #{order.id.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- Left Column: Summary & Customer Details --- */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Status Box */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden text-center">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">สถานะคำสั่งซื้อ</h2>
            
            <div className="flex flex-col gap-4 items-center">
              <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border ${PAYMENT_COLORS[order.paymentStatus] || PAYMENT_COLORS.UNPAID}`}>
                {order.paymentStatus === 'PAID' ? <CheckCircle2 size={16} /> : <Zap size={16} />} 
                {PAYMENT_LABELS[order.paymentStatus] || order.paymentStatus}
              </span>

              <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border ${STATUS_COLORS[order.status]}`}>
                <Truck size={16} /> {STATUS_LABELS[order.status] || order.status}
              </span>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-1">ทำรายการเมื่อ</p>
              <p className="text-sm font-bold text-slate-700 flex items-center justify-center gap-1">
                <Calendar size={14} className="text-slate-400" />
                {new Date(order.createdAt).toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' })}
              </p>
            </div>
          </div>

          {/* Customer & Shipping Box */}
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
            <h2 className="text-sm font-black text-slate-800 mb-5 flex items-center gap-2">
              <User size={18} className="text-[#22C55E]" /> ข้อมูลลูกค้า
            </h2>
            
            <div className="space-y-4 mb-6">
              <Link href={`/admin/customers/${order.user.id}`} className="group flex items-center gap-3 bg-slate-50 p-3 rounded-2xl hover:bg-emerald-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden flex-shrink-0">
                  {order.user.avatarUrl ? (
                    <img src={order.user.avatarUrl} alt={order.user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><User size={20} className="text-slate-400" /></div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-800 group-hover:text-[#22C55E] truncate">{order.user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{order.user.email}</p>
                </div>
              </Link>
            </div>

            <h2 className="text-sm font-black text-slate-800 mb-3 flex items-center gap-2 pt-6 border-t border-slate-100">
              <MapPin size={18} className="text-[#22C55E]" /> ที่อยู่จัดส่ง
            </h2>
            
            {addressMeta.fullName ? (
              <div className="bg-slate-50 rounded-2xl p-4 text-xs font-medium text-slate-600 leading-relaxed border border-slate-100">
                <p className="font-bold text-slate-800 mb-1">{addressMeta.fullName}</p>
                <p>{addressMeta.addressLine}</p>
                <p>{addressMeta.province} {addressMeta.postalCode}</p>
                <p className="text-slate-400 mt-2 font-mono flex items-center gap-1"><Phone size={12}/> {addressMeta.phone}</p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-bold italic bg-slate-50 p-4 rounded-2xl">ไม่มีข้อมูลที่อยู่</p>
            )}
            
            {order.trackingNumber && (
               <div className="mt-4 bg-blue-50 text-blue-800 p-3 rounded-xl border border-blue-100 text-xs font-bold flex items-center gap-2">
                 <Truck size={14} className="text-blue-500" /> หมายเลขพัสดุ: <span className="font-black font-mono tracking-widest">{order.trackingNumber}</span>
               </div>
            )}
          </div>

        </div>

        {/* --- Right Column: Financials & Items --- */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <Package size={22} className="text-[#22C55E]" /> สินค้าที่สั่งซื้อ ({order.items.length} รายการ)
            </h2>

            <div className="space-y-4 mb-8">
              {order.items.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 flex-shrink-0 p-1">
                      {item.product.mainImageUrl ? (
                        <img src={item.product.mainImageUrl} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Package size={20} className="text-slate-300" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        ฿{item.priceAtPurchase.toLocaleString('th-TH')} <span className="mx-1">x</span> <span className="font-black text-slate-700">{item.quantity}</span> ชิ้น
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right flex-shrink-0">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-0.5">รวม</p>
                    <p className="text-sm font-black text-slate-800">
                      ฿{(item.priceAtPurchase * item.quantity).toLocaleString('th-TH')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="bg-[#F8FAFC] rounded-3xl p-6 border border-slate-200">
              <h2 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2">
                 <DollarSign size={18} className="text-[#22C55E]" /> สรุปการชำระเงิน
              </h2>
              
              <div className="space-y-3 text-sm font-medium text-slate-600">
                <div className="flex justify-between items-center">
                  <span>ยอดรวมสินค้า</span>
                  <span className="font-bold text-slate-800">฿{order.totalAmount.toLocaleString('th-TH')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>ช่องทางการชำระเงิน</span>
                  <span className="font-bold text-slate-800 px-2 py-0.5 bg-slate-200 rounded-lg text-xs">
                    {order.paymentMethod || 'ไม่ระบุ'}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-slate-200 flex justify-between items-end">
                <span className="font-black text-slate-800">ยอดสุทธิ</span>
                <span className="text-3xl font-black text-[#22C55E]">
                  ฿{order.totalAmount.toLocaleString('th-TH')}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
