'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import UserSidebar from '../../components/UserSidebar';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Global Navbar at the very top */}
      <Navbar />

      {/* Main container: Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        {/* Left: Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-24">
            <UserSidebar />
          </div>
        </div>

        {/* Right: Page Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
