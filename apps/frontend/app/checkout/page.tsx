'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../store/useCartStore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { STORAGE_KEYS } from '../../lib/storageKeys';
import { 
  ChevronRight, MapPin, CreditCard, Banknote, ShieldCheck, 
  ArrowRight, Truck, Tag, Loader2
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  
  const [isClient, setIsClient] = useState(false);
  const [address, setAddress] = useState('123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110');
  const [paymentMethod, setPaymentMethod] = useState('PromptPay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const shippingFee = totalPrice >= 1500 ? 0 : 80;
  const grandTotal = totalPrice + shippingFee;

  // Don't render until hydration to avoid mismatch with localStorage Cart
  if (!isClient) return null;

  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar user={user} />
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

  const handleCheckout = async () => {
    setIsSubmitting(true);
    
    // Format cart data for backend
    const payload = {
      shippingAddress: address,
      paymentMethod,
      totalAmount: grandTotal,
      items: items.map(i => ({
        productId: i.product.id,
        quantity: i.quantity,
        price: i.product.price
      }))
    };

    try {
      const res = await fetch('http://localhost:4000/api/orders/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        clearCart();
        router.push('/checkout/success');
      } else {
        alert('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ: ' + data.error);
        setIsSubmitting(false);
      }
    } catch (e) {
      console.error(e);
      alert('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ ลองใหม่อีกครั้ง');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-slate-900">
      <Navbar user={user} />

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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          
          {/* ----- Left Form Column ----- */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* 1. Address Section */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
               <h2 className="text-lg font-black text-slate-800 flex items-center gap-3 mb-5">
                 <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#22C55E]">
                   <MapPin size={20} />
                 </div>
                 ที่อยู่จัดส่งของคุณ
               </h2>
               
               <div className="space-y-4">
                 <div className="space-y-1.5">
                   <label className="text-sm font-bold text-slate-600 block">ข้อมูลที่อยู่โดยละเอียด</label>
                   <textarea 
                     rows={3}
                     value={address}
                     onChange={(e) => setAddress(e.target.value)}
                     placeholder="บ้านเลขที่, ถนน, ซอย, ตำบล/แขวง, อำเภอ/เขต, จังหวัด, รหัสไปรษณีย์"
                     className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-[#22C55E] outline-none transition-all placeholder:text-slate-300 resize-none"
                   />
                 </div>
               </div>
            </div>

            {/* 2. Payment Section */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
               <h2 className="text-lg font-black text-slate-800 flex items-center gap-3 mb-5">
                 <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-[#22C55E]">
                   <CreditCard size={20} />
                 </div>
                 เลือกช่องทางการชำระเงิน
               </h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 
                 {/* Option 1 */}
                 <button 
                  onClick={() => setPaymentMethod('PromptPay')}
                  className={`flex flex-col items-start p-5 rounded-2xl border-2 transition-all text-left ${
                   paymentMethod === 'PromptPay' 
                     ? 'border-[#22C55E] bg-emerald-50 shadow-md shadow-emerald-100' 
                     : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                 }`}>
                   <Banknote size={24} className={paymentMethod === 'PromptPay' ? 'text-[#22C55E]' : 'text-slate-400'} />
                   <span className={`font-black mt-3 ${paymentMethod === 'PromptPay' ? 'text-emerald-900' : 'text-slate-700'}`}>โอนเงินผ่านธนาคาร</span>
                   <span className="text-xs text-slate-500 font-medium mt-1">สแกน QR PromptPay ยอดเข้าทันที</span>
                 </button>

                 {/* Option 2 */}
                 <button 
                  onClick={() => setPaymentMethod('Credit Card')}
                  className={`flex flex-col items-start p-5 rounded-2xl border-2 transition-all text-left ${
                   paymentMethod === 'Credit Card' 
                     ? 'border-[#22C55E] bg-emerald-50 shadow-md shadow-emerald-100' 
                     : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                 }`}>
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

              {/* Items scroll view (compressed) */}
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                {items.map(item => (
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
              </div>

              <div className="pt-5 border-t border-slate-200 flex items-end justify-between mb-8">
                <span className="text-base font-black text-slate-800">ยอดรวมทั้งสิ้น</span>
                <span className="text-3xl font-black text-[#22C55E]">฿{grandTotal.toLocaleString('th-TH')}</span>
              </div>

              {/* Submit CTA */}
              <button 
                onClick={handleCheckout}
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
      </main>
      
      <Footer />
    </div>
  );
}
