'use client';

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../lib/axios';
import { toast } from 'sonner';
import {
  Star,
  Loader2,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────
type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface AdminReview {
  id: string;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  createdAt: string;
  product: { id: string; name: string };
  user: { id: string; email: string; name: string } | null;
  reviewerName: string | null;
}

// ── Sub-components ─────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ReviewStatus }) {
  const map: Record<ReviewStatus, { label: string; className: string; icon: React.ReactNode }> = {
    PENDING: {
      label: 'รอตรวจสอบ',
      className: 'bg-amber-50 text-amber-600 border border-amber-100',
      icon: <span className="text-[10px] font-black">•</span>,
    },
    APPROVED: {
      label: 'แสดงอยู่',
      className: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      icon: <CheckCircle2 size={11} />,
    },
    REJECTED: {
      label: 'ถูกซ่อน',
      className: 'bg-red-50 text-red-500 border border-red-100',
      icon: <XCircle size={11} />,
    },
  };
  const { label, className, icon } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          className={i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
        />
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ReviewStatus | 'ALL'>('ALL');

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/reviews');
      setReviews(res.data);
    } catch (err: any) {
      toast.error('โหลดข้อมูลรีวิวล้มเหลว', { description: err?.response?.data?.message ?? err.message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleStatus = async (id: string, status: ReviewStatus) => {
    setBusyId(id);
    try {
      await api.patch(`/admin/reviews/${id}/status`, { status });
      toast.success(
        status === 'APPROVED' ? 'แสดงรีวิวแล้ว ✓' : 'ซ่อนรีวิวแล้ว',
        { description: 'อัปเดตสถานะเรียบร้อย' },
      );
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r)),
      );
    } catch (err: any) {
      toast.error('อัปเดตล้มเหลว', { description: err?.response?.data?.message ?? err.message });
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('ยืนยันการลบรีวิวนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้')) return;
    setBusyId(id);
    try {
      await api.delete(`/admin/reviews/${id}`);
      toast.success('ลบรีวิวเรียบร้อยแล้ว');
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      toast.error('ลบไม่สำเร็จ', { description: err?.response?.data?.message ?? err.message });
    } finally {
      setBusyId(null);
    }
  };

  // ── Derived ──
  const filtered =
    filter === 'ALL' ? reviews : reviews.filter((r) => r.status === filter);

  const counts = {
    ALL: reviews.length,
    APPROVED: reviews.filter((r) => r.status === 'APPROVED').length,
    REJECTED: reviews.filter((r) => r.status === 'REJECTED').length,
  };

  const filterTabs: { key: ReviewStatus | 'ALL'; label: string }[] = [
    { key: 'ALL', label: 'ทั้งหมด' },
    { key: 'APPROVED', label: 'แสดงอยู่' },
    { key: 'REJECTED', label: 'ถูกซ่อน' },
  ];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800">จัดการรีวิวสินค้า</h1>
          <p className="text-sm text-slate-500 mt-1">
            ซ่อนหรือแสดงรีวิวที่ลูกค้าส่งมา
          </p>
        </div>
        <button
          onClick={fetchReviews}
          disabled={isLoading}
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          รีเฟรช
        </button>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'รีวิวทั้งหมด', count: counts.ALL, color: 'text-slate-700', bg: 'bg-white' },
          { label: 'แสดงอยู่', count: counts.APPROVED, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'ถูกซ่อน', count: counts.REJECTED, color: 'text-red-500', bg: 'bg-red-50' },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} rounded-2xl p-5 border border-slate-100 shadow-sm`}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
            <p className={`text-3xl font-black mt-1 ${card.color}`}>{card.count}</p>
          </div>
        ))}
      </div>

      {/* ── Filter tabs ── */}
      <div className="flex gap-2 flex-wrap">
        {filterTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === key
                ? 'bg-[#22C55E] text-white shadow-lg shadow-green-100'
                : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {label}
            <span
              className={`ml-2 text-[11px] px-1.5 py-0.5 rounded-full ${
                filter === key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {counts[key as keyof typeof counts] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-bold text-xs tracking-wider">สินค้า</th>
                <th className="px-6 py-4 font-bold text-xs tracking-wider">ผู้รีวิว</th>
                <th className="px-6 py-4 font-bold text-xs tracking-wider">คะแนน</th>
                <th className="px-6 py-4 font-bold text-xs tracking-wider max-w-[240px]">ความคิดเห็น</th>
                <th className="px-6 py-4 font-bold text-xs tracking-wider">วันที่</th>
                <th className="px-6 py-4 font-bold text-xs tracking-wider">สถานะ</th>
                <th className="px-6 py-4 font-bold text-xs tracking-wider text-right">แอคชั่น</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-400">
                    <Loader2 size={28} className="animate-spin mx-auto mb-3 text-slate-300" />
                    กำลังโหลดรีวิว...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-slate-400">
                    <MessageSquare size={32} className="mx-auto mb-3 text-slate-200" />
                    <p className="font-bold">ไม่พบรีวิวในหมวดนี้</p>
                  </td>
                </tr>
              ) : (
                filtered.map((review) => {
                  const isBusy = busyId === review.id;
                  const displayName = review.user?.name ?? review.reviewerName ?? 'ผู้ใช้งาน';
                  const displayEmail = review.user?.email ?? '—';

                  return (
                    <tr
                      key={review.id}
                      className={`transition-colors hover:bg-slate-50/60 ${isBusy ? 'opacity-50' : ''}`}
                    >
                      {/* Product */}
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800 max-w-[160px] truncate">
                          {review.product.name}
                        </p>
                      </td>

                      {/* Reviewer */}
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-700">{displayName}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{displayEmail}</p>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4">
                        <StarDisplay rating={review.rating} />
                        <span className="text-[11px] text-slate-400 font-bold mt-0.5 block">
                          {review.rating}/5
                        </span>
                      </td>

                      {/* Comment */}
                      <td className="px-6 py-4 max-w-[240px]">
                        {review.comment ? (
                          <p className="text-slate-600 font-medium text-xs leading-relaxed line-clamp-2 whitespace-normal">
                            {review.comment}
                          </p>
                        ) : (
                          <span className="text-slate-300 text-xs italic">ไม่มีความคิดเห็น</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                        {new Date(review.createdAt).toLocaleDateString('th-TH', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={review.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {review.status !== 'APPROVED' && (
                            <button
                              id={`approve-${review.id}`}
                              onClick={() => handleStatus(review.id, 'APPROVED')}
                              disabled={isBusy}
                              title="อนุญาตให้แสดงรีวิวนี้"
                              className="flex items-center gap-1 text-emerald-600 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold disabled:opacity-40"
                            >
                              <CheckCircle2 size={14} />
                              อนุญาตให้แสดง
                            </button>
                          )}
                          {review.status !== 'REJECTED' && (
                            <button
                              id={`reject-${review.id}`}
                              onClick={() => handleStatus(review.id, 'REJECTED')}
                              disabled={isBusy}
                              title="ซ่อนรีวิวนี้จากหน้าร้าน"
                              className="flex items-center gap-1 text-amber-600 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold disabled:opacity-40"
                            >
                              <XCircle size={14} />
                              ซ่อนรีวิวนี้
                            </button>
                          )}
                          <button
                            id={`delete-${review.id}`}
                            onClick={() => handleDelete(review.id)}
                            disabled={isBusy}
                            title="ลบรีวิว"
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors disabled:opacity-40"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
