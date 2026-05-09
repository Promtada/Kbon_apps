'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import RichTextEditor from '../../../../../components/shared/RichTextEditor';
import { ImageUploadField } from '../../../../../components/shared/ImageUploadField';
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { API_BASE } from '../../../../../lib/axios';

// ---- Helpers ---------------------------------------------------------------

function getAuthHeaders(): HeadersInit {
  const token = Cookies.get('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ---- Page ------------------------------------------------------------------

export default function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blogId, setBlogId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    featuredImage: '',
    published: false,
  });

  const [content, setContent] = useState('');

  // ---------- Fetch blog by slug (via admin endpoint) ----------
  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        // First get all blogs (admin), then find by slug
        const res = await fetch(`${API_BASE}/blogs/admin`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);

        const blogs = await res.json();
        const blog = blogs.find((b: any) => b.slug === slug);

        if (!blog) {
          setLoadError('not_found');
          return;
        }

        setBlogId(blog.id);
        setFormData({
          title: blog.title,
          slug: blog.slug,
          featuredImage: blog.featuredImage || '',
          published: blog.published,
        });
        setContent(blog.content);
      } catch (error) {
        console.error('Failed to fetch blog:', error);
        setLoadError('load_error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!blogId) return;

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
      const res = await fetch(`${API_BASE}/blogs/${blogId}`, {
        method: 'PATCH',
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

      alert('อัปเดตบทความเรียบร้อยแล้ว!');
      router.push('/admin/blog');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
      alert(`ไม่สามารถบันทึกได้:\n${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---- Loading state ----
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <Loader2 size={44} className="animate-spin text-[#22C55E]" />
          <p className="font-bold text-sm animate-pulse">
            กำลังโหลดข้อมูลบทความ...
          </p>
        </div>
      </div>
    );
  }

  // ---- Error state ----
  if (loadError) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={32} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3">
            {loadError === 'not_found'
              ? 'ไม่พบบทความ'
              : 'เกิดข้อผิดพลาด'}
          </h2>
          <p className="text-slate-400 font-medium mb-6">
            {loadError === 'not_found'
              ? `ไม่พบบทความ slug "${slug}" ในระบบ`
              : 'ไม่สามารถโหลดข้อมูลบทความได้'}
          </p>
          <Link
            href="/admin/blog"
            className="px-6 py-3 bg-[#22C55E] text-white rounded-2xl font-black text-sm shadow-lg shadow-green-200 hover:bg-[#1eb054] transition-all"
          >
            ← กลับหน้าจัดการบทความ
          </Link>
        </div>
      </div>
    );
  }

  // ---- Main render ----
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
              แก้ไขบทความ
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
              Edit Blog Post — #{blogId}
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
                <Save size={18} /> บันทึกการแก้ไข
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
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
                  Slug (URL) <span className="text-red-500">*</span>
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
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
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

          {/* Info */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h2 className="text-sm font-black text-slate-800 mb-4 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px]">
                4
              </span>{' '}
              ข้อมูลสรุป
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">ID</span>
                <span className="font-mono text-slate-600">#{blogId}</span>
              </div>
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
