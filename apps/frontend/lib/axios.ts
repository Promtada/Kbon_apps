import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // ดึงจาก Cookies แทน LocalStorage เพื่อความสอดคล้องกับ Middleware
      const token = Cookies.get('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🌟 ถ้าเจอ 401 (Unauthorized) และยังไม่ได้ลองขอใหม่
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        // ยิงไปขอ Token ชุดใหม่
        const res = await axios.post('http://localhost:4000/api/auth/refresh', {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data;

        // อัปเดต Cookies ใหม่
        Cookies.set('access_token', accessToken, { expires: 7 });
        Cookies.set('refresh_token', newRefreshToken, { expires: 7 });

        // ยิง Request เดิมซ้ำอีกครั้งด้วย Token ใหม่
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // ถ้า Refresh ไม่ผ่าน (กุญแจสำรองตายด้วย) ให้เตะออก
        if (typeof window !== 'undefined') {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;