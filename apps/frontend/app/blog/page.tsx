'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { STORAGE_KEYS } from '../../lib/storageKeys';
import { API_BASE } from '../../lib/axios';
import {
  ChevronRight,
  Loader2,
  AlertCircle,
  BookOpen,
  Calendar,
  ArrowRight,
  Newspaper,
} from 'lucide-react';

// ---- Types ----------------------------------------------------------------

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  featuredImage?: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---- Helpers --------------------------------------------------------------

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getReadingTime(): string {
  // Estimate since listing doesn't include content
  return `${Math.floor(Math.random() * 5) + 3} นาที`;
}

// ---- Skeleton -------------------------------------------------------------

function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden animate-pulse flex flex-col">
      <div className="aspect-[16/9] bg-slate-100" />
      <div className="p-6 flex flex-col flex-1 gap-3">
        <div className="flex gap-2">
          <div className="h-5 bg-slate-100 rounded-full w-24" />
          <div className="h-5 bg-slate-100 rounded-full w-16" />
        </div>
        <div className="h-6 bg-slate-100 rounded-full w-4/5" />
        <div className="h-4 bg-slate-100 rounded-full w-full" />
        <div className="h-4 bg-slate-100 rounded-full w-2/3" />
        <div className="mt-auto pt-4">
          <div className="h-5 bg-slate-100 rounded-full w-28" />
        </div>
      </div>
    </div>
  );
}

// ---- Blog Card ------------------------------------------------------------

function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  const isHero = index === 0;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group bg-white rounded-[2rem] border border-slate-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 ${
        isHero ? 'md:col-span-2 md:flex-row' : ''
      }`}
      style={{
        animation: `fadeInUp 500ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 80}ms both`,
      }}
    >
      {/* Image */}
      <div
        className={`relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 ${
          isHero
            ? 'aspect-[16/9] md:aspect-auto md:w-1/2 md:min-h-[320px]'
            : 'aspect-[16/9]'
        }`}
      >
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center">
              <BookOpen size={32} className="text-emerald-300" />
            </div>
          </div>
        )}

        {/* Floating date badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-600 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
          <Calendar size={11} />
          {formatDate(post.createdAt)}
        </div>
      </div>

      {/* Content */}
      <div
        className={`flex flex-col flex-1 p-6 ${
          isHero ? 'md:p-8 lg:p-10 md:justify-center' : ''
        }`}
      >
        {/* Meta row */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            <BookOpen size={10} />
            บทความ
          </span>
        </div>

        {/* Title */}
        <h2
          className={`font-black text-slate-800 tracking-tight leading-tight mb-3 group-hover:text-[#22C55E] transition-colors duration-200 ${
            isHero ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-lg'
          }`}
        >
          {post.title}
        </h2>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Read more */}
        <div className="flex items-center gap-2 text-sm font-bold text-[#22C55E] group-hover:gap-3 transition-all duration-300 mt-4">
          อ่านเพิ่มเติม
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  );
}

// ---- Page -----------------------------------------------------------------

export default function BlogListingPage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore user session
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Fetch published blogs
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/blogs`);
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data: BlogPost[] = await res.json();
        setPosts(data);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
        setError('ไม่สามารถโหลดบทความได้ กรุณาลองใหม่ภายหลัง');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900">
      <Navbar user={user} />

      <main className="flex-grow">
        {/* ── Hero Banner ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 pt-32 pb-24 px-6 md:pt-40 md:pb-32">
          {/* Decorative blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#22C55E]/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-5xl mx-auto relative z-10 text-center">
            {/* Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold uppercase tracking-widest mb-6">
              <Newspaper size={14} />
              Blog
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
              บทความ &amp;
              <span className="block text-[#22C55E] mt-2">ความรู้ใหม่ๆ</span>
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              อัพเดตเทรนด์เทคโนโลยีการปลูก เคล็ดลับจากผู้เชี่ยวชาญ
              และข่าวสารล่าสุดจาก Kbon Platform
            </p>
          </div>
        </section>

        {/* ── Breadcrumb ──────────────────────────────────────────────── */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <Link
              href="/"
              className="hover:text-[#22C55E] transition-colors"
            >
              หน้าแรก
            </Link>
            <ChevronRight size={12} />
            <span className="text-slate-600">บทความ</span>
          </div>
        </div>

        {/* ── Blog Grid ──────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
          {/* Post count */}
          {!isLoading && !error && posts.length > 0 && (
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px bg-slate-200 flex-1" />
              <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest whitespace-nowrap px-4 bg-white border border-slate-200 rounded-full py-2">
                ทั้งหมด {posts.length} บทความ
              </p>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle size={32} className="text-red-400" />
              </div>
              <h3 className="font-black text-slate-700 text-lg">
                โหลดบทความไม่สำเร็จ
              </h3>
              <p className="text-slate-400 text-sm max-w-xs text-center">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-6 py-3 bg-[#22C55E] text-white rounded-2xl font-black text-sm hover:bg-[#1eb054] transition-colors shadow-lg shadow-green-200"
              >
                ลองใหม่
              </button>
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-28 text-center bg-white rounded-[3rem] border border-slate-100">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
                <BookOpen size={36} className="text-[#22C55E]" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">
                ยังไม่มีบทความ
              </h3>
              <p className="text-slate-500 font-medium max-w-md">
                กำลังเตรียมเนื้อหาดีๆ ให้คุณ กลับมาเยี่ยมเราอีกครั้งนะ!
              </p>
            </div>
          )}

          {/* Blog grid */}
          {!isLoading && !error && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
