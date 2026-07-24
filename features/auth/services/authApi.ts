/**
 * features/auth/services/authApi.ts
 *
 * 인증 관련 REST API 호출 모음
 *
 * 변경 (P2: deprecated 코드 제거):
 *   - `issueToken()` 제거
 *     사유: `@deprecated [D-3]` 마킹된 미사용 메서드.
 *           토큰 교환은 `lib/auth/authService.ts`의 `initAuthFromCode()`가 담당.
 *           apiClient 일원화 시 이 파일로 흡수 예정이나, 그 전까지는 authService.ts가 정식 경로.
 */

import { apiClient } from '@/lib/api/apiClient';

export const authApi = {
  /**
   * 서버에 로그아웃을 알리고 서버 세션을 만료시킨다.
   * 클라이언트 측 상태 초기화는 useAuth.ts의 logout()이 담당.
   */
  logout: () =>
    apiClient.post<{ message: string }>('/auth/logout'),
};
