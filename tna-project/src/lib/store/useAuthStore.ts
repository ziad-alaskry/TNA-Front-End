import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserType = 'visitor' | 'owner' | 'gov' | 'logistics' | null;

interface AuthState {
    token: string | null;
    userId: string | null;
    userType: UserType;
    setAuth: (token: string, userId: string, userType: UserType) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            userId: null,
            userType: null,
            setAuth: (token, userId, userType) => set({ token, userId, userType }),
            clearAuth: () => set({ token: null, userId: null, userType: null }),
        }),
        {
            name: 'tna-auth-storage',
        }
    )
);