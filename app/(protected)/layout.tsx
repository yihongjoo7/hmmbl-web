'use client';
import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { refreshFromCookie } from '@/lib/auth/token/tokenRefresh';
import type { User } from '@/features/auth/types';

/**
 * Protected 레이아웃 — 인증 부트스트랩
 *
 * 보호 라우트는 백엔드 인증(`Depends(get_current_user)`)이 필요하다.
 * 액세스 토큰은 메모리에만 있으므로(새로고침 시 소실) 마운트 시 httpOnly
 * refresh 쿠키로 조용히 세션 복구를 시도한다. 실패하면 로그인 화면으로
 * 리다이렉트하며, 로그인 후 원래 경로로 돌아올 수 있도록 redirect 쿼리를 붙인다.
 */
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router          = useRouter();
  const pathname         = usePathname();
  const isAuthenticated  = useAuthStore((s) => s.isAuthenticated);
  const setAuth          = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    if (isAuthenticated) return;

    let cancelled = false;
    refreshFromCookie((token, user) => setAuth(user as User, token)).catch(() => {
      if (cancelled) return;
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return <>{children}</>;
}
