'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Search, ChevronRight, User as UserIcon, Loader2, AlertTriangle } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  createdAt: string;
  _count: { orders: number };
  totalSpent: number;
}

const API_BASE = 'http://localhost:4000/api';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/customers`);
      if (!res.ok) throw new Error('Failed to fetch customers');
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error(err);
      setError('ไม่สามารถโหลดข้อมูลลูกค้าได้');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Users className="text-[#22C55E]" size={32} />
            จัดการลูกค้า
          </h1>
          <p className="text-slate-500 font-medium mt-1">ตรวจสอบข้อมูลลูกค้า ที่อยู่ และประวัติการสั่งซื้อ</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="ค้นหาชื่อ, อีเมล หรือเบอร์โทร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#22C55E]/20 focus:border-[#22C55E] shadow-sm transition-all"
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 size={40} className="animate-spin text-[#22C55E] mb-4" />
            <p className="font-bold animate-pulse">กำลังโหลดข้อมูล...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-red-500">
            <p className="font-bold flex items-center gap-2"><AlertTriangle /> {error}</p>
            <button onClick={fetchCustomers} className="mt-4 px-4 py-2 bg-slate-100 rounded-xl text-slate-600 font-bold hover:bg-slate-200">
              ลองใหม่
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-6 py-4 rounded-tl-[2rem]">ลูกค้า</th>
                  <th className="px-6 py-4">ติดต่อ</th>
                  <th className="px-6 py-4 text-center">คำสั่งซื้อทั้งหมด</th>
                  <th className="px-6 py-4 text-right">ยอดใช้จ่ายรวม</th>
                  <th className="px-6 py-4">วันที่สมัคร</th>
                  <th className="px-6 py-4 text-right rounded-tr-[2rem]">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400 font-medium">
                      ไม่พบข้อมูลลูกค้า
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 flex-shrink-0 overflow-hidden">
                            {customer.avatarUrl ? (
                              <img src={customer.avatarUrl} alt={customer.name} className="w-full h-full object-cover" />
                            ) : (
                              <UserIcon size={20} className="text-[#22C55E]" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800">{customer.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {customer.id.substring(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs font-bold text-slate-600">{customer.email}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{customer.phone || 'ไม่มีเบอร์โทร'}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-600">
                          {customer._count.orders}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-black text-[#22C55E]">
                          ฿{customer.totalSpent.toLocaleString('th-TH')}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">
                        {new Date(customer.createdAt).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-right text-xs">
                        <Link
                          href={`/admin/customers/${customer.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-[#22C55E] hover:border-[#22C55E] hover:text-white transition-all shadow-sm group-hover:shadow-md"
                        >
                          ดูรายละเอียด <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
