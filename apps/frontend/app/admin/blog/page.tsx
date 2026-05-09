'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  BookOpen,
  CheckCircle2,
  XCircle,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { API_BASE } from '../../../lib/axios';

// ---- Type ----------------------------------------------------------------

interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  featuredImage?: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- Helpers --------------------------------------------------------------

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getAuthHeaders(): HeadersInit {
  const token = Cookies.get('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ---- Page -----------------------------------------------------------------

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ---------- Fetch (admin endpoint — includes drafts) ----------
  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`${API_BASE}/blogs/admin`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data: Blog[] = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      setFetchError(
        'ไม่สามารถโหลดข้อมูลบทความได้ กรุณาตรวจสอบว่า Backend กำลังทำงานอยู่',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // ---------- Delete ----------
  const handleDelete = async (id: number, title: string) => {
    if (
      !confirm(
        `คุณแน่ใจหรือไม่ว่าต้องการลบ "${title}"?\nการกระทำนี้ไม่สามารถยกเลิกได้`,
      )
    )
      return;
    try {
      const res = await fetch(`${API_BASE}/blogs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error('Failed to delete blog:', error);
      alert('ไม่สามารถลบบทความได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  // ---------- Toggle publish status (optimistic) ----------
  const handleToggleStatus = async (blog: Blog) => {
    const newStatus = !blog.published;

    // Optimistic update
    setBlogs((prev) =>
      prev.map((b) =>
        b.id === blog.id ? { ...b, published: newStatus } : b,
      ),
    );

    try {
      const res = await fetch(`${API_BASE}/blogs/${blog.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ published: newStatus }),
      });
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
    } catch (error) {
      // Revert on failure
      console.error('Failed to toggle status:', error);
      setBlogs((prev) =>
        prev.map((b) =>
          b.id === blog.id ? { ...b, published: blog.published } : b,
        ),
      );
      alert('ไม่สามารถเปลี่ยนสถานะได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  // ---------- Filter ----------
  const filteredBlogs = blogs.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // ---------- Render ----------
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">จัดการบทความ</h1>
          <p className="text-slate-400 text-sm mt-1">
            {isLoading
              ? 'กำลังโหลด...'
              : `จำนวนบทความทั้งหมด ${blogs.length} รายการ`}
          </p>
        </div>
        <Link
          href="/admin/blog/create"
          className="bg-[#22C55E] text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-green-200 hover:bg-[#1eb054] hover:-translate-y-0.5 transition-all flex items-center gap-2 text-sm"
        >
          <Plus size={18} strokeWidth={3} /> เขียนบทความใหม่
        </Link>
      </div>

      {/* --- Search Bar --- */}
      <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
            size={18}
          />
          <input
            type="text"
            placeholder="ค้นหาชื่อบทความ หรือ slug..."
            className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#22C55E]/20 outline-none disabled:opacity-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button
          onClick={fetchBlogs}
          disabled={isLoading}
          className="p-3 rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors disabled:opacity-40"
          title="รีเฟรชข้อมูล"
        >
          <Loader2
            size={18}
            className={isLoading ? 'animate-spin text-[#22C55E]' : ''}
          />
        </button>
      </div>

      {/* --- Blog Table --- */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">
                  ID
                </th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">
                  รูปภาพ
                </th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">
                  ชื่อบทความ
                </th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">
                  Slug
                </th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px]">
                  วันที่สร้าง
                </th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-center">
                  สถานะ
                </th>
                <th className="px-6 py-4 font-black uppercase tracking-widest text-[10px] text-right">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {/* Loading state */}
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                      <Loader2
                        size={32}
                        className="animate-spin text-[#22C55E]"
                      />
                      <p className="font-bold text-sm animate-pulse">
                        กำลังโหลดข้อมูลบทความ...
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {/* Error state */}
              {!isLoading && fetchError && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                        <XCircle size={28} className="text-red-400" />
                      </div>
                      <p className="font-black text-slate-700">
                        โหลดข้อมูลไม่สำเร็จ
                      </p>
                      <p className="text-xs text-slate-400 max-w-sm">
                        {fetchError}
                      </p>
                      <button
                        onClick={fetchBlogs}
                        className="mt-2 px-5 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                      >
                        ลองใหม่อีกครั้ง
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty state */}
              {!isLoading && !fetchError && filteredBlogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                        <BookOpen size={24} className="text-slate-300" />
                      </div>
                      <p className="font-black text-slate-600">
                        {searchTerm
                          ? `ไม่พบบทความที่ตรงกับ "${searchTerm}"`
                          : 'ยังไม่มีบทความในระบบ'}
                      </p>
                      {!searchTerm && (
                        <p className="text-xs font-medium mt-1">
                          คลิกปุ่ม &ldquo;เขียนบทความใหม่&rdquo; เพื่อเริ่มต้น
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!isLoading &&
                !fetchError &&
                filteredBlogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* ID */}
                    <td className="px-6 py-4 align-middle">
                      <span className="font-mono text-[11px] text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                        #{blog.id}
                      </span>
                    </td>

                    {/* Image */}
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {blog.featuredImage ? (
                          <img
                            src={blog.featuredImage}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <BookOpen size={20} className="text-slate-300" />
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-6 py-4 align-middle">
                      <p className="font-bold text-slate-800 max-w-[280px] truncate">
                        {blog.title}
                      </p>
                    </td>

                    {/* Slug */}
                    <td className="px-6 py-4 align-middle">
                      <span className="font-mono text-[11px] text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                        /{blog.slug}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 align-middle">
                      <span className="text-xs text-slate-500 font-medium">
                        {formatDate(blog.createdAt)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(blog)}
                        title="คลิกเพื่อเปลี่ยนสถานะ"
                        className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full transition-all hover:scale-105 active:scale-95 ${
                          blog.published
                            ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                            : 'text-slate-400 bg-slate-100 hover:bg-slate-200'
                        }`}
                      >
                        {blog.published ? (
                          <>
                            <CheckCircle2 size={12} /> เผยแพร่แล้ว
                          </>
                        ) : (
                          <>
                            <XCircle size={12} /> ฉบับร่าง
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {blog.published && (
                          <Link
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            className="p-2 rounded-xl text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-colors"
                            title="ดูหน้าบทความ"
                          >
                            <ExternalLink size={16} />
                          </Link>
                        )}
                        <Link
                          href={`/admin/blog/edit/${blog.slug}`}
                          className="p-2 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                          title="แก้ไข"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.id, blog.title)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="ลบ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
