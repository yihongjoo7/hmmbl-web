'use client';
/**
 * features/auth/hooks/useAuthInterceptor.ts
 *
 * API 클라이언트 ↔ 인증 인터셉터 연결 훅
 *
 * 역할:
 *   lib 레이어(apiClient, fileUploadClient)는 Zustand에 의존하지 않도록
 *   설계되어 있다. 이 훅이 features 레이어에서 필요한 콜백을 주입(DI)한다.
 *
 * 주입 흐름:
 *   useAuthInterceptor
 *     ├─ getAccessToken (useAuthStore 동기 getter)
 *     │      └─▶ configureApiClient({ getToken })         → apiClient.buildHeaders()
 *     │      └─▶ configureFileUploadClient({ getToken, onUnauthorized })  → uploadFile() + 401 재시도
 *     ├─ createAuthInterceptor(setAuth)
 *     │      └─▶ configureApiClient({ onUnauthorized })   → apiClient.withRefresh() 401 처리
 *     └─ clearAuth
 *            └─▶ configureApiClient({ onClearAuth })      → apiClient.withRefresh() 갱신 실패 시
 *
 * 마운트 위치:
 *   app/layout.tsx 또는 WebviewLayoutClient 등 앱 최상위 컴포넌트.
 *   한 번만 마운트되어야 한다 (중복 설정 시 마지막 콜백으로 덮어씀).
 */

import { useEffect } from 'react';
import { getAccessToken, useAuthStore } from './useAuthStore';
import { createAuthInterceptor } from '@/lib/auth/interceptor';
import { configureApiClient } from '@/lib/api/apiClient';
import { configureFileUploadClient } from '@/lib/api/fileUploadClient';
import type { User } from '@/features/auth/types';

export function useAuthInterceptor(): void {
  // Zustand store에서 필요한 액션 구독
  const setAuth   = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    // 1. onUnauthorized 콜백 생성
    //    httpOnly refresh 쿠키로 토큰 갱신 → setAuth 호출의 전체 플로우를 담당
    const onUnauthorized = createAuthInterceptor((token, user) => setAuth(user as User, token));

    // 2. apiClient에 콜백 주입
    //    이제부터 apiClient는 Zustand를 직접 import하지 않고
    //    이 콜백들을 통해서만 인증 정보에 접근한다
    configureApiClient({
      getToken:       getAccessToken,   // 동기 토큰 getter (module-level 변수)
      onUnauthorized,                   // 401 → 갱신 플로우
      onClearAuth:    clearAuth,        // 갱신 불가 → 로그아웃
    });

    // 3. fileUploadClient에도 동일한 getToken·onUnauthorized 주입 (401 시 갱신 재시도)
    configureFileUploadClient({
      getToken: getAccessToken,
      onUnauthorized,
    });

    // cleanup 없음: 앱 생애주기 동안 설정 유지
    // (setAuth/clearAuth 참조가 바뀌어도 클로저를 통해 최신 함수를 참조)
  }, [setAuth, clearAuth]);
}
