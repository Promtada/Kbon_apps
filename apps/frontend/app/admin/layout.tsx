'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// 🌟 นำเข้า Navbar ปกติมาใช้
import Navbar from '../components/Navbar'; 
import { 
  LayoutDashboard, Box, Users, ShoppingCart, 
  Tag, LogOut, Settings 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  // 🌟 ดึงข้อมูล User จาก LocalStorage มาเตรียมไว้ส่งให้ Navbar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'แดชบอร์ด', href: '/admin/dashboard' },
    { icon: <Box size={20} />, label: 'จัดการสินค้า', href: '/admin/products' },
    { icon: <Users size={20} />, label: 'จัดการลูกค้า', href: '/admin/customers' },
    { icon: <ShoppingCart size={20} />, label: 'คำสั่งซื้อ', href: '/admin/orders' },
    { icon: <Tag size={20} />, label: 'โปรโมชั่น', href: '/admin/promotions' },
    { icon: <Settings size={20} />, label: 'ตั้งค่าระบบ', href: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      {/* --- Sidebar Fixed (ฝั่งซ้าย) --- */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 flex flex-col z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#22C55E] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-100">
               <Box size={24} />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tighter">
              Kbon <span className="text-[#22C55E]">Admin</span>
            </h2>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-300 font-bold text-sm ${
                  isActive 
                  ? 'bg-[#22C55E] text-white shadow-xl shadow-green-100 translate-x-2' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-slate-50">
           <button className="w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all font-bold text-sm">
              <LogOut size={20} />
              ออกจากระบบ
           </button>
        </div>
      </aside>

      {/* --- ส่วนขวา: รวม Navbar และเนื้อหาหลัก --- */}
      <div className="flex-1 ml-72 flex flex-col">
        
        {/* 🌟 🌟 เรียกใช้ Navbar ปกติที่นี่ 🌟 🌟 */}
        {/* เราส่ง user={user} ไปเพื่อให้ Profile Dropdown แสดงผลได้เหมือนหน้า User */}
        <Navbar user={user} />

        {/* --- Main Content Area --- */}
        <main className="p-10">
          {children}
        </main>
      </div>
    </div>
  );
}