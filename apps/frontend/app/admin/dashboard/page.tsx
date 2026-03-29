'use client';

import React from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Console</h1>
            <p className="text-slate-500 font-medium">จัดการระบบและข้อมูลผู้ใช้ Kbon Platform</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 shadow-sm hover:bg-slate-50 transition-all">
              System Logs
            </button>
            <button className="bg-[#22C55E] px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-green-200 hover:bg-[#1eb054] transition-all">
              Add New Device
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Total Users', value: '1,284', color: 'text-blue-600' },
            { label: 'Active Devices', value: '452', color: 'text-[#22C55E]' },
            { label: 'System Health', value: '99.9%', color: 'text-amber-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-md border border-white p-6 rounded-[2rem] shadow-sm">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
              <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Area (Glassmorphism Card) */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50">
          <h3 className="text-xl font-black text-slate-800 mb-6">Recent Activities</h3>
          <div className="flex flex-col gap-4">
            {/* Placeholder for Table or List */}
            <div className="h-64 border-2 border-dashed border-slate-200 rounded-[2rem] flex items-center justify-center text-slate-400 font-medium italic">
              ตารางจัดการข้อมูลผู้ใช้จะแสดงตรงนี้...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}