import { create } from 'zustand';
import type { User } from '@/features/auth/types';
import { clearTokenCache } from '@/lib/auth/token/tokenCache';

let _accessToken: string | null = null;

export function getAccessToken(): string | null {
  return _accessToken;
}

interface AuthState {
  isAuthenticated: boolean;
  isInitialized:   boolean;
  user:            User | null;
  setAuth:         (user: User, accessToken: string) => void;
  clearAuth:       () => void;
  setInitialized:  () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isInitialized:   false,
  user:            null,
  setAuth: (user, accessToken) => {
    _accessToken = accessToken;
    set({ isAuthenticated: true, user });
  },
  clearAuth: () => {
    _accessToken = null;
    clearTokenCache();
    set({ isAuthenticated: false, user: null });
  },
  setInitialized: () => set({ isInitialized: true }),
}));
