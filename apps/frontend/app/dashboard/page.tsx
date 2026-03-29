'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // 1. ลองหากุญแจ (Token) และข้อมูล User จากในเครื่อง
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');

    // 2. ถ้าไม่มีกุญแจ แปลว่าแอบเข้า หรือยังไม่ได้ล็อคอิน -> ดีดกลับไปหน้า Login
    if (!token || !savedUser) {
      router.push('/login');
    } else {
      // 3. ถ้ามีครบ ให้เอาข้อมูลมาแสดง
      setUser(JSON.parse(savedUser));
    }
  }, [router]);

  // ฟังก์ชันสำหรับกดปุ่ม Logout
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/login'); // ลบกุญแจทิ้งแล้วกลับไปหน้า Login
  };

  // ระหว่างรอโหลดข้อมูล ให้โชว์หน้าขาวๆ ไปก่อน จะได้ไม่กระตุก
  if (!user) return <div className="min-h-screen bg-gray-50"></div>;

  return (
    <div className="min-h-screen bg-gray-50 text-black p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* --- Header ของ Dashboard --- */}
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

        {/* --- ส่วนแสดงข้อมูล User --- */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
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

          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
            {/* พื้นที่สำหรับใส่กราฟหรือสถานะเครื่องปลูกในอนาคต */}
            <p>🔧 อุปกรณ์และสถิติการปลูกของคุณจะแสดงที่นี่ในอนาคต</p>
          </div>
        </div>

      </div>
    </div>
  );
}