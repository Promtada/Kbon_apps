'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, User, Phone, Mail, MapPin, Package, 
  Calendar, CheckCircle2, ShieldCheck, Zap, 
  CreditCard, Truck, RefreshCw, XCircle 
} from 'lucide-react';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

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

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  shippingAddressSnapshot: string;
  trackingNumber: string | null;
  paymentMethod: string | null;
  items: OrderItem[];
}

interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  createdAt: string;
  addresses: Address[];
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
  PENDING: 'รอชำระเงิน',
  PAID: 'เตรียมจัดส่ง',
  SHIPPED: 'กำลังจัดส่ง',
  DELIVERED: 'จัดส่งสำเร็จ',
  CANCELLED: 'ยกเลิก',
};
const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <RefreshCw size={14} />,
  PAID: <Zap size={14} />,
  SHIPPED: <Truck size={14} />,
  DELIVERED: <CheckCircle2 size={14} />,
  CANCELLED: <XCircle size={14} />,
};

export default function CustomerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Parallel fetch
      const [resCustomer, resOrders] = await Promise.all([
        fetch(`${API_BASE}/customers/${id}`),
        fetch(`${API_BASE}/customers/${id}/orders`)
      ]);

      if (!resCustomer.ok) throw new Error('Customer not found');
      
      const cData = await resCustomer.json();
      const oData = resOrders.ok ? await resOrders.json() : [];

      setCustomer(cData);
      setOrders(oData);
    } catch (err) {
      console.error(err);
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-slate-400">
        <RefreshCw size={32} className="animate-spin text-[#22C55E] mb-4" />
        <p className="font-bold">กำลังโหลดข้อมูลลูกค้า...</p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black text-slate-800 mb-2">ไม่พบข้อมูลลูกค้า</h2>
        <button onClick={() => router.back()} className="text-[#22C55E] font-bold">← กลับไปหน้ารายการ</button>
      </div>
    );
  }

  const defaultAddress = customer.addresses.find(a => a.isDefault) || customer.addresses[0];
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

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
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">รายละเอียดลูกค้า</h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {customer.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- Left Column: Profile Card --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10" />
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 flex items-center justify-center border-2 border-white shadow-lg overflow-hidden mb-4">
                {customer.avatarUrl ? (
                  <img src={customer.avatarUrl} alt={customer.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-[#22C55E]" />
                )}
              </div>
              <h2 className="text-xl font-black text-slate-800">{customer.name}</h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg mt-2">
                <Calendar size={12} /> เข้าร่วม {new Date(customer.createdAt).toLocaleDateString('th-TH')}
              </span>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Mail size={16} />
                </div>
                {customer.email}
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                  <Phone size={16} />
                </div>
                {customer.phone || '-'}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center mb-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">ที่อยู่จัดส่งเริ่มต้น</p>
              </div>
              {defaultAddress ? (
                <div className="bg-slate-50 rounded-2xl p-4 text-sm font-medium text-slate-600 leading-relaxed border border-slate-100">
                  <p className="font-bold text-slate-800 mb-1">{defaultAddress.fullName}</p>
                  <p>{defaultAddress.addressLine}</p>
                  <p>{defaultAddress.province} {defaultAddress.postalCode}</p>
                  <p className="text-xs text-slate-400 mt-2 font-mono">📱 {defaultAddress.phone}</p>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-4 text-center text-xs text-slate-400 font-bold border border-slate-100 border-dashed">
                  ไม่มีข้อมูลที่อยู่
                </div>
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ยอดใช้จ่ายรวม</p>
              <p className="text-3xl font-black text-[#22C55E]">฿{totalSpent.toLocaleString('th-TH')}</p>
            </div>
          </div>
        </div>

        {/* --- Right Column: Orders Timeline --- */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <Package size={24} className="text-[#22C55E]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">ประวัติคำสั่งซื้อ</h2>
                <p className="text-xs font-bold text-slate-400 mt-0.5">{orders.length} รายการสั่งซื้อ</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-[2rem] border border-slate-100 border-dashed">
                <p className="text-slate-400 font-bold mb-2">ลูกค้านี้ยังไม่มีประวัติการสั่งซื้อ</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order, i) => {
                  let parseAddress: any = null;
                  try {
                    parseAddress = JSON.parse(order.shippingAddressSnapshot);
                  } catch(e) {}

                  return (
                    <div key={order.id} className="bg-white border-2 border-slate-50 rounded-[2rem] p-5 hover:border-emerald-100 transition-colors group relative">
                      
                      {/* Timeline Line Design */}
                      {i !== orders.length - 1 && (
                        <div className="absolute left-10 -bottom-6 w-0.5 h-6 bg-slate-100" />
                      )}

                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5 pb-5 border-b border-slate-50">
                        <div>
                          <p className="text-xs text-slate-400 font-mono mb-1">Order #{order.id.slice(-8).toUpperCase()}</p>
                          <p className="text-sm font-bold text-slate-600">
                            {new Date(order.createdAt).toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' })}
                          </p>
                        </div>
                        
                        <div className="flex flex-col md:items-end gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${STATUS_COLORS[order.status]}`}>
                            {STATUS_ICONS[order.status]} {STATUS_LABELS[order.status] || order.status}
                          </span>
                          <p className="text-xl font-black text-[#22C55E]">
                            ฿{order.totalAmount.toLocaleString('th-TH')}
                          </p>
                        </div>
                      </div>

                      {/* Snapshotted Meta info */}
                      <div className="flex flex-wrap gap-x-8 gap-y-4 mb-6">
                        {order.trackingNumber && (
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tracking Number</p>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-mono font-bold">
                              <Truck size={12} /> {order.trackingNumber}
                            </span>
                          </div>
                        )}
                        {order.paymentMethod && (
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Payment Method</p>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                              <CreditCard size={12} /> {order.paymentMethod}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Snapshot Address */}
                      {parseAddress && (
                        <div className="mb-6 bg-slate-50 rounded-2xl p-4 text-xs font-medium text-slate-600 leading-relaxed border border-slate-100/50">
                          <p className="text-[10px] font-black uppercase text-slate-400 mb-2 flex items-center gap-1.5">
                            <MapPin size={12} /> จัดส่งไปยัง
                          </p>
                          <p className="font-bold text-slate-800">{parseAddress.fullName}</p>
                          <p>{parseAddress.addressLine} {parseAddress.province} {parseAddress.postalCode}</p>
                          <p className="text-slate-400 mt-1">📱 {parseAddress.phone}</p>
                        </div>
                      )}

                      {/* Order Items */}
                      <div className="space-y-3">
                        {order.items.map(item => (
                          <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 flex-shrink-0">
                                {item.product.mainImageUrl ? (
                                  <img src={item.product.mainImageUrl} className="w-full h-full object-cover" />
                                ) : (
                                  <Package size={16} className="text-slate-300" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-800 line-clamp-1">{item.product.name}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">฿{item.priceAtPurchase.toLocaleString('th-TH')} <span className="mx-1">x</span> <span className="font-bold text-slate-600">{item.quantity}</span></p>
                              </div>
                            </div>
                            <div className="sm:text-right">
                              <p className="text-sm font-black text-slate-800">
                                ฿{(item.priceAtPurchase * item.quantity).toLocaleString('th-TH')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
