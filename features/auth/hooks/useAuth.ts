'use client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from './useAuthStore';
import { authApi } from '../services/authApi';
import { deleteDPoPKeyPair } from '@/lib/auth/dpop/proofGenerator';

export function useAuth() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // 서버 에러여도 클라이언트 상태 초기화
    } finally {
      await deleteDPoPKeyPair().catch(() => {});
      clearAuth();
      router.replace('/auth/login');
    }
  };

  return { user, logout };
}
