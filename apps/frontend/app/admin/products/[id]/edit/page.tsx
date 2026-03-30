'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, UploadCloud, Save, Plus, Trash2,
  ShieldCheck, Eye, EyeOff, Loader2,
} from 'lucide-react';
import { ProductImageUpload } from '../../../../../components/shared/ProductImageUpload';
import { ImageUploadField } from '../../../../../components/shared/ImageUploadField';

const API_BASE = 'http://localhost:4000/api';

// ---- Types ----------------------------------------------------------------

interface IncludedItem {
  title: string;
  subtitle: string;
  imageUrl: string;
}

interface TechSpec {
  title: string;
  description: string;
}

interface FormData {
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  stock: string;
  description: string;
  warranty: string;
  isPublished: boolean;
  mainImageUrl: string;
}

// ---- Page -----------------------------------------------------------------

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params); // Next.js 15 async params
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: 'Automation',
    price: '',
    originalPrice: '',
    stock: '',
    description: '',
    warranty: '1 ปี',
    isPublished: true,
    mainImageUrl: '',
  });

  const [features, setFeatures] = useState<string[]>(['']);
  const [includedItems, setIncludedItems] = useState<IncludedItem[]>([{ title: '', subtitle: '', imageUrl: '' }]);
  const [techSpecs, setTechSpecs] = useState<TechSpec[]>([{ title: '', description: '' }]);

  // ---------- Fetch existing product ----------
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await fetch(`${API_BASE}/products/${id}`);
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();

        setFormData({
          name: data.name ?? '',
          category: data.category ?? 'Automation',
          price: data.price?.toString() ?? '',
          originalPrice: data.originalPrice?.toString() ?? '',
          stock: data.stock?.toString() ?? '',
          description: data.description ?? '',
          warranty: data.warranty ?? '1 ปี',
          isPublished: data.isPublished ?? false,
          mainImageUrl: data.mainImageUrl ?? '',
        });

        setFeatures(data.features?.length > 0 ? data.features : ['']);
        setIncludedItems(data.includedItems?.length > 0 ? data.includedItems : [{ title: '', subtitle: '', imageUrl: '' }]);
        setTechSpecs(data.techSpecs?.length > 0 ? data.techSpecs : [{ title: '', description: '' }]);
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setFetchError('ไม่สามารถโหลดข้อมูลสินค้าได้');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ---------- Form helpers ----------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const next = [...features];
    next[index] = value;
    setFeatures(next);
  };

  const addFeature = () => setFeatures([...features, '']);
  const removeFeature = (index: number) => {
    if (features.length > 1) setFeatures(features.filter((_, i) => i !== index));
  };

  const handleIncludedItemChange = (index: number, field: keyof IncludedItem, value: string) => {
    const next = [...includedItems];
    next[index][field] = value;
    setIncludedItems(next);
  };
  const addIncludedItem = () => setIncludedItems([...includedItems, { title: '', subtitle: '', imageUrl: '' }]);
  const removeIncludedItem = (index: number) => {
    setIncludedItems(includedItems.filter((_, i) => i !== index));
  };

  const handleTechSpecChange = (index: number, field: keyof TechSpec, value: string) => {
    const next = [...techSpecs];
    next[index][field] = value;
    setTechSpecs(next);
  };
  const addTechSpec = () => setTechSpecs([...techSpecs, { title: '', description: '' }]);
  const removeTechSpec = (index: number) => {
    setTechSpecs(techSpecs.filter((_, i) => i !== index));
  };

  // ---------- Submit — PATCH ----------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      originalPrice: formData.originalPrice !== '' ? Number(formData.originalPrice) : undefined,
      stock: Number(formData.stock),
      category: formData.category,
      warranty: formData.warranty,
      isPublished: formData.isPublished,
      features: features.filter((f) => f.trim() !== ''),
      includedItems: includedItems.filter((item) => item.title.trim() !== ''),
      techSpecs: techSpecs.filter((spec) => spec.title.trim() !== ''),
      mainImageUrl: formData.mainImageUrl || undefined,
    };

    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const message = errorData?.message
          ? Array.isArray(errorData.message)
            ? errorData.message.join('\n')
            : errorData.message
          : `เกิดข้อผิดพลาด (${res.status})`;
        throw new Error(message);
      }

      alert('บันทึกการแก้ไขเรียบร้อยแล้ว! ✅');
      router.push('/admin/products');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
      alert(`ไม่สามารถบันทึกข้อมูลได้:\n${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Loading / Error skeleton ----------
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto pb-20 flex flex-col items-center justify-center min-h-[60vh] gap-4 text-slate-400">
        <Loader2 size={40} className="animate-spin text-[#22C55E]" />
        <p className="font-bold text-sm animate-pulse">กำลังโหลดข้อมูลสินค้า...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-5xl mx-auto pb-20 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="font-black text-slate-700 text-lg">{fetchError}</p>
        <Link href="/admin/products" className="px-6 py-3 bg-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-colors text-sm">
          ← กลับไปรายการสินค้า
        </Link>
      </div>
    );
  }

  // ---------- Render ----------
  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 sticky top-24 z-30">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-800">แก้ไขสินค้า</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
              Edit Product · <span className="font-mono">{id.slice(0, 8)}…</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Toggle Status */}
          <button
            type="button"
            onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
              formData.isPublished ? 'bg-emerald-50 text-[#22C55E]' : 'bg-slate-50 text-slate-400'
            }`}
          >
            {formData.isPublished ? <Eye size={18} /> : <EyeOff size={18} />}
            {formData.isPublished ? 'แสดงผล' : 'ซ่อนไว้ก่อน'}
          </button>

          <Link href="/admin/products" className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors text-sm">
            ยกเลิก
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 md:flex-none bg-[#22C55E] text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-green-200 hover:bg-[#1eb054] transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            {isSubmitting ? 'กำลังบันทึก...' : <><Save size={18} /> บันทึกการแก้ไข</>}
          </button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* --- Main Content (Left Column) --- */}
        <div className="lg:col-span-2 space-y-8">

          {/* Section 1: ข้อมูลทั่วไป */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-sm">1</span>
              ข้อมูลพื้นฐาน (Basic Info)
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  ชื่อสินค้า (Product Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text" name="name" required
                  value={formData.name}
                  placeholder="เช่น Growee Pro Combo - Smart Dosing System"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#22C55E]/20 outline-none placeholder:font-normal"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  รายละเอียดสินค้า (Description)
                </label>
                <textarea
                  name="description" rows={5}
                  value={formData.description}
                  placeholder="อธิบายว่าสินค้านี้คืออะไร เหมาะกับใคร..."
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm text-slate-700 focus:ring-2 focus:ring-[#22C55E]/20 outline-none resize-none leading-relaxed"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Section 2: คุณสมบัติเด่น */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center text-sm">2</span>
                คุณสมบัติเด่น (Key Features)
              </h2>
              <button type="button" onClick={addFeature} className="text-[#22C55E] hover:text-[#1eb054] font-bold text-sm flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl">
                <Plus size={16} /> เพิ่ม
              </button>
            </div>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#22C55E] flex-shrink-0" />
                  <input
                    type="text"
                    value={feature}
                    placeholder={`คุณสมบัติข้อที่ ${index + 1}`}
                    className="flex-1 bg-slate-50 border-none rounded-xl py-3 px-4 text-sm font-bold text-slate-800 placeholder:font-normal placeholder:text-slate-300 focus:ring-2 focus:ring-[#22C55E]/20 outline-none"
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    disabled={features.length <= 1}
                    className={`p-3 rounded-xl transition-colors ${features.length > 1 ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-slate-200 cursor-not-allowed'}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: สิ่งที่รวมอยู่ในกล่อง */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-emerald-50 text-[#22C55E] flex items-center justify-center text-sm">3</span>
                อุปกรณ์ในกล่อง (What's in the box?)
              </h2>
            </div>

            <div className="space-y-4">
              {includedItems.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-slate-50 rounded-2xl relative">
                  <button
                    type="button"
                    onClick={() => removeIncludedItem(index)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors bg-white p-2 rounded-xl shadow-sm z-10"
                    title="ลบ"
                  >
                    <Trash2 size={16} />
                  </button>

                  <ImageUploadField 
                    value={item.imageUrl}
                    onChange={(url) => handleIncludedItemChange(index, 'imageUrl', url)}
                  />

                  <div className="flex-1 w-full sm:pr-10">
                    <input
                      type="text"
                      placeholder="ชื่ออุปกรณ์ (เช่น pH Balancer)"
                      value={item.title}
                      className="w-full bg-white border border-slate-100 rounded-xl py-3 px-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#22C55E]/20 outline-none mb-3"
                      onChange={(e) => handleIncludedItemChange(index, 'title', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="คำอธิบายสั้นๆ (เช่น Balance pH Up and Down)"
                      value={item.subtitle}
                      className="w-full bg-white border border-slate-100 rounded-xl py-3 px-4 text-sm text-slate-600 focus:ring-2 focus:ring-[#22C55E]/20 outline-none"
                      onChange={(e) => handleIncludedItemChange(index, 'subtitle', e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <button type="button" onClick={addIncludedItem} className="w-full py-4 rounded-2xl border-2 border-dashed border-[#22C55E]/30 text-[#22C55E] font-bold text-sm hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
                <Plus size={16} /> เพิ่มอุปกรณ์
              </button>
            </div>
          </div>

          {/* Section 4: สเปคเทคนิค */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-sm">4</span>
                ข้อมูลทางเทคนิค (Tech Specs)
              </h2>
            </div>

            <div className="space-y-4">
              {techSpecs.map((spec, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50 rounded-2xl relative sm:pr-14">
                  <button
                    type="button"
                    onClick={() => removeTechSpec(index)}
                    className="absolute top-4 right-4 sm:top-1/2 sm:-translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors bg-white p-2 rounded-xl shadow-sm"
                    title="ลบ"
                  >
                    <Trash2 size={16} />
                  </button>
                  <input
                    type="text"
                    placeholder="หัวข้อ (เช่น การเชื่อมต่อ)"
                    value={spec.title}
                    className="flex-1 bg-white border border-slate-100 rounded-xl py-2 px-3 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#22C55E]/20 outline-none mb-2 sm:mb-0"
                    onChange={(e) => handleTechSpecChange(index, 'title', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="รายละเอียด (เช่น WiFi 2.4GHz)"
                    value={spec.description}
                    className="flex-[2] bg-white border border-slate-100 rounded-xl py-2 px-3 text-sm text-slate-600 focus:ring-2 focus:ring-[#22C55E]/20 outline-none"
                    onChange={(e) => handleTechSpecChange(index, 'description', e.target.value)}
                  />
                </div>
              ))}
              <button type="button" onClick={addTechSpec} className="w-full py-4 rounded-2xl border-2 border-dashed border-[#22C55E]/30 text-[#22C55E] font-bold text-sm hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
                <Plus size={16} /> เพิ่มสเปคเทคนิค
              </button>
            </div>
          </div>

        </div>

        {/* --- Sidebar (Right Column) --- */}
        <div className="space-y-8">

          {/* Section 5: รูปภาพ */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">5</span> รูปภาพสินค้า
            </h2>
            <ProductImageUpload 
              value={formData.mainImageUrl}
              onChange={(url: string) => setFormData((prev) => ({ ...prev, mainImageUrl: url }))}
            />
          </div>

          {/* Section 6: ราคา สต็อก หมวดหมู่ การรับประกัน */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">6</span> ราคา สต็อก และหมวดหมู่
            </h2>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                ราคาขายจริง (Sale Price) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">฿</span>
                <input
                  type="number" name="price" required
                  value={formData.price}
                  placeholder="0"
                  className="w-full bg-emerald-50 border-none rounded-2xl py-3 pl-10 pr-4 text-lg focus:ring-2 focus:ring-[#22C55E]/20 outline-none font-black text-[#22C55E]"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                ราคาปกติ (Regular Price)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-300">฿</span>
                <input
                  type="number" name="originalPrice"
                  value={formData.originalPrice}
                  placeholder="0 (เว้นว่างได้)"
                  className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#22C55E]/20 outline-none font-bold text-slate-500"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                จำนวนในคลัง (Stock) <span className="text-red-500">*</span>
              </label>
              <input
                type="number" name="stock" required
                value={formData.stock}
                placeholder="0"
                className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#22C55E]/20 outline-none font-bold text-slate-700"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">หมวดหมู่สินค้า (Category)</label>
              <select
                name="category"
                value={formData.category}
                className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#22C55E]/20 outline-none font-bold text-slate-700"
                onChange={handleChange}
              >
                <option value="Automation">Automation System</option>
                <option value="Set">Combo Set</option>
                <option value="Nutrient">Nutrients &amp; pH</option>
                <option value="Hardware">Hardware Parts</option>
              </select>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">การรับประกัน (Warranty)</label>
              <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl">
                <ShieldCheck size={20} className="text-slate-400 ml-2" />
                <select
                  name="warranty"
                  value={formData.warranty}
                  className="flex-1 bg-transparent border-none py-2 px-2 text-sm focus:ring-0 outline-none font-bold text-slate-700"
                  onChange={handleChange}
                >
                  <option value="ไม่มีรับประกัน">ไม่มีรับประกัน</option>
                  <option value="6 เดือน">6 เดือน</option>
                  <option value="1 ปี">1 ปี</option>
                  <option value="2 ปี">2 ปี</option>
                </select>
              </div>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
}
