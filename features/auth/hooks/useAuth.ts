'use client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from './useAuthStore';
import { authApi } from '../services/authApi';
import { deleteDPoPKeyPair } from '@/lib/auth/dpop/proofGenerator';
import { resolveDpopMode } from '@/lib/auth/dpop/mode';

export function useAuth() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();

  const logout = async () => {
    // [202] native 모드: 네이티브가 세션·키 정리 권위. 웹은 토큰 교환/웹 DPoP 키가 없다.
    if (resolveDpopMode() === 'native') {
      window.bridge?.logout();
      clearAuth();
      router.replace('/auth/simple');
      return;
    }
    try {
      await authApi.logout();
    } catch {
      // 서버 에러여도 클라이언트 상태 초기화
    } finally {
      window.bridge?.logout();
      await deleteDPoPKeyPair().catch(() => {});
      clearAuth();
      router.replace('/auth/simple');
    }
  };

  return { user, logout };
}
