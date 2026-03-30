'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, UploadCloud, User, MonitorPlay, Loader2, Image as ImageIcon, 
  Type, Link as LinkIcon, Trash2, Eye, EyeOff, Settings, ShoppingBag 
} from 'lucide-react';

const API_BASE = 'http://localhost:4000/api';

const SETTING_KEYS = {
  ADMIN_NAME: 'admin_name',
  ADMIN_AVATAR: 'admin_avatar_url',
  HERO_TITLE: 'home_hero_title',
  HERO_SUBTITLE: 'home_hero_subtitle',
  HERO_MEDIA: 'home_hero_video_url',
  BANNER_ENABLED: 'site_banner_enabled',
  BANNER_IMAGE: 'site_banner_image_url',
  BANNER_LINK: 'site_banner_link',
};

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('general');

  const [settings, setSettings] = useState<Record<string, string>>({
    [SETTING_KEYS.ADMIN_NAME]: '',
    [SETTING_KEYS.ADMIN_AVATAR]: '',
    [SETTING_KEYS.HERO_TITLE]: '',
    [SETTING_KEYS.HERO_SUBTITLE]: '',
    [SETTING_KEYS.HERO_MEDIA]: '',
    [SETTING_KEYS.BANNER_ENABLED]: 'false',
    [SETTING_KEYS.BANNER_IMAGE]: '',
    [SETTING_KEYS.BANNER_LINK]: '',
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // ---------- Fetch Settings ----------
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/settings`);
        if (res.ok) {
          const data = await res.json();
          setSettings((prev) => ({ ...prev, ...data }));
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
  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, settingKey: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert('ขนาดไฟล์ต้องไม่เกิน 50MB');
      return;
    }

    setIsUploading(settingKey);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/uploads/media`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('อัปโหลดไม่สำเร็จ');

      const data = await res.json();
      handleChange(settingKey, data.url);
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการอัปโหลดไฟล์');
      console.error(error);
    } finally {
      setIsUploading(null);
      e.target.value = '';
    }
  };

  const clearMedia = (key: string) => {
    handleChange(key, '');
  };

  // ---------- Submit All ----------
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
      }));

      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload }),
      });

      if (!res.ok) throw new Error('บันทึกการตั้งค่าไม่สำเร็จ');
      
      alert('บันทึกการตั้งค่าระบบเรียบร้อยแล้ว! ✅');
      
      // Reload the page so the Navbar updates its avatar
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

          {/* ================= TAB 1: GENERAL & PROFILE ================= */}
          <div className={`space-y-8 transition-all duration-500 ${activeTab === 'general' ? 'opacity-100 block' : 'hidden opacity-0'}`}>
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-[1.2rem] bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <Settings size={22} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800">ข้อมูลผู้ดูแลระบบ (Admin Profile)</h2>
                  <p className="text-xs font-bold text-slate-400 mt-1">จัดการชื่อและรูปภาพที่จะแสดงใน Navigation Bar</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-10">
                {/* Avatar Column */}
                <div className="flex-shrink-0 w-full md:w-56 space-y-4">
                  <div className="relative w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] overflow-hidden group">
                    {settings[SETTING_KEYS.ADMIN_AVATAR] ? (
                      <>
                        <img src={settings[SETTING_KEYS.ADMIN_AVATAR]} alt="Admin Avatar" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => clearMedia(SETTING_KEYS.ADMIN_AVATAR)}
                          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                        {isUploading === SETTING_KEYS.ADMIN_AVATAR ? (
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
                    onChange={(e) => handleFileUpload(e, SETTING_KEYS.ADMIN_AVATAR)} 
                  />
                  <button 
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={isUploading === SETTING_KEYS.ADMIN_AVATAR}
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
                    value={settings[SETTING_KEYS.ADMIN_NAME]}
                    onChange={(e) => handleChange(SETTING_KEYS.ADMIN_NAME, e.target.value)}
                    placeholder="เช่น Administrator / สมชาย"
                    className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#22C55E]/20 outline-none placeholder:font-normal"
                  />
                  <p className="text-[11px] text-slate-400 mt-3 ml-2 font-medium">ชื่อนี้จะถูกแสดงที่มุมขวาบนของ Admin Dashboard แทนชื่อเริ่มต้น</p>
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
                  <h2 className="text-xl font-black text-slate-800">ส่วนหัวหน้าแรก (Homepage Hero)</h2>
                  <p className="text-xs font-bold text-slate-400 mt-1">ตั้งค่าข้อความและวิดีโอพื้นหลังที่ดึงดูดใจ</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                    หัวข้อหลัก (Main Headline)
                  </label>
                  <input 
                    type="text" 
                    value={settings[SETTING_KEYS.HERO_TITLE]}
                    onChange={(e) => handleChange(SETTING_KEYS.HERO_TITLE, e.target.value)}
                    placeholder="เช่น Smart Hydroponics สำหรับทุกคน"
                    className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#22C55E]/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                    คำโปรยรอง (Sub Headline)
                  </label>
                  <input 
                    type="text" 
                    value={settings[SETTING_KEYS.HERO_SUBTITLE]}
                    onChange={(e) => handleChange(SETTING_KEYS.HERO_SUBTITLE, e.target.value)}
                    placeholder="อธิบายสั้นๆ ดึงดูดลูกค้า..."
                    className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-[#22C55E]/20 outline-none"
                  />
                </div>

                <div className="pt-6 border-t border-slate-50">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex justify-between items-center">
                    <span>วิดีโอ/รูปภาพ พิเศษหลังข้อความ (Background Media)</span>
                  </label>
                  
                  <div className="relative w-full aspect-[21/9] bg-slate-900 rounded-[2rem] overflow-hidden group shadow-inner">
                    {settings[SETTING_KEYS.HERO_MEDIA] ? (
                      <>
                        {settings[SETTING_KEYS.HERO_MEDIA].match(/\.(mp4|webm|mov)$/i) ? (
                          <video 
                            src={settings[SETTING_KEYS.HERO_MEDIA]} 
                            autoPlay loop muted playsInline
                            className="w-full h-full object-cover opacity-80"
                          />
                        ) : (
                          <img src={settings[SETTING_KEYS.HERO_MEDIA]} alt="Hero BGG" className="w-full h-full object-cover opacity-80" />
                        )}
                        
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => clearMedia(SETTING_KEYS.HERO_MEDIA)}
                            className="bg-red-500 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-red-600 transition-colors flex items-center gap-2"
                          >
                            <Trash2 size={16} /> ลบวิดีโอ/รูปภาพนี้
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                        {isUploading === SETTING_KEYS.HERO_MEDIA ? (
                          <Loader2 size={40} className="animate-spin text-[#22C55E]" />
                        ) : (
                          <>
                            <UploadCloud size={48} className="text-slate-600 mb-4 opacity-50" />
                            <p className="font-bold text-sm mb-1">ยังไม่มีสื่อพื้นหลัง</p>
                            <p className="text-xs opacity-70">รองรับ MP4, WEBM หรือรูปภาพ JPG, PNG (Max 50MB)</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <input 
                    type="file" accept="video/*,image/*" className="hidden" ref={heroInputRef}
                    onChange={(e) => handleFileUpload(e, SETTING_KEYS.HERO_MEDIA)} 
                  />
                  <button 
                    onClick={() => heroInputRef.current?.click()}
                    disabled={isUploading === SETTING_KEYS.HERO_MEDIA}
                    className="w-full mt-4 py-4 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-[1.5rem] font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 border border-purple-100"
                  >
                    <UploadCloud size={18} /> อัปโหลดไฟล์สื่อใหม่
                  </button>
                </div>
              </div>
            </div>

            {/* 2.2 Banner Config */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[1.2rem] bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                    <ImageIcon size={22} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800">แบนเนอร์ประชาสัมพันธ์ (Site Banner)</h2>
                    <p className="text-xs font-bold text-slate-400 mt-1">พื้นที่ประกาศส่วนลดหรือแคมเปญต่างๆ</p>
                  </div>
                </div>
                
                {/* Toggle State */}
                <button 
                  onClick={() => handleChange(SETTING_KEYS.BANNER_ENABLED, settings[SETTING_KEYS.BANNER_ENABLED] === 'true' ? 'false' : 'true')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-sm transition-colors ${
                    settings[SETTING_KEYS.BANNER_ENABLED] === 'true' 
                      ? 'bg-emerald-50 text-[#22C55E] border border-emerald-100' 
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {settings[SETTING_KEYS.BANNER_ENABLED] === 'true' ? <Eye size={18} /> : <EyeOff size={18} />}
                  {settings[SETTING_KEYS.BANNER_ENABLED] === 'true' ? 'ระบบเปิดใช้งานแบนเนอร์' : 'ซ่อนแบนเนอร์ไว้'}
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                    รูปภาพแบนเนอร์ (Banner Asset)
                  </label>
                  
                  <div className="relative w-full aspect-[4/1] bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] overflow-hidden group">
                    {settings[SETTING_KEYS.BANNER_IMAGE] ? (
                      <>
                        <img src={settings[SETTING_KEYS.BANNER_IMAGE]} alt="Banner Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => clearMedia(SETTING_KEYS.BANNER_IMAGE)}
                            className="bg-white text-red-500 px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-red-50 transition-colors flex items-center gap-2"
                          >
                            <Trash2 size={16} /> ลบรูปภาพแบนเนอร์นี้
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        {isUploading === SETTING_KEYS.BANNER_IMAGE ? (
                          <Loader2 size={32} className="animate-spin text-[#22C55E]" />
                        ) : (
                          <>
                            <ImageIcon size={32} className="text-slate-300 mb-2" />
                            <p className="text-xs font-bold">แบนเนอร์ยังวางอยู่</p>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <input 
                    type="file" accept="image/*" className="hidden" ref={bannerInputRef}
                    onChange={(e) => handleFileUpload(e, SETTING_KEYS.BANNER_IMAGE)} 
                  />
                  <button 
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={isUploading === SETTING_KEYS.BANNER_IMAGE}
                    className="w-full mt-4 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-[1.5rem] font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <UploadCloud size={16} /> อัปโหลดไฟล์ (เฉพาะรูปภาพแนวนอน)
                  </button>
                </div>

                <div className="pt-4">
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                    <LinkIcon size={14} /> ลิงก์เมื่อผู้ใช้คลิกแบนเนอร์ (Target URL)
                  </label>
                  <input 
                    type="url" 
                    value={settings[SETTING_KEYS.BANNER_LINK]}
                    onChange={(e) => handleChange(SETTING_KEYS.BANNER_LINK, e.target.value)}
                    placeholder="เช่น https://shop.kbon.com/promo หรือ /products/123"
                    className="w-full bg-slate-50 border-none rounded-[1.5rem] py-4 px-6 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#22C55E]/20 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>


          {/* ================= TAB 3: PRODUCT PAGE ================= */}
          <div className={`space-y-8 transition-all duration-500 ${activeTab === 'product' ? 'opacity-100 block' : 'hidden opacity-0'}`}>
            <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag size={32} className="text-slate-300" />
              </div>
              <h2 className="text-xl font-black text-slate-800">การตั้งค่าหน้าสินค้า</h2>
              <p className="text-sm font-bold text-slate-400 mt-2 max-w-sm">
                โมดูลนี้รองรับการตั้งค่าแบนเนอร์หรือแจ้งเตือนแคมเปญเฉพาะหน้าสินค้าในอนาคต!
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
