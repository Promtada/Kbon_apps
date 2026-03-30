'use client';

import React from 'react';
import UserSidebar from '../../components/UserSidebar';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <div className="hidden lg:block w-[280px] p-6">
        <div className="sticky top-24">
          <UserSidebar />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
