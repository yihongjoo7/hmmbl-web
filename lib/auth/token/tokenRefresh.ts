/**
 * lib/auth/token/tokenRefresh.ts
 *
 * 인가 코드 → 액세스 토큰 교환 (순수 인프라)
 *
 * 리팩토링 (P1: lib 레이어 순수화):
 *   - 이전: bridgeEventBus를 직접 import → lib이 bridge에 의존 (레이어 위반)
 *   - 이후: `code` 파라미터를 외부에서 주입 받음
 *           bridge 호출·이벤트 대기는 lib/auth/interceptor.ts가 담당
 *
 * 책임: HTTP POST /auth/token 호출 + tokenCache 갱신 + 성공 콜백 통지
 * 의존: lib/auth/dpop (OK), lib/auth/token/tokenCache (OK), fetch API (OK)
 * 비의존: bridge, Zustand, React (lib 레이어 순수성 유지)
 */

import { createDPoPProof } from '@/lib/auth/dpop/proofGenerator';
import { tokenCache } from './tokenCache';
import { toApiError } from '@/lib/api/parseApiError';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

/**
 * 인가 코드를 서버에 전달하여 새 액세스 토큰을 발급받는다.
 *
 * @param code      네이티브 bridge에서 수신한 1회성 인가 코드
 * @param onSuccess 토큰 발급 성공 시 호출할 콜백.
 *                  features/ 레이어(useAuthStore.setAuth 등)를 주입받아
 *                  lib이 Zustand에 직접 의존하지 않도록 한다.
 * @returns 새로 발급된 액세스 토큰
 * @throws ApiError  서버가 4xx/5xx 응답을 내려준 경우
 */
export async function refreshAccessToken(
  code: string,
  onSuccess: (token: string, user: unknown) => void,
): Promise<string> {
  // DPoP proof 생성 (요청 URL·메서드에 바인딩)
  const proof = await createDPoPProof(`${baseUrl}/auth/token`, 'POST');

  const res = await fetch(`${baseUrl}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // DPoP proof를 헤더로 첨부 (RFC 9449)
      DPoP: proof,
    },
    body: JSON.stringify({ grant_type: 'authorization_code', code }),
    credentials: 'include',
  });

  if (!res.ok) {
    throw await toApiError(res, 'TOKEN_EXCHANGE_FAILED');
  }

  const { access_token, expires_in, user } = await res.json();

  // 메모리 캐시에 토큰 저장 (30초 전 갱신 트리거 포함)
  tokenCache.set(access_token, expires_in ?? 3600);

  // 성공 콜백 호출 → Zustand store 업데이트는 호출부가 담당
  onSuccess(access_token, user);

  return access_token;
}
