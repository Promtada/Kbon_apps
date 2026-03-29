// apps/frontend/lib/axios.ts
import axios from 'axios';

// 1. สร้างตัวแทนของ axios (ตั้งชื่อว่า api)
const api = axios.create({
  baseURL: 'http://localhost:4000/api', // ชี้ไปที่ Backend ของเราเลย จะได้ไม่ต้องพิมพ์ยาวๆ อีก
  timeout: 10000,
});

// 2. ดักจับ Request ก่อนส่งออกไป (ด่านตรวจขาออก)
api.interceptors.request.use(
  (config) => {
    // ไปค้นดูกระเป๋า (LocalStorage) ว่ามีกุญแจไหม
    // ข้อควรระวัง: LocalStorage จะทำงานได้เฉพาะฝั่ง Client (Browser)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        // ถ้ามีกุญแจ ให้แปะไปกับ Header อัตโนมัติ
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. (ตัวแถม) ดักจับ Response ขากลับ (ด่านตรวจขาเข้า)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ถ้า Backend ตอบกลับมาว่า 401 (กุญแจหมดอายุ / ไม่มีสิทธิ์)
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // ลบกุญแจทิ้งแล้วเตะกลับไปหน้า Login
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.location.href = '/login'; 
      }
    }
    return Promise.reject(error);
  }
);

export default api;