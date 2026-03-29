'use client';
import { useEffect, useState } from 'react';
// 🌟 Step 1: Import Navbar เข้ามาใช้งาน
import Navbar from '../../components/Navbar';
import api from '../../../lib/axios'; // นำเข้าพนักงานไปรษณีย์ของเรา (ปรับ Path ตามโครงสร้างจริง)
// useRouter และ Cookies ไม่ต้องใช้ในหน้านี้แล้ว เพราะ Navbar จัดการเรื่อง Logout ให้ครับ

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // ยิง API ไปขอดูข้อมูลจริงๆ จาก Backend
        const response = await api.get('/auth/me');
        setUser(response.data); 
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        // Interceptor จะจัดการเตะกลับหน้า Login ถ้า Token มีปัญหา
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ฟังก์ชัน handleLogout เดิมถูกลบออก เพราะเราจะใช้ปุ่ม Logout ใน Navbar แทนครับ

  if (loading) return <div className="min-h-screen bg-gray-50 flex justify-center items-center text-black font-sans">กำลังตรวจสอบข้อมูล...</div>;
  
  // ในกรณีที่ไม่มี User (Interceptor ยังไม่ทำงาน) ให้แสดงหน้าว่างๆ ไว้ก่อน
  if (!user) return <div className="min-h-screen bg-gray-50 font-sans"></div>;

  return (
    // 🌟 Step 2: ปรับ Layout ให้เป็น flex เพื่อรองรับ Navbar
    <div className="flex flex-col min-h-screen bg-gray-50 text-black font-sans">
      
      {/* 🌟 Step 3: ใส่ Navbar ไว้ด้านบนสุด */}
      <Navbar />

      {/* --- เนื้อหาหลักของ Dashboard --- */}
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto mt-4 md:mt-8">
          
          {/* 🌟 Step 4: ลบ Header การ์ดตัวเก่าออก แล้วใช้เนื้อหาหลักเลย */}
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 border-b pb-4 text-gray-800">
              Account Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* การ์ดข้อมูลจำลองให้ดูสวยงามขึ้น */}
              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-inner">
                <p className="text-sm text-gray-400 mb-1">Full Name</p>
                <p className="font-semibold text-lg text-gray-900">{user.name}</p>
              </div>
              
              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-inner">
                <p className="text-sm text-gray-400 mb-1">Email Address</p>
                <p className="font-semibold text-lg text-gray-900">{user.email}</p>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-inner md:col-span-2">
                <p className="text-sm text-gray-400 mb-1">Account Role</p>
                <p className="font-semibold text-lg uppercase text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block mt-1">
                  {user.role}
                </p>
              </div>
            </div>

            <div className="mt-10 p-6 bg-green-50 rounded-lg border border-green-100 text-center text-green-800">
                <p className="font-bold text-lg">🌱 ยินดีต้อนรับสู่ระบบ Kbon!</p>
                <p className="text-sm mt-1">พื้นที่จัดการฟาร์มไฮโดรโปนิกส์และอุปกรณ์ของคุณอยู่ระหว่างการพัฒนาอย่างเข้มข้น</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}