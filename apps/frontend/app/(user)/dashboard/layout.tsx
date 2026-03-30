'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import UserSidebar from '../../components/UserSidebar';
import { useAuthStore } from '../../../store/useAuthStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [hydrationComplete, setHydrationComplete] = useState(false);

  // 1. Mark as mounted to prevent hydration errors & start a 300ms hydration safety gap
  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setHydrationComplete(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // 2. The actual redirect logic
  useEffect(() => {
    if (hydrationComplete) {
      if (!isAuthenticated) {
        router.replace('/login');
      } else if (user?.role === 'ADMIN') {
        router.replace('/admin/dashboard');
      }
    }
  }, [hydrationComplete, isAuthenticated, user, router]);

  // 3. Render blocking
  if (!isMounted || (!isAuthenticated && !hydrationComplete)) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#22C55E] mb-4"></div>
        <p className="text-slate-400 font-bold text-sm">กำลังตรวจสอบสิทธิ์...</p>
      </div>
    );
  }

  // Safety net: don't render standard layout if hydration failed validation but router hasn't finished pushing
  if (!isAuthenticated || user?.role === 'ADMIN') {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#22C55E] mb-4"></div>
        <p className="text-slate-400 font-bold text-sm">กำลังสลับหน้าจอ...</p>
      </div>
    );
  }

  // 4. Render children if authenticated
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Reusable Navbar */}
      <Navbar user={user} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left / Top: User Sidebar */}
          <div className="lg:col-span-1 border-r-0 lg:border-r border-slate-100 pr-0 lg:pr-2 lg:sticky lg:top-24">
            <UserSidebar />
          </div>

          {/* Right / Bottom: Dynamic Content Pane */}
          <div className="lg:col-span-3 min-h-[500px]">
            {children}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
