import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/lib/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      setAuth: (user, token) => set({ user, token, role: user.user_role }),
      logout: () => set({ user: null, token: null, role: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
