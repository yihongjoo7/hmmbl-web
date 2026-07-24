/**
 * lib/auth/token/tokenRefresh.ts
 *
 * httpOnly refresh 쿠키 → 액세스 토큰 재발급 (순수 인프라)
 *
 * 책임: HTTP POST /auth/refresh 호출 + tokenCache 갱신 + 성공 콜백 통지
 * 의존: lib/auth/dpop (OK), lib/auth/token/tokenCache (OK), fetch API (OK)
 * 비의존: Zustand, React (lib 레이어 순수성 유지)
 */

import { createDPoPProof } from '@/lib/auth/dpop/proofGenerator';
import { tokenCache } from './tokenCache';
import { toApiError } from '@/lib/api/parseApiError';
import type { AuthResponse } from '@/features/auth/types';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

/**
 * httpOnly refresh 쿠키(`credentials:'include'`)로 새 액세스 토큰을 발급받는다.
 * 로그인 폼 없이도(새로고침 등) 세션을 조용히 복구할 때 사용한다.
 *
 * @param onSuccess 토큰 발급 성공 시 호출할 콜백.
 *                  features/ 레이어(useAuthStore.setAuth 등)를 주입받아
 *                  lib이 Zustand에 직접 의존하지 않도록 한다.
 * @returns 새로 발급된 액세스 토큰
 * @throws ApiError  서버가 4xx/5xx 응답을 내려준 경우(쿠키 없음/만료 포함)
 */
export async function refreshFromCookie(
  onSuccess: (token: string, user: unknown) => void,
): Promise<string> {
  const proof = await createDPoPProof(`${baseUrl}/auth/refresh`, 'POST');

  const res = await fetch(`${baseUrl}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', DPoP: proof },
    cache: 'no-store',
    credentials: 'include',
  });

  if (!res.ok) {
    throw await toApiError(res, 'TOKEN_REFRESH_FAILED');
  }

  const data: AuthResponse = await res.json();

  tokenCache.set(data.accessToken, data.expiresIn ?? 3600);
  onSuccess(data.accessToken, data.user);

  return data.accessToken;
}
