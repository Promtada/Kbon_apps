'use client';

import { useEffect, useState } from 'react';
// ✅ แก้ไข Path: ต้องถอย 3 ชั้นเพื่อให้ถึงโฟลเดอร์ app และเข้า components
import Navbar from '../../components/Navbar'; 
import api from '../../../lib/axios'; 
import { Sprout, Activity, AlertCircle, LayoutGrid } from 'lucide-react'; 

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/me');
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#22C55E]"></div>
    </div>
  );
  
  if (!user) return <div className="min-h-screen bg-[#F8FAFC]"></div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      
      {/* 🌟 จุดที่ต้องแก้: ต้องส่ง user={user} เข้าไปใน Navbar ด้วยเพื่อให้ Profile Dropdown ทำงานได้ */}
      <Navbar user={user} />

      <main className="flex-grow p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          
          {/* --- Header: คำทักทาย --- */}
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              สวัสดี, <span className="text-[#22C55E]">{user.name}</span> 🌱
            </h1>
            <p className="text-slate-400 font-medium mt-1">ยินดีต้อนรับกลับสู่ฟาร์มของคุณ วันนี้ทุกอย่างดูดีทีเดียว!</p>
          </div>

          {/* --- Quick Stats: การ์ดสรุปสถานะ --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard 
              icon={<Activity size={24} className="text-blue-500" />} 
              label="สถานะระบบ" 
              value="ออนไลน์" 
              desc="อุปกรณ์เชื่อมต่ออยู่ 3 ชุด"
            />
            <StatCard 
              icon={<Sprout size={24} className="text-[#22C55E]" />} 
              label="พืชที่กำลังปลูก" 
              value="12 ราง" 
              desc="ผักกาดหอม, กรีนโอ๊ค"
            />
            <StatCard 
              icon={<AlertCircle size={24} className="text-amber-500" />} 
              label="การแจ้งเตือน" 
              value="0 รายการ" 
              desc="สถานะปกติทั้งหมด"
            />
          </div>

          {/* --- Main Dashboard Area --- */}
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                 <LayoutGrid className="text-[#22C55E]" />
                 Farm Overview
               </h3>
               <button className="text-sm font-bold text-[#22C55E] hover:underline transition-all">จัดการอุปกรณ์</button>
            </div>

            <div className="h-80 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300 gap-4">
               <div className="p-4 bg-slate-50 rounded-full">
                  <Activity size={40} />
               </div>
               <p className="font-medium italic text-sm text-slate-400 text-center px-6">
                 ส่วนแสดงกราฟข้อมูลเซนเซอร์และสถานะฟาร์มจะอยู่ตรงนี้<br/>
                 กำลังเชื่อมต่อกับฐานข้อมูล...
               </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, desc }: any) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="p-3 bg-slate-50 w-fit rounded-2xl group-hover:bg-white transition-colors">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        <p className="text-2xl font-black text-slate-800 my-1">{value}</p>
        <p className="text-xs text-slate-400 font-medium">{desc}</p>
      </div>
    </div>
  );
}