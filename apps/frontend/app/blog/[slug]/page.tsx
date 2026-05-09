'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { STORAGE_KEYS } from '../../../lib/storageKeys';
import { API_BASE } from '../../../lib/axios';
import {
  ChevronRight,
  Loader2,
  ArrowLeft,
  Calendar,
  Clock,
  BookOpen,
  Share2,
  ArrowUp,
} from 'lucide-react';

// ---- Types ----------------------------------------------------------------

interface BlogPost {
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
    month: 'long',
    day: 'numeric',
  });
}

function estimateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ---- Scroll-to-Top Button -------------------------------------------------

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-[#22C55E] text-white rounded-full shadow-lg shadow-green-200 flex items-center justify-center hover:bg-[#1eb054] hover:-translate-y-0.5 transition-all duration-200"
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  );
}

// ---- Share Button ---------------------------------------------------------

function ShareButton({ title }: { title: string }) {
  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert('คัดลอกลิงก์แล้ว!');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm font-bold hover:bg-emerald-50 hover:text-[#22C55E] transition-all duration-200"
    >
      <Share2 size={14} />
      แชร์
    </button>
  );
}

// ---- Reading Progress Bar -------------------------------------------------

function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, percent));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[#22C55E] to-emerald-400 transition-[width] duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

// ---- Page -----------------------------------------------------------------

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = React.use(params);
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Restore user session
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) setUser(JSON.parse(saved));
  }, []);

  // Fetch blog post by slug
  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/blogs/slug/${slug}`);
        if (res.status === 404) {
          setError('not_found');
          return;
        }
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data: BlogPost = await res.json();
        setPost(data);
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
        if (!error) setError('load_error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  // ---- Loading state ----
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <Navbar user={user} />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-slate-400">
            <Loader2 size={44} className="animate-spin text-[#22C55E]" />
            <p className="font-bold text-sm animate-pulse">
              กำลังโหลดบทความ...
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ---- Error state ----
  if (error) {
    const isNotFound = error === 'not_found';
    return (
      <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
        <Navbar user={user} />
        <main className="flex-grow flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="w-28 h-28 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen size={44} className="text-slate-300" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-3">
              {isNotFound ? '404' : 'เกิดข้อผิดพลาด'}
            </h1>
            <p className="text-slate-400 font-medium mb-8 leading-relaxed">
              {isNotFound
                ? 'ไม่พบบทความที่คุณกำลังหา อาจถูกลบหรือยังไม่เผยแพร่'
                : 'ไม่สามารถโหลดบทความได้ กรุณาลองใหม่ภายหลัง'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/blog"
                className="px-8 py-3.5 bg-[#22C55E] text-white rounded-2xl font-black text-sm shadow-lg shadow-green-200 hover:bg-[#1eb054] transition-all"
              >
                ← กลับหน้าบทความ
              </Link>
              {!isNotFound && (
                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-3.5 bg-white border border-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-50 transition-all"
                >
                  ลองใหม่
                </button>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) return null;

  const readingTime = estimateReadingTime(post.content);

  // ---- Main render ----
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900">
      <ReadingProgressBar />
      <Navbar user={user} />

      <main className="flex-grow">
        {/* ── Hero / Cover Image ─────────────────────────────────────── */}
        {post.featuredImage && (
          <section className="relative w-full h-[320px] md:h-[460px] lg:h-[520px] overflow-hidden bg-slate-900">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          </section>
        )}

        {/* ── Hero fallback when no image ────────────────────────────── */}
        {!post.featuredImage && (
          <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 pt-24 pb-16 px-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#22C55E]/10 rounded-full blur-[120px]" />
              <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px]" />
            </div>
          </section>
        )}

        {/* ── Breadcrumb ────────────────────────────────────────────── */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <Link
              href="/"
              className="hover:text-[#22C55E] transition-colors"
            >
              หน้าแรก
            </Link>
            <ChevronRight size={12} />
            <Link
              href="/blog"
              className="hover:text-[#22C55E] transition-colors"
            >
              บทความ
            </Link>
            <ChevronRight size={12} />
            <span className="text-slate-600 truncate max-w-[200px]">
              {post.title}
            </span>
          </div>
        </div>

        {/* ── Article Content ───────────────────────────────────────── */}
        <article className="max-w-4xl mx-auto px-6 py-10 md:py-16">
          {/* Back link (mobile) */}
          <div className="md:hidden mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#22C55E] transition-colors"
            >
              <ArrowLeft size={16} /> กลับ
            </button>
          </div>

          {/* ── Title Header Card ─────────────────────────────────── */}
          <header
            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12 mb-10 animate-rise"
          >
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                <BookOpen size={11} />
                บทความ
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-400 text-[11px] font-bold">
                <Calendar size={11} />
                {formatDate(post.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-400 text-[11px] font-bold">
                <Clock size={11} />
                อ่าน {readingTime} นาที
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
              {post.title}
            </h1>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <ShareButton title={post.title} />
            </div>
          </header>

          {/* ── Rendered HTML Content ────────────────────────────── */}
          <div
            className="blog-prose bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-12 lg:p-16 mb-10 animate-fade-in-up"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* ── Bottom Navigation ───────────────────────────────── */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 md:p-8">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-emerald-50 hover:text-[#22C55E] transition-all"
            >
              <ArrowLeft size={16} />
              กลับหน้าบทความ
            </Link>
            <ShareButton title={post.title} />
          </div>
        </article>
      </main>

      <ScrollToTopButton />
      <Footer />
    </div>
  );
}
