'use client';

/**
 * 웹뷰 레이아웃 클라이언트 컴포넌트
 *
 * 리팩토링 (P1: 이중 구독 위험 제거):
 *   - 이전: bridgeEventBus.on('keyRotation'), bridgeEventBus.on('tokenReceived')를
 *           이 컴포넌트 내 useEffect에서 직접 구독
 *   - 이후: useKeyRotation(), useTokenReceiver() 훅 위임
 *           → 구독 로직이 훅에서 단일 관리됨
 *           → 향후 다른 컴포넌트에서 훅을 재사용해도 이중 구독 없음
 *
 * 담당:
 *   - API 클라이언트 인증 인터셉터 연결 (useAuthInterceptor)
 *   - Bridge 토큰 수신 초기화 (useTokenReceiver)
 *   - DPoP 키 로테이션 구독 (useKeyRotation)
 *   - 다국어 Provider 래핑 (LocaleProvider, ssr:false)
 *   - children 래핑 (레이아웃 셸)
 */

import dynamic from 'next/dynamic';
import { useKeyRotation } from '@/features/auth/hooks/useKeyRotation';
import { useTokenReceiver } from '@/features/auth/hooks/useTokenReceiver';
import { useAuthInterceptor } from '@/features/auth/hooks/useAuthInterceptor';

// 다국어 Provider — ssr:false 로 로드해 쿠키 기반 첫 렌더 시 hydration 불일치를 차단한다.
const LocaleProvider = dynamic(() => import('./LocaleProvider'), { ssr: false });

export function WebviewLayoutClient({ children }: { children: React.ReactNode }) {
  // apiClient / fileUploadClient에 토큰 getter + 401 콜백 주입 (DI)
  useAuthInterceptor();

  // bridge 'keyRotation' 이벤트 → DPoP 키쌍 교체
  useKeyRotation();

  // bridge 'tokenReceived' 이벤트 → Zustand setAuth 호출 (webview·native 공통, 2-Lite)
  useTokenReceiver();

  return <LocaleProvider>{children}</LocaleProvider>;
}
