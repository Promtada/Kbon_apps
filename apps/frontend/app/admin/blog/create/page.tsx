'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import RichTextEditor from '../../../../components/shared/RichTextEditor';
import { ImageUploadField } from '../../../../components/shared/ImageUploadField';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { API_BASE } from '../../../../lib/axios';

// ---- Helpers ---------------------------------------------------------------

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function getAuthHeaders(): HeadersInit {
  const token = Cookies.get('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ---- Page ------------------------------------------------------------------

export default function CreateBlogPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    featuredImage: '',
    published: false,
  });

  const [content, setContent] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      ...(autoSlug ? { slug: slugify(title) } : {}),
    }));
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutoSlug(false);
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) {
      alert('กรุณากรอกชื่อบทความ');
      return;
    }
    if (!formData.slug.trim()) {
      alert('กรุณากรอก Slug');
      return;
    }
    if (!content.trim() || content === '<p><br></p>') {
      alert('กรุณาเขียนเนื้อหาบทความ');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      content,
      featuredImage: formData.featuredImage || undefined,
      published: formData.published,
    };

    try {
      const res = await fetch(`${API_BASE}/blogs`, {
        method: 'POST',
        headers: getAuthHeaders(),
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

      alert('บันทึกบทความเรียบร้อยแล้ว!');
      router.push('/admin/blog');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
      alert(`ไม่สามารถบันทึกได้:\n${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- Sticky Header --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 sticky top-24 z-30">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-800">
              เขียนบทความใหม่
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
              Create New Blog Post
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Publish toggle */}
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, published: !formData.published })
            }
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-bold text-sm transition-all ${
              formData.published
                ? 'bg-emerald-50 text-[#22C55E]'
                : 'bg-slate-50 text-slate-400'
            }`}
          >
            {formData.published ? <Eye size={18} /> : <EyeOff size={18} />}
            {formData.published ? 'เผยแพร่' : 'ฉบับร่าง'}
          </button>

          <Link
            href="/admin/blog"
            className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-colors text-sm"
          >
            ยกเลิก
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 md:flex-none bg-[#22C55E] text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-green-200 hover:bg-[#1eb054] transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
          >
            {isSubmitting ? (
              'กำลังบันทึก...'
            ) : (
              <>
                <Save size={18} /> บันทึกบทความ
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Main Content (Left Column) --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* Section 1: Basic Info */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-sm">
                1
              </span>
              ข้อมูลพื้นฐาน (Basic Info)
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  ชื่อบทความ (Title){' '}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  placeholder="เช่น วิธีดูแลผักไฮโดรโปนิกส์เบื้องต้น"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#22C55E]/20 outline-none placeholder:font-normal"
                  onChange={handleTitleChange}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Slug (URL){' '}
                  <span className="text-red-500">*</span>
                  {autoSlug && (
                    <span className="ml-2 normal-case font-medium text-emerald-500">
                      — สร้างอัตโนมัติจากชื่อ
                    </span>
                  )}
                </label>
                <div className="flex items-center bg-slate-50 rounded-2xl">
                  <span className="pl-5 pr-1 text-slate-400 text-sm font-bold">
                    /blog/
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    placeholder="my-blog-post"
                    className="flex-1 bg-transparent border-none rounded-2xl py-4 px-2 text-sm font-mono font-bold text-slate-700 focus:ring-0 outline-none placeholder:font-normal"
                    onChange={handleSlugChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Content Editor */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center text-sm">
                2
              </span>
              เนื้อหาบทความ (Content)
            </h2>

            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </div>

        {/* --- Sidebar (Right Column) --- */}
        <div className="space-y-8">
          {/* Featured Image */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">
                3
              </span>{' '}
              รูปภาพหน้าปก
            </h2>

            <ImageUploadField
              value={formData.featuredImage}
              onChange={(url) =>
                setFormData((prev) => ({ ...prev, featuredImage: url }))
              }
            />

            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
              แนะนำขนาด 1200×630 px สำหรับการแชร์บน Social Media
            </p>
          </div>

          {/* Preview Info */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">
                4
              </span>{' '}
              ข้อมูลสรุป
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">สถานะ</span>
                <span
                  className={`font-bold ${
                    formData.published
                      ? 'text-[#22C55E]'
                      : 'text-slate-400'
                  }`}
                >
                  {formData.published ? 'เผยแพร่' : 'ฉบับร่าง'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">URL</span>
                <span className="font-mono text-xs text-slate-500 truncate max-w-[160px]">
                  /blog/{formData.slug || '...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
