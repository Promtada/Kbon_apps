'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie'; // 🌟 เพิ่ม import Cookies

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname(); // ตัวช่วยเช็คว่าตอนนี้อยู่หน้าไหน

  // ให้มันเช็คข้อมูล User ทุกครั้งที่มีการเปลี่ยนหน้า
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    Cookies.remove('access_token'); // 🌟 ลบ Cookie ตอนกด Logout
    setUser(null); // เคลียร์ข้อมูลใน Navbar
    router.push('/login');
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 shadow-sm sticky top-0 bg-white z-50 text-black">
      <Link href="/" className="text-2xl font-bold text-green-600">
        Kbon <span className="text-gray-400 ml-1 text-sm font-normal">Platform</span>
      </Link>
      
      <div className="hidden md:flex space-x-8 font-medium">
        <Link href="#" className="hover:text-green-600 transition">Products</Link>
        <Link href="#" className="hover:text-green-600 transition">About Us</Link>
        <Link href="#" className="hover:text-green-600 transition">Contact</Link>
      </div>

      <div className="space-x-3 flex items-center">
        {user ? (
          /* --- เมนูสำหรับคนที่ล็อคอินแล้ว --- */
          <>
            <span className="text-sm text-gray-500 mr-4 hidden sm:inline-block">
              Hi, <span className="font-bold text-gray-800">{user.name}</span>
            </span>
            <Link href="/dashboard" className="px-4 py-2 text-green-600 font-medium hover:bg-green-50 rounded-lg transition">
              Dashboard
            </Link>
            <button 
              onClick={handleLogout} 
              className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          /* --- เมนูสำหรับคนที่ยังไม่ล็อคอิน --- */
          <>
            <Link href="/login" className="px-4 py-2 text-gray-700 hover:text-green-600 font-medium">
              Login
            </Link>
            <Link href="/register" className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-medium">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}