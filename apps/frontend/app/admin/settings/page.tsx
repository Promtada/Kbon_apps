'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, UploadCloud, User, MonitorPlay, Loader2, Image as ImageIcon, 
  Type, Link as LinkIcon, Trash2, Eye, EyeOff, Settings, ShoppingBag, Plus, Info 
} from 'lucide-react';

const API_BASE = 'http://localhost:4000/api';

export interface SiteBanner {
  id?: string;
  imageUrl: string;
  targetUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Testimonial {
  id?: string;
  authorName: string;
  authorRole?: string;
  content: string;
  avatarUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface SystemSetting {
  adminName?: string;
  adminAvatarUrl?: string;
  mainHeadline?: string;
  subHeadline?: string;
  heroMediaUrl?: string;
  bannerEnabled?: boolean;
  productPageHeadline?: string;
  productPageSubHeadline?: string;
  productPageBannerUrl?: string;
  banners: SiteBanner[];
  testimonials: Testimonial[];
}

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('general');

  const [settings, setSettings] = useState<SystemSetting>({
    adminName: '',
    adminAvatarUrl: '',
    mainHeadline: '',
    subHeadline: '',
    heroMediaUrl: '',
    bannerEnabled: false,
    productPageHeadline: '',
    productPageSubHeadline: '',
    productPageBannerUrl: '',
    banners: [],
    testimonials: [],
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  // ---------- Fetch Settings ----------
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/settings`);
        if (res.ok) {
          const data = await res.json();
          // Merge with defaults
          setSettings({
            adminName: data.adminName || '',
            adminAvatarUrl: data.adminAvatarUrl || '',
            mainHeadline: data.mainHeadline || '',
            subHeadline: data.subHeadline || '',
            heroMediaUrl: data.heroMediaUrl || '',
            bannerEnabled: data.bannerEnabled || false,
            productPageHeadline: data.productPageHeadline || '',
            productPageSubHeadline: data.productPageSubHeadline || '',
            productPageBannerUrl: data.productPageBannerUrl || '',
            banners: data.banners || [],
            testimonials: data.testimonials || [],
          });
        }
      } catch (error) {
        console.warn('Failed to fetch settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // ---------- Handlers ----------
  const handleChange = (key: keyof SystemSetting, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleBannerChange = (index: number, key: keyof SiteBanner, value: any) => {
    setSettings((prev) => {
      const newBanners = [...prev.banners];
      newBanners[index] = { ...newBanners[index], [key]: value };
      return { ...prev, banners: newBanners };
    });
  };

  const addBanner = () => {
    setSettings((prev) => ({
      ...prev,
      banners: [
        ...prev.banners,
        { imageUrl: '', targetUrl: '', isActive: true, sortOrder: prev.banners.length }
      ]
    }));
  };

  const removeBanner = (index: number) => {
    setSettings((prev) => {
      const newBanners = prev.banners.filter((_, i) => i !== index);
      return { ...prev, banners: newBanners };
    });
  };

  const handleTestimonialChange = (index: number, key: keyof Testimonial, value: any) => {
    setSettings((prev) => {
      const newTs = [...prev.testimonials];
      newTs[index] = { ...newTs[index], [key]: value };
      return { ...prev, testimonials: newTs };
    });
  };

  const addTestimonial = () => {
    setSettings((prev) => ({
      ...prev,
      testimonials: [
        ...prev.testimonials,
        { authorName: '', authorRole: '', content: '', avatarUrl: '', isActive: true, sortOrder: prev.testimonials.length }
      ]
    }));
  };

  const removeTestimonial = (index: number) => {
    setSettings((prev) => {
      const newTs = prev.testimonials.filter((_, i) => i !== index);
      return { ...prev, testimonials: newTs };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, bannerIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert('ขนาดไฟล์ต้องไม่เกิน 50MB');
      return;
    }

    let uploadKey = fieldName;
    if (fieldName === 'banner' && bannerIndex !== undefined) uploadKey = `banner_${bannerIndex}`;
    else if (fieldName === 'testimonial' && bannerIndex !== undefined) uploadKey = `testimonial_${bannerIndex}`;

    setIsUploading(uploadKey);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/uploads/media`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('อัปโหลดไม่สำเร็จ');

      const data = await res.json();
      if (fieldName === 'banner' && bannerIndex !== undefined) {
        handleBannerChange(bannerIndex, 'imageUrl', data.url);
      } else if (fieldName === 'testimonial' && bannerIndex !== undefined) {
        handleTestimonialChange(bannerIndex, 'avatarUrl', data.url);
      } else {
        handleChange(fieldName as keyof SystemSetting, data.url);
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
      console.error(error);
    } finally {
      setIsUploading(null);
      e.target.value = '';
    }
  };

  const clearMedia = (key: keyof SystemSetting) => {
    handleChange(key, '');
  };

  // ---------- Submit All ----------
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error('บันทึกการตั้งค่าไม่สำเร็จ');
      
      alert('บันทึกการตั้งค่าระบบเรียบร้อยแล้ว');
      window.location.reload();
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Loading UI ----------
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto pb-20 flex flex-col items-center justify-center min-h-[60vh] gap-4 text-slate-400">
        <Loader2 size={40} className="animate-spin text-[#22C55E]" />
        <p className="font-bold text-sm animate-pulse">กำลังโหลดการตั้งค่าระบบ...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- Sticky Header --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 sticky top-24 z-30">
        <div>
          <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
            การตั้งค่าระบบ <span className="text-[#22C55E]">(System Settings)</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Global Content & Assets Management
          </p>
        </div>
        
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full md:w-auto bg-[#22C55E] text-white px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-green-200 hover:bg-[#1eb054] transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm shrink-0"
        >
          {isSubmitting ? <><Loader2 size={18} className="animate-spin"/> กำลังบันทึก...</> : <><Save size={18} /> บันทึกการตั้งค่าทั้งหมด</>}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* --- Sidebar Tabs (Left) --- */}
        <div className="lg:w-64 w-full shrink-0 flex flex-col gap-2 sticky top-52">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-3 px-5 py-4 rounded-3xl font-bold text-sm transition-all duration-300 ${
              activeTab === 'general' 
                ? 'bg-[#22C55E] text-white shadow-xl shadow-green-100 translate-x-1' 
                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-slate-100'
            }`}
          >
            <User size={18} /> ข้อมูลทั่วไป (Profile)
          </button>
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-3 px-5 py-4 rounded-3xl font-bold text-sm transition-all duration-300 ${
              activeTab === 'home' 
                ? 'bg-[#22C55E] text-white shadow-xl shadow-green-100 translate-x-1' 
                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-slate-100'
            }`}
          >
            <MonitorPlay size={18} /> หน้าแรก (Home Page)
          </button>
          <button 
            onClick={() => setActiveTab('product')}
            className={`flex items-center gap-3 px-5 py-4 rounded-3xl font-bold text-sm transition-all duration-300 ${
              activeTab === 'product' 
                ? 'bg-[#22C55E] text-white shadow-xl shadow-green-100 translate-x-1' 
                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-slate-100'
            }`}
          >
            <ShoppingBag size={18} /> หน้าสินค้า (Product Page)
          </button>
        </div>

        {/* --- Main View Container (Right) --- */}
        <div className="flex-1 w-full min-w-0 space-y-8 pb-10">

          {/* ================= TAB 1: GENERAL ================= */}
          <div className={`space-y-8 transition-all duration-500 ${activeTab === 'general' ? 'opacity-100 block' : 'hidden opacity-0'}`}>
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-[1.2rem] bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <Settings size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800">ข้อมูลผู้ดูแลระบบ (Admin Profile)</h2>
                  <p className="text-xs font-medium text-slate-500 mt-2 flex items-center bg-slate-50 py-2 px-3 rounded-lg border border-slate-100 w-fit">
                    <Info className="w-4 h-4 mr-2 text-blue-500 shrink-0" />
                    จัดการชื่อและรูปภาพประจำตัวสำหรับแสดงผลในระบบ
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-10">
                {/* Avatar Column */}
                <div className="flex-shrink-0 w-full md:w-56 space-y-4">
                  <div className="relative w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] overflow-hidden group">
                    {settings.adminAvatarUrl ? (
                      <>
                        <img src={settings.adminAvatarUrl} alt="Admin Avatar" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => clearMedia('adminAvatarUrl')}
                          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                        {isUploading === 'adminAvatarUrl' ? (
                          <Loader2 size={32} className="animate-spin text-blue-500 mb-2" />
                        ) : (
                          <>
                            <ImageIcon size={32} className="text-slate-300 mb-3" />
                            <p className="text-xs font-bold">ว่างเปล่า</p>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">ขนาดแนะนำ <br/> 300x300px</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <input 
                    type="file" accept="image/*" className="hidden" ref={avatarInputRef}
                    onChange={(e) => handleFileUpload(e, 'adminAvatarUrl')} 
                  />
                  <button 
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploading === 'adminAvatarUrl'}
                    className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <UploadCloud size={16} />อัปโหลดภาพโปรไฟล์
                  </button>
                </div>

                {/* Info Column */}
                <div className="flex-1 pt-2">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                    <Type size={14} /> ชื่อแสดงผล (Display Name)
                  </label>
                  <input 
                    type="text" 
                    value={settings.adminName || ''}
                    onChange={(e) => handleChange('adminName', e.target.value)}
                    placeholder="เช่น Administrator / สมชาย"
                    className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#22C55E]/20 outline-none placeholder:font-normal"
                  />
                  <p className="text-[11px] text-slate-500 mt-3 ml-2 font-medium flex items-center">
                    <Info className="w-3 h-3 mr-1.5 text-slate-400" /> ชื่อนี้จะถูกนำไปแสดงในมุมขวาบนของ Admin Dashboard
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= TAB 2: HOME PAGE ================= */}
          <div className={`space-y-8 transition-all duration-500 ${activeTab === 'home' ? 'opacity-100 block' : 'hidden opacity-0'}`}>
            
            {/* 2.1 Hero Section Config */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-[1.2rem] bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                  <MonitorPlay size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800">ส่วนหัวหน้าแรก (Homepage Hero Text)</h2>
                  <p className="text-xs font-medium text-slate-500 mt-2 flex items-center bg-slate-50 py-2 px-3 rounded-lg border border-slate-100 w-fit">
                    <Info className="w-4 h-4 mr-2 text-purple-500 shrink-0" />
                    กำหนดข้อความต้อนรับที่จะวางซ้อนทับภาพแบนเนอร์ในส่วนหัวหน้าแรกของเว็บไซต์
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                    หัวข้อหลัก (Main Headline)
                  </label>
                  <input 
                    type="text" 
                    value={settings.mainHeadline || ''}
                    onChange={(e) => handleChange('mainHeadline', e.target.value)}
                    placeholder="เช่น Smart Hydroponics สำหรับทุกคน"
                    className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#22C55E]/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                    คำโปรยรอง (Sub Headline)
                  </label>
                  <textarea 
                    value={settings.subHeadline || ''}
                    onChange={(e) => handleChange('subHeadline', e.target.value)}
                    placeholder="อธิบายสั้นๆ ดึงดูดลูกค้า..."
                    rows={3}
                    className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-[#22C55E]/20 outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* 2.2 Banners Config */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[1.2rem] bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <ImageIcon size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800">แบนเนอร์สไลด์ (Hero Carousel)</h2>
                    <p className="text-xs font-medium text-slate-500 mt-2 flex items-center bg-slate-50 py-2 px-3 rounded-lg border border-slate-100 w-fit">
                      <Info className="w-4 h-4 mr-2 text-orange-500 shrink-0" />
                      จัดการภาพพื้นหลังที่จะหมุนเวียนแสดงแบบสไลด์ (Carousel) ในหน้าแรก
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {settings.banners.map((banner, index) => (
                  <div key={index} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 relative group">
                    <button 
                      onClick={() => removeBanner(index)}
                      className="absolute -top-3 -right-3 bg-red-100 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full shadow-sm transition-colors z-10"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Banner Image */}
                      <div className="w-full md:w-64 space-y-3">
                        <div className="relative w-full aspect-[21/9] bg-slate-200 rounded-2xl overflow-hidden shadow-inner">
                          {banner.imageUrl ? (
                            <img src={banner.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                              {isUploading === `banner_${index}` ? <Loader2 className="animate-spin" /> : <ImageIcon size={24} />}
                            </div>
                          )}
                        </div>
                        
                        <input 
                          type="file" accept="image/*" className="hidden"
                          id={`banner-upload-${index}`}
                          onChange={(e) => handleFileUpload(e, 'banner', index)} 
                        />
                        <button 
                          onClick={() => document.getElementById(`banner-upload-${index}`)?.click()}
                          disabled={isUploading === `banner_${index}`}
                          className="w-full py-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl font-bold text-xs text-slate-600 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                        >
                          <UploadCloud size={14} /> อัปโหลดภาพ
                        </button>
                      </div>

                      {/* Banner Info */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ลิงก์เมื่อคลิก (Target URL)</label>
                          <input 
                            type="url" 
                            value={banner.targetUrl || ''}
                            onChange={(e) => handleBannerChange(index, 'targetUrl', e.target.value)}
                            placeholder="เช่น /products/123"
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#22C55E]/20 outline-none"
                          />
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-600">
                            <input 
                              type="checkbox" 
                              checked={banner.isActive}
                              onChange={(e) => handleBannerChange(index, 'isActive', e.target.checked)}
                              className="w-4 h-4 text-[#22C55E] focus:ring-[#22C55E] rounded block" 
                            />
                            แสดงผลอยู่ (Active)
                          </label>
                          
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                            <span>ลำดับ:</span>
                            <input 
                              type="number" 
                              value={banner.sortOrder}
                              onChange={(e) => handleBannerChange(index, 'sortOrder', parseInt(e.target.value) || 0)}
                              className="w-16 bg-white border border-slate-200 rounded-lg py-1 px-2 text-center text-slate-900 font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={addBanner}
                  className="w-full py-6 bg-emerald-50/50 hover:bg-emerald-50 text-[#22C55E] font-black tracking-widest text-xs uppercase border-2 border-dashed border-emerald-200 hover:border-emerald-400 rounded-[2rem] flex items-center justify-center gap-2 transition-all"
                >
                  <Plus size={18} /> เพิ่มแบนเนอร์ใหม่
                </button>
              </div>

            </div>

            {/* 2.3 Testimonials Config (New) */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[1.2rem] bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                    <User size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800">เสียงจากผู้ใช้งานจริง (Testimonials)</h2>
                    <p className="text-xs font-medium text-slate-500 mt-2 flex items-center bg-slate-50 py-2 px-3 rounded-lg border border-slate-100 w-fit">
                      <Info className="w-4 h-4 mr-2 text-indigo-500 shrink-0" />
                      ควบคุมความประทับใจของลูกค้าที่ร่วมแบ่งปันประสบการณ์ในการใช้งาน
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {settings.testimonials.map((testimonial, index) => (
                  <div key={index} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 relative group">
                    <button 
                      onClick={() => removeTestimonial(index)}
                      className="absolute -top-3 -right-3 bg-red-100 text-red-500 hover:bg-red-500 hover:text-white p-2 rounded-full shadow-sm transition-colors z-10"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="flex flex-col xl:flex-row gap-6">
                      {/* Avatar Image */}
                      <div className="w-24 shrink-0 flex flex-col items-center gap-2">
                        <div className="relative w-20 h-20 bg-slate-100 rounded-full border border-slate-200 overflow-hidden shadow-inner flex shrink-0">
                          {testimonial.avatarUrl ? (
                            <img src={testimonial.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-slate-300">
                              {isUploading === `testimonial_${index}` ? <Loader2 className="animate-spin" /> : <User size={24} />}
                            </div>
                          )}
                        </div>
                        <input 
                          type="file" accept="image/*" className="hidden"
                          id={`testimonial-upload-${index}`}
                          onChange={(e) => handleFileUpload(e, 'testimonial', index)} 
                        />
                        <button 
                          onClick={() => document.getElementById(`testimonial-upload-${index}`)?.click()}
                          disabled={isUploading === `testimonial_${index}`}
                          className="w-full py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg font-bold text-[10px] text-slate-500 transition-colors"
                        >
                          เปลี่ยนรูป
                        </button>
                      </div>

                      {/* Content Fields */}
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ชื่อผู้ใช้งาน</label>
                            <input 
                              type="text" 
                              value={testimonial.authorName}
                              onChange={(e) => handleTestimonialChange(index, 'authorName', e.target.value)}
                              placeholder="เช่น คุณสมชาย"
                              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#22C55E]/20 outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ตำแหน่ง / อาชีพ</label>
                            <input 
                              type="text" 
                              value={testimonial.authorRole || ''}
                              onChange={(e) => handleTestimonialChange(index, 'authorRole', e.target.value)}
                              placeholder="เช่น เจ้าของฟาร์ม Organic"
                              className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#22C55E]/20 outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">ข้อความรีวิว</label>
                          <textarea 
                            value={testimonial.content}
                            onChange={(e) => handleTestimonialChange(index, 'content', e.target.value)}
                            placeholder="ระบบรดน้ำอัตโนมัติช่วยประหยัดเวลาได้เยอะมาก..."
                            rows={2}
                            className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#22C55E]/20 outline-none resize-none"
                          />
                        </div>
                        
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer text-sm font-bold text-slate-600">
                            <input 
                              type="checkbox" 
                              checked={testimonial.isActive}
                              onChange={(e) => handleTestimonialChange(index, 'isActive', e.target.checked)}
                              className="w-4 h-4 text-[#22C55E] focus:ring-[#22C55E] rounded block" 
                            />
                            แสดลผล (Active)
                          </label>
                          <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                            <span>ลำดับ:</span>
                            <input 
                              type="number" 
                              value={testimonial.sortOrder}
                              onChange={(e) => handleTestimonialChange(index, 'sortOrder', parseInt(e.target.value) || 0)}
                              className="w-16 bg-white border border-slate-200 rounded-lg py-1 px-2 text-center text-slate-900 font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button 
                  onClick={addTestimonial}
                  className="w-full py-6 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-500 font-black tracking-widest text-xs uppercase border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-[2rem] flex items-center justify-center gap-2 transition-all"
                >
                  <Plus size={18} /> เพิ่มรีวิวจากลูกค้า
                </button>
              </div>

            </div>
          </div>


          {/* ================= TAB 3: PRODUCT PAGE ================= */}
          <div className={`space-y-8 transition-all duration-500 ${activeTab === 'product' ? 'opacity-100 block' : 'hidden opacity-0'}`}>
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-[1.2rem] bg-pink-50 text-pink-500 flex items-center justify-center shrink-0">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800">ส่วนหัวหน้าสินค้า (Product Page Banner)</h2>
                  <p className="text-xs font-medium text-slate-500 mt-2 flex items-center bg-slate-50 py-2 px-3 rounded-lg border border-slate-100 w-fit">
                    <Info className="w-4 h-4 mr-2 text-pink-500 shrink-0" />
                    กำหนดเนื้อหาภาพรวมและเอกลักษณ์ที่แสดงผลบนหน้าต่างสินค้ารวม (/products)
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                    <Type size={14} /> หัวข้อหลักหน้าสินค้า (Main Headline)
                  </label>
                  <input 
                    type="text" 
                    value={settings.productPageHeadline || ''}
                    onChange={(e) => handleChange('productPageHeadline', e.target.value)}
                    placeholder="เช่น Kbon Store"
                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-4 px-6 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#22C55E]/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                    <Type size={14} /> คำโปรยรอง (Sub Headline)
                  </label>
                  <textarea 
                    value={settings.productPageSubHeadline || ''}
                    onChange={(e) => handleChange('productPageSubHeadline', e.target.value)}
                    placeholder="เช่น Discover high-end hydroponic solutions..."
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-4 px-6 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-[#22C55E]/20 outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                    <ImageIcon size={14} /> ภาพพื้นหลังแบนเนอร์ (Background Banner)
                  </label>
                  <div className="relative w-full aspect-[21/9] md:aspect-[3/1] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] overflow-hidden group">
                    {settings.productPageBannerUrl ? (
                      <>
                        <img src={settings.productPageBannerUrl} alt="Product Page Banner" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => clearMedia('productPageBannerUrl')}
                          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                        {isUploading === 'productPageBannerUrl' ? (
                          <Loader2 size={32} className="animate-spin text-pink-500 mb-2" />
                        ) : (
                          <>
                            <UploadCloud size={32} className="text-slate-300 mb-3" />
                            <p className="text-xs font-bold">ว่างเปล่า</p>
                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">ลากวาง หรือคลิกปุ่มเพื่ออัปโหลด</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <input 
                    type="file" accept="image/*" className="hidden" id="product-banner-upload"
                    onChange={(e) => handleFileUpload(e, 'productPageBannerUrl')} 
                  />
                  <button 
                    onClick={() => document.getElementById('product-banner-upload')?.click()}
                    disabled={isUploading === 'productPageBannerUrl'}
                    className="w-full py-4 mt-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <UploadCloud size={16} /> อัปโหลดภาพแบนเนอร์
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
