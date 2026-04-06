'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useCart } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../lib/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  ChevronRight, MapPin, CreditCard, Banknote, ShieldCheck,
  ArrowRight, Truck, Tag, Loader2, User, Phone, Home, Map, Hash, AlertTriangle, Percent
} from 'lucide-react';

// ─── Zod Schema ───
const checkoutSchema = z.object({
  fullName: z.string().min(1, 'กรุณากรอกชื่อผู้รับ'),
  phone: z
    .string()
    .min(1, 'กรุณากรอกเบอร์โทรศัพท์')
    .regex(/^0\d{8,9}$/, 'เบอร์โทรศัพท์ไม่ถูกต้อง (เช่น 0812345678)'),
  addressLine: z.string().min(1, 'กรุณากรอกที่อยู่'),
  province: z.string().min(1, 'กรุณากรอกจังหวัด'),
  postalCode: z
    .string()
    .min(1, 'กรุณากรอกรหัสไปรษณีย์')
    .regex(/^\d{5}$/, 'รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// ─── Input helper ───
const FormInput = React.forwardRef<
  HTMLInputElement,
  {
    label: string;
    icon: React.ElementType;
    error?: string;
  } & React.InputHTMLAttributes<HTMLInputElement>
>(function FormInput({ label, icon: Icon, error, ...inputProps }, ref) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
        <Icon size={13} className="text-slate-400" />
        {label}
      </label>
      <input
        ref={ref}
        {...inputProps}
        className={`w-full bg-slate-50 border rounded-2xl px-4 py-3.5 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-[#22C55E] focus:bg-white outline-none transition-all placeholder:text-slate-300 ${
          error ? 'border-red-300 bg-red-50/30' : 'border-slate-200'
        }`}
      />
      {error && (
        <p className="text-[11px] text-red-500 font-medium mt-1.5 ml-1">{error}</p>
      )}
    </div>
  );
});

// ═══════════════════════════════════════════════════
export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const authUser = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [isClient, setIsClient] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('PromptPay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stockErrors, setStockErrors] = useState<string[]>([]);
  
  // โค้ดส่วนลด 
  const [couponCode, setCouponCode] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [discountInfo, setDiscountInfo] = useState<{ code: string; amount: number; type: string; value: number } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: authUser?.name || '',
      phone: authUser?.phone || '',
      addressLine: '',
      province: '',
      postalCode: '',
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auth guard — redirect to login if not authenticated
  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isClient, isAuthenticated, router]);

  const shippingFee = totalPrice >= 1500 ? 0 : 80;
  const rawGrandTotal = totalPrice + shippingFee;
  const grandTotal = discountInfo 
    ? Math.max(0, rawGrandTotal - discountInfo.amount) 
    : rawGrandTotal;

  // Don't render until hydration
  if (!isClient) return null;

  // Not authenticated
  if (!isAuthenticated) return null;

  // Empty cart
  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar user={authUser} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
            <Truck size={40} className="text-[#22C55E]" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">ไม่มีสินค้าที่จะชำระเงิน</h2>
          <p className="text-slate-500 mb-8 max-w-sm">กรุณากลับไปเลือกดูและเพิ่มสินค้าลงในตะกร้าก่อนดำเนินการต่อ</p>
          <Link href="/products" className="px-8 py-3 bg-[#22C55E] text-white font-bold rounded-2xl">
            เลือกอุดหนุนสินค้าต่อ
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── Frontend stock pre-check ───
  const preCheckStock = async (): Promise<boolean> => {
    setStockErrors([]);
    try {
      const errors: string[] = [];
      // Fetch latest stock for each product
      for (const item of items) {
        const res = await api.get(`/products/${item.product.id}`);
        const currentStock = res.data.stock;
        if (currentStock < item.quantity) {
          errors.push(
            `"${item.product.name}" คงเหลือ ${currentStock} ชิ้น (คุณเลือก ${item.quantity} ชิ้น)`
          );
        }
      }
      if (errors.length > 0) {
        setStockErrors(errors);
        return false;
      }
      return true;
    } catch {
      // If stock check fails, let the backend handle it
      return true;
    }
  };

  // ─── Coupon Validation ───
  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    try {
      const res = await api.post('/coupons/validate', {
        code: couponCode,
        cartTotal: totalPrice,
      });
      setDiscountInfo({
        code: res.data.code,
        amount: res.data.discountAmount,
        type: res.data.discountType,
        value: res.data.discountValue,
      });
      toast.success('ใช้โค้ดส่วนลดสำเร็จ', { description: `ลดไป ฿${res.data.discountAmount.toLocaleString('th-TH')}` });
    } catch (err: any) {
      toast.error('ไม่สามารถใช้โค้ดนี้ได้', { description: err?.response?.data?.message || 'รหัสส่วนลดไม่ถูกต้อง' });
      setDiscountInfo(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setDiscountInfo(null);
    setCouponCode('');
  };

  // ─── Submit ───
  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    // Frontend stock pre-check
    const stockOk = await preCheckStock();
    if (!stockOk) {
      setIsSubmitting(false);
      toast.error('สินค้าบางรายการคงเหลือไม่เพียงพอ', {
        description: 'กรุณาปรับจำนวนในตะกร้าก่อนสั่งซื้อ',
      });
      return;
    }

    const payload = {
      fullName: data.fullName,
      phone: data.phone,
      addressLine: data.addressLine,
      province: data.province,
      postalCode: data.postalCode,
      paymentMethod,
      couponCode: discountInfo?.code || undefined,
      items: items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
        price: i.product.price,
      })),
    };

    try {
      // 1. สร้างคำสั่งซื้อในระบบเรา
      const res = await api.post('/orders/checkout', payload);

      if (res.data.success) {
        clearCart();
        
        // 2. แจ้งเตือนว่ากำลังเชื่อมต่อระบบชำระเงิน
        toast.promise(
          api.post(`/orders/${res.data.orderId}/create-stripe-session`),
          {
            loading: 'กำลังเชื่อมต่อระบบชำระเงิน...',
            success: (stripeRes) => {
              // 3. Redirect ไปยังหน้าชำระเงินของ Stripe สำเร็จ
              window.location.href = stripeRes.data.url;
              return 'พาคุณไปหน้าชำระเงิน...';
            },
            error: () => {
              // หากเชื่อมต่อ Stripe ไม่สำเร็จ ให้ไปที่หน้าประวัติคำสั่งซื้อ
              router.push('/account/orders');
              return 'ไม่สามารถเชื่อมต่อระบบชำระเงินได้ กรุณาชำระเงินภายหลังในหน้าคำสั่งซื้อ';
            },
          }
        );

      } else {
        toast.error('เกิดข้อผิดพลาด', { description: res.data.error });
        setIsSubmitting(false);
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ ลองใหม่อีกครั้ง';
      toast.error('สั่งซื้อไม่สำเร็จ', { description: Array.isArray(msg) ? msg[0] : msg });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900">
      <Navbar user={authUser} />

      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#22C55E]">
          <span>ตะกร้าสินค้า</span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-slate-800">ชำระเงิน</span>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-slate-300">เสร็จสิ้น</span>
        </div>
      </div>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 md:py-12">
        <h1 className="text-3xl font-black mb-10 text-slate-800 tracking-tight">ดำเนินการชำระเงิน</h1>

        {/* Stock errors banner */}
        {stockErrors.length > 0 && (
          <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-black">
              <AlertTriangle size={18} />
              สินค้าบางรายการคงเหลือไม่เพียงพอ
            </div>
            {stockErrors.map((e, i) => (
              <p key={i} className="text-sm text-red-600 font-medium ml-6">• {e}</p>
            ))}
            <p className="text-xs text-red-500 font-medium ml-6">
              กรุณากลับไป <Link href="/cart" className="underline font-bold">แก้ไขตะกร้า</Link> ก่อนสั่งซื้อ
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* ----- Left Form Column ----- */}
            <div className="lg:col-span-3 space-y-8">

              {/* 1. Address Section */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#22C55E]">
                    <MapPin size={20} />
                  </div>
                  ที่อยู่จัดส่งของคุณ
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormInput
                    label="ชื่อผู้รับ"
                    icon={User}
                    placeholder="ชื่อ-นามสกุล"
                    error={errors.fullName?.message}
                    {...register('fullName')}
                  />
                  <FormInput
                    label="เบอร์โทรศัพท์"
                    icon={Phone}
                    type="tel"
                    placeholder="0812345678"
                    error={errors.phone?.message}
                    {...register('phone')}
                  />
                  <div className="md:col-span-2">
                    <FormInput
                      label="ที่อยู่"
                      icon={Home}
                      placeholder="บ้านเลขที่, ถนน, ซอย, ตำบล/แขวง, อำเภอ/เขต"
                      error={errors.addressLine?.message}
                      {...register('addressLine')}
                    />
                  </div>
                  <FormInput
                    label="จังหวัด"
                    icon={Map}
                    placeholder="กรุงเทพมหานคร"
                    error={errors.province?.message}
                    {...register('province')}
                  />
                  <FormInput
                    label="รหัสไปรษณีย์"
                    icon={Hash}
                    placeholder="10110"
                    error={errors.postalCode?.message}
                    {...register('postalCode')}
                  />
                </div>
              </div>

              {/* 2. Payment Section */}
              <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#22C55E]">
                    <CreditCard size={20} />
                  </div>
                  เลือกช่องทางการชำระเงิน
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* PromptPay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PromptPay')}
                    className={`flex flex-col items-start p-5 rounded-2xl border-2 transition-all text-left ${
                      paymentMethod === 'PromptPay'
                        ? 'border-[#22C55E] bg-emerald-50 shadow-md shadow-emerald-100'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Banknote size={24} className={paymentMethod === 'PromptPay' ? 'text-[#22C55E]' : 'text-slate-400'} />
                    <span className={`font-black mt-3 ${paymentMethod === 'PromptPay' ? 'text-emerald-900' : 'text-slate-700'}`}>โอนเงินผ่านธนาคาร</span>
                    <span className="text-xs text-slate-500 font-medium mt-1">สแกน QR PromptPay ยอดเข้าทันที</span>
                  </button>

                  {/* Credit Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Credit Card')}
                    className={`flex flex-col items-start p-5 rounded-2xl border-2 transition-all text-left ${
                      paymentMethod === 'Credit Card'
                        ? 'border-[#22C55E] bg-emerald-50 shadow-md shadow-emerald-100'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard size={24} className={paymentMethod === 'Credit Card' ? 'text-[#22C55E]' : 'text-slate-400'} />
                    <span className={`font-black mt-3 ${paymentMethod === 'Credit Card' ? 'text-emerald-900' : 'text-slate-700'}`}>บัตรเครดิต/เดบิต</span>
                    <span className="text-xs text-slate-500 font-medium mt-1">รองรับ Visa, Mastercard, JCB</span>
                  </button>
                </div>

                <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm font-medium text-slate-600 leading-relaxed">
                  <ShieldCheck size={20} className="text-blue-500 flex-shrink-0" />
                  <div>ปลอดภัย 100% การชำระเงินของคุณได้รับการเข้ารหัสอย่างปลอดภัยผ่านผู้ให้บริการที่ได้รับมาตรฐานสากล</div>
                </div>
              </div>
            </div>

            {/* ----- Right Summary Column ----- */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 sticky top-24 select-none">
                <h2 className="text-lg font-black text-slate-800 mb-6 pb-4 border-b border-slate-100">สรุปคำสั่งซื้อ</h2>

                {/* Items */}
                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex-shrink-0 p-1">
                        {item.product.mainImageUrl && (
                          <img src={item.product.mainImageUrl} className="w-full h-full object-cover rounded-lg" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-slate-800 line-clamp-2 leading-snug">{item.product.name}</p>
                        <p className="text-xs text-slate-400 mt-1">จำนวน {item.quantity} ชิ้น</p>
                      </div>
                      <p className="text-sm font-black text-[#22C55E]">
                        ฿{(item.product.price * item.quantity).toLocaleString('th-TH')}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Coupon Section */}
                <div className="mb-6 pb-6 border-b border-slate-100">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    <Percent size={13} className="text-slate-400" />
                    รหัสส่วนลด
                  </label>
                  {!discountInfo ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="กรอกรหัสส่วนลด (ถ้ามี)"
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-[#22C55E] focus:bg-white outline-none transition-all placeholder:text-slate-300"
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={isValidatingCoupon || !couponCode.trim()}
                        className="px-5 bg-slate-800 hover:bg-slate-900 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all text-sm flex items-center justify-center min-w-[80px]"
                      >
                        {isValidatingCoupon ? <Loader2 size={16} className="animate-spin" /> : 'ใช้โค้ด'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-emerald-800">{discountInfo.code}</span>
                        <span className="text-xs text-emerald-600 font-medium">ส่วนลดถูกนำไปใช้แล้ว</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-xs font-bold text-red-500 hover:text-red-700 bg-white px-3 py-1.5 rounded-lg border border-red-100 shadow-sm transition-all"
                      >
                        นำออก
                      </button>
                    </div>
                  )}
                </div>

                {/* Price calculations */}
                <div className="space-y-3 mb-6 pt-4 border-t border-slate-100 text-sm font-medium text-slate-600">
                  <div className="flex justify-between items-center">
                    <span>ราคาสินค้า ({totalItems} ชิ้น)</span>
                    <span className="font-bold text-slate-800">฿{totalPrice.toLocaleString('th-TH')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ค่าจัดส่ง</span>
                    {shippingFee === 0 ? (
                      <span className="text-[#22C55E] font-black">ฟรี</span>
                    ) : (
                      <span className="font-bold text-slate-800">฿{shippingFee.toLocaleString('th-TH')}</span>
                    )}
                  </div>
                  {shippingFee === 0 && (
                    <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl flex items-center justify-end gap-1.5 mt-1">
                      <Tag size={12} /> ได้รับสิทธิ์จัดส่งฟรีแล้ว!
                    </div>
                  )}
                  {discountInfo && (
                    <div className="flex justify-between items-center text-[#22C55E] pt-2">
                      <span className="font-bold flex items-center gap-1.5">
                        <Percent size={14} /> ส่วนลดคูปอง ({discountInfo.code})
                      </span>
                      <span className="font-black">-฿{discountInfo.amount.toLocaleString('th-TH')}</span>
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-slate-200 flex items-end justify-between mb-8">
                  <span className="text-base font-black text-slate-800">ยอดรวมทั้งสิ้น</span>
                  <span className="text-3xl font-black text-[#22C55E]">฿{grandTotal.toLocaleString('th-TH')}</span>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#22C55E] hover:bg-[#1eb054] disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-xl shadow-green-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <><Loader2 className="animate-spin" size={20} /> กำลังประมวลผล...</>
                  ) : (
                    <>ยืนยันคำสั่งซื้อและชำระเงิน <ArrowRight size={20} /></>
                  )}
                </button>
              </div>
            </div>

          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
