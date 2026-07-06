/**
 * lib/auth/authService.ts
 *
 * Authorization Code → Access Token 교환 서비스.
 *
 * 계층 규칙 준수:
 *   - lib/ 순수 계층 — features/, bridge, Zustand 의존 없음
 *   - setAuth는 호출부(features 레이어)에서 주입받음 (의존성 역전)
 *
 * 이전 위치: features/auth/lib/authService.ts
 * 이전 사유: setAuth를 required로 변경해 useAuthStore 의존 제거
 */

import { createDPoPProof } from '@/lib/auth/dpop/proofGenerator';
import { toApiError }      from '@/lib/api/parseApiError';
import type { User } from '@/features/auth/types';

type SetAuthFn = (user: User, accessToken: string) => void;

/**
 * Authorization Code를 Access Token으로 교환하고 인증 상태를 초기화한다.
 *
 * @param code    Native Bridge로부터 수신한 Authorization Code
 * @param setAuth 인증 성공 시 호출할 상태 setter (Zustand setAuth 등)
 */
export async function initAuthFromCode(code: string, setAuth: SetAuthFn): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const proof   = await createDPoPProof(`${baseUrl}/auth/token`, 'POST');

  const res = await fetch(`${baseUrl}/auth/token`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      DPoP:           proof,
    },
    body:        JSON.stringify({ grant_type: 'authorization_code', code }),
    credentials: 'include',
  });

  if (!res.ok) {
    throw await toApiError(res, 'TOKEN_EXCHANGE_FAILED');
  }

  // /auth/token 응답은 snake_case(access_token)다 — login/refresh의 camelCase accessToken과 다르다.
  // (이전엔 data.accessToken 을 읽어 undefined → 토큰 미첨부 → 업로드 401 발생)
  const data = (await res.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: User;
  };
  setAuth(data.user, data.access_token);
}
