import axios from 'axios';
import Cookies from 'js-cookie';
import { STORAGE_KEYS } from './storageKeys';
import { useAuthStore } from '../store/useAuthStore';

// ─── Centralized API Base URL ────────────────────────────────────────────────
// All frontend API calls MUST use this constant (or the `api` axios instance).
// Falls back to localhost:4000 so local dev works even without an .env file.
export const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api`;

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// ─── Request interceptor ─────────────────────────────────────────────────────
// Attach the access_token cookie as a Bearer header on every request.
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor ────────────────────────────────────────────────────
// On 401: attempt a silent token refresh once.
// If the refresh also fails (expired/missing refresh token, DB reset, etc.),
// perform a full forced logout so the user never gets stuck in a loop.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refresh_token');
        if (!refreshToken) throw new Error('No refresh token available');

        // Attempt to exchange the refresh token for a new access token
        const res = await axios.post(`${API_BASE}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data;

        // Persist the new tokens in cookies
        Cookies.set('access_token', accessToken, { expires: 7 });
        Cookies.set('refresh_token', newRefreshToken, { expires: 7 });

        // Retry the original request with the fresh token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch {
        // ── Forced logout ────────────────────────────────────────────────────
        // The refresh token is also invalid (expired, DB reset, etc.).
        // We must wipe ALL auth state so the Zustand persist middleware
        // cannot re-hydrate a zombie session on the next page load.
        if (typeof window !== 'undefined') {
          // 1. Reset Zustand store + remove cookies (defined in logout())
          useAuthStore.getState().logout();

          // 2. Explicitly nuke the persisted Zustand auth storage key.
          //    This is the key cause of the infinite loop: if this key
          //    survives, Zustand re-hydrates isAuthenticated=true on reload.
          localStorage.removeItem(STORAGE_KEYS.AUTH_STORAGE);

          // 3. Also clear the legacy user key used by some pages directly
          localStorage.removeItem(STORAGE_KEYS.USER);

          // 4. Hard redirect — use replace so the login page isn't in history
          window.location.replace('/login');
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;