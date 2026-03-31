import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { STORAGE_KEYS } from '../lib/storageKeys';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (userData: User, token?: string) => void;
  updateUser: (data: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      login: (user, token) => set({ user, isAuthenticated: !!user, accessToken: token || null }),
      updateUser: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null,
      })),
      logout: () => {
        // Clear cookies so middleware doesn't redirect based on stale tokens
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        set({ user: null, isAuthenticated: false, accessToken: null });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_STORAGE || 'kbon-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
