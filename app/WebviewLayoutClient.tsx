'use client';

/**
 * 루트 레이아웃 클라이언트 컴포넌트
 *
 * 담당:
 *   - API 클라이언트 인증 인터셉터 연결 (useAuthInterceptor)
 *   - 다국어 Provider 래핑 (LocaleProvider, ssr:false)
 *   - children 래핑 (레이아웃 셸)
 */

import dynamic from 'next/dynamic';
import { useAuthInterceptor } from '@/features/auth/hooks/useAuthInterceptor';

// 다국어 Provider — ssr:false 로 로드해 쿠키 기반 첫 렌더 시 hydration 불일치를 차단한다.
const LocaleProvider = dynamic(() => import('./LocaleProvider'), { ssr: false });

export function WebviewLayoutClient({ children }: { children: React.ReactNode }) {
  // apiClient / fileUploadClient에 토큰 getter + 401 콜백 주입 (DI)
  useAuthInterceptor();

  return <LocaleProvider>{children}</LocaleProvider>;
}
