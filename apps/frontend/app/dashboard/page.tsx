'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../lib/axios'; // นำเข้าพนักงานไปรษณีย์ของเรา

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ยิงไปที่ /auth/me 
        // สังเกตว่าเราไม่ต้องพิมพ์ localhost:4000 และไม่ต้องแนบ Token เองแล้ว!
        const response = await api.get('/auth/me');
        setUser(response.data); // เอาข้อมูลของจริงจาก Backend มาโชว์
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // ไม่ต้องเขียน router.push เพราะ Interceptor เราจัดการเตะกลับให้แล้ว
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex justify-center items-center text-black">กำลังตรวจสอบข้อมูล...</div>;
  if (!user) return null; // ป้องกันการกระตุกก่อนโดนเตะไปหน้า Login

  return (
    <div className="min-h-screen bg-gray-50 text-black p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-green-600">Kbon Dashboard</h1>
            <p className="text-gray-500 text-sm">จัดการระบบ Hydroponics ของคุณ</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-red-50 text-red-600 font-semibold px-4 py-2 rounded-lg hover:bg-red-100 transition"
          >
            Logout
          </button>
        </header>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          {/* ข้อมูลทั้งหมดนี้มาจากฐานข้อมูลจริงๆ แล้ว! */}
          <h2 className="text-xl font-bold mb-6 border-b pb-4">Welcome back, {user.name}! 👋</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <p className="text-sm text-green-800 mb-1">Email Address</p>
              <p className="font-semibold text-lg">{user.email}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800 mb-1">Account Role</p>
              <p className="font-semibold text-lg">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}