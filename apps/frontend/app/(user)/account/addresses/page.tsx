'use client';

import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MapPin, Plus, Edit2, Trash2, Home, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../../../lib/axios';

// ─── Types ───
interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    subdistrict: '',
    district: '',
    province: '',
    postalCode: '',
    isDefault: false,
  });

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/addresses');
      setAddresses(res.data);
    } catch (err) {
      toast.error('ไม่สามารถโหลดที่อยู่ได้');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleOpenModal = (addr?: Address) => {
    if (addr) {
      setEditingAddress(addr);
      setFormData({
        fullName: addr.fullName,
        phone: addr.phone,
        addressLine: addr.addressLine,
        subdistrict: addr.subdistrict || '',
        district: addr.district || '',
        province: addr.province,
        postalCode: addr.postalCode,
        isDefault: addr.isDefault,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        fullName: '',
        phone: '',
        addressLine: '',
        subdistrict: '',
        district: '',
        province: '',
        postalCode: '',
        isDefault: addresses.length === 0 ? true : false,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAddress(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingAddress) {
        await api.put(`/addresses/${editingAddress.id}`, formData);
        toast.success('อัปเดตที่อยู่สำเร็จ');
      } else {
        await api.post('/addresses', formData);
        toast.success('เพิ่มที่อยู่ใหม่สำเร็จ');
      }
      fetchAddresses();
      closeModal();
    } catch (err: any) {
      toast.error('เกิดข้อผิดพลาด', { description: err?.response?.data?.message?.[0] || 'ไม่สามารถบันทึกข้อมูลได้' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบที่อยู่นี้?')) return;
    
    try {
      await api.delete(`/addresses/${id}`);
      toast.success('ลบที่อยู่สำเร็จ');
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      toast.error('ไม่สามารถลบที่อยู่ได้');
    }
  };

  const handleSetDefault = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.put(`/addresses/${id}`, { isDefault: true });
      toast.success('ตั้งเป็นที่อยู่เริ่มต้นสำเร็จ');
      fetchAddresses();
    } catch (err) {
      toast.error('ไม่สามารถตั้งค่าที่อยู่ได้');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
            <MapPin size={22} className="text-[#22C55E]" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">สมุดที่อยู่</h1>
            <p className="text-sm text-slate-400 font-medium mt-0.5">จัดการที่อยู่สำหรับการจัดส่งสินค้า</p>
          </div>
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#22C55E] text-white font-bold text-sm rounded-xl hover:bg-[#1eb054] transition-all shadow-md shadow-green-200"
        >
          <Plus size={18} />
          เพิ่มที่อยู่ใหม่
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-40 bg-white rounded-2xl border border-slate-100 p-5 animate-pulse" />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Home size={32} className="text-[#22C55E] opacity-50" />
          </div>
          <h3 className="font-black text-slate-800 text-lg mb-2">ยังไม่มีที่อยู่จัดส่ง</h3>
          <p className="text-slate-400 font-medium text-sm mb-6 max-w-sm mx-auto">
            เพิ่มที่อยู่จัดส่งของคุณเพื่อให้การสั่งซื้อสินค้ารวดเร็วและสะดวกยิ่งขึ้นในครั้งต่อไป
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#22C55E] text-white font-bold text-sm rounded-xl"
          >
            <Plus size={18} /> เพิ่มที่อยู่แรก
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`relative bg-white p-5 rounded-2xl border-2 transition-all group ${
                address.isDefault ? 'border-[#22C55E] shadow-sm shadow-emerald-50' : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              {address.isDefault && (
                <div className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 w-7 h-7 bg-[#22C55E] rounded-full flex items-center justify-center border-[3px] border-white shadow-sm">
                  <CheckCircle2 size={12} className="text-white" strokeWidth={3} />
                </div>
              )}
              
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-slate-800 text-sm">{address.fullName}</span>
                  {address.isDefault && (
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#22C55E] bg-emerald-50 px-2 py-0.5 rounded-full">
                      ค่าเริ่มต้น
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-500 font-medium">{address.phone}</span>
              </div>
              
              <p className="text-sm text-slate-600 leading-relaxed mb-5 min-h-[60px]">
                {address.addressLine}
                {address.subdistrict && ` ต.${address.subdistrict}`}
                {address.district && ` อ.${address.district}`}
                <br />
                จ.{address.province} {address.postalCode}
              </p>
              
              <div className="flex items-center justify-between border-t border-slate-50 pt-3">
                {!address.isDefault ? (
                  <button
                    onClick={(e) => handleSetDefault(address.id, e)}
                    className="text-xs font-bold text-slate-400 hover:text-[#22C55E] transition-colors"
                  >
                    ตั้งเป็นค่าเริ่มต้น
                  </button>
                ) : (
                  <span />
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(address)}
                    className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-[#22C55E] flex items-center justify-center transition-all"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(address.id, e)}
                    className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Modal ─── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-900/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
          <div className="bg-white w-full max-w-lg rounded-[2rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-[slideUp_0.3s_ease]">
            <h2 className="text-2xl font-black text-slate-800 mb-6 relative z-10">
              {editingAddress ? 'แก้ไขที่อยู่จัดส่ง' : 'เพิ่มที่อยู่จัดส่ง'}
            </h2>
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">ชื่อผู้รับ</label>
                  <input
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] outline-none transition-all"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">เบอร์โทรศัพท์</label>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] outline-none transition-all"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">รายละเอียดที่อยู่ (บ้านเลขที่, ถนน, ซอย)</label>
                  <input
                    required
                    name="addressLine"
                    value={formData.addressLine}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] outline-none transition-all"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">ตำบล/แขวง</label>
                  <input
                    name="subdistrict"
                    value={formData.subdistrict}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] outline-none transition-all"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">อำเภอ/เขต</label>
                  <input
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] outline-none transition-all"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">จังหวัด</label>
                  <input
                    required
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] outline-none transition-all"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">รหัสไปรษณีย์</label>
                  <input
                    required
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-[#22C55E] rounded border-slate-300 focus:ring-[#22C55E]"
                  disabled={addresses.length === 0}
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-slate-700">
                  ตั้งเป็นที่อยู่จัดส่งเริ่มต้น
                </label>
              </div>

              <div className="flex gap-3 pt-6 mt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-[#22C55E] text-white font-bold rounded-xl shadow-md shadow-green-200 hover:bg-[#1eb054] transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-sm"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
