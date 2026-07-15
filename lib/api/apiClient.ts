/**
 * lib/api/apiClient.ts
 *
 * HTTP API 클라이언트 (DPoP 인증)
 *
 * 리팩토링 (P1: lib 레이어 순수화):
 *   - 이전: bridgeEventBus + useAuthStore를 직접 import (레이어 위반)
 *   - 이후: 401 처리·토큰 조회를 콜백으로 주입받음
 *           bridge/Zustand 의존 완전 제거
 *
 * 책임:
 *   - DPoP proof 자동 첨부 (buildHeaders) — 서명 주체는 모드별로 다름(getDPoPHeader)
 *   - 401 시 onUnauthorized 콜백 호출 → 새 토큰 수신 후 재시도
 *   - 동시 401 대기(pendingQueue)는 lib/auth/interceptor.ts가 담당
 *
<<<<<<< HEAD
 * 2-Lite (docs/30-dpop-mode-switch-proposal.md):
=======
 * 2-Lite (docs/21-dpop-mode-switch-proposal.md):
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
 *   fetch는 webview/native 두 모드 모두 웹이 직접 수행한다. 달라지는 것은 DPoP
 *   proof의 서명 주체뿐이다(getDPoPHeader가 모드에 따라 웹 키 또는 네이티브
 *   KeyStore를 선택). 토큰은 두 모드 모두 _getToken()으로 동일하게 조회한다
 *   (webview=코드교환 토큰, native=네이티브가 tokenReceived로 푸시한 토큰).
 *
 * 의존:
 *   lib/auth/dpop/proofProvider (OK — lib→lib)
 *   onUnauthorized 콜백 (주입, 역방향 없음)
 * 비의존: bridge, Zustand, React
 *
 * 초기화 방법:
 *   features/auth/hooks/useAuthInterceptor.ts에서
 *   `configureApiClient({ onUnauthorized, onClearAuth })` 호출
 */

import { getDPoPHeader } from '@/lib/auth/dpop/proofProvider';
import { ApiError } from '@/types/api';
import { toApiError } from './parseApiError';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

// ── 주입 콜백 ─────────────────────────────────────────────────────────────
/**
 * 401 응답 시 호출할 토큰 갱신 함수.
 * lib/auth/interceptor.ts의 createAuthInterceptor()가 반환하는 함수를 주입한다.
 */
let _onUnauthorized: (() => Promise<string>) | undefined;

/**
 * 현재 액세스 토큰을 동기 반환하는 getter.
 * useAuthStore의 module-level getAccessToken()을 주입한다.
 * lib이 features/에 직접 의존하지 않도록 주입 방식으로 분리.
 */
let _getToken: (() => string | null) | undefined;

/**
 * 갱신 실패(토큰 갱신 불가) 시 호출할 로그아웃 함수.
 * useAuthStore.getState().clearAuth를 주입한다.
 */
let _onClearAuth: (() => void) | undefined;

/**
 * apiClient에 인증 콜백을 주입한다.
 *
 * features/auth/hooks/useAuthInterceptor.ts의 useEffect 내에서 호출한다.
 * onUnauthorized가 설정되지 않은 상태에서 401이 오면 예외를 그대로 throw한다.
 */
export function configureApiClient(cfg: {
  /** 현재 액세스 토큰을 동기 반환하는 getter (useAuthStore의 getAccessToken) */
  getToken:       () => string | null;
  /** 401 → 토큰 갱신 → 새 토큰 반환 (lib/auth/interceptor.ts의 onUnauthorized) */
  onUnauthorized: () => Promise<string>;
  /** 갱신 실패 시 로그아웃 (useAuthStore.getState().clearAuth) */
  onClearAuth:    () => void;
}): void {
  _getToken       = cfg.getToken;
  _onUnauthorized = cfg.onUnauthorized;
  _onClearAuth    = cfg.onClearAuth;
}

// ── 헤더 빌더 ─────────────────────────────────────────────────────────────
/**
 * DPoP 인증 헤더를 생성한다.
 *
 * 토큰이 있을 때만 Authorization·DPoP를 첨부한다.
 * 미로그인(토큰 없음)이면 DPoP proof를 생성하지 않는다 — 불필요한 키 생성·
 * 비보안 컨텍스트 throw를 피하고, 공개 엔드포인트는 어차피 DPoP를 무시한다.
 *
 * - Authorization: DPoP <access_token>
 * - DPoP: <proof_jwt>   (매 요청마다 신규 생성, RFC 9449. webview=웹 키, native=네이티브 KeyStore)
 */
async function buildHeaders(url: string, method: string): Promise<HeadersInit> {
  // 주입된 getter로 현재 토큰 조회 (동기, Zustand 미구독)
  const token = _getToken?.() ?? null;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `DPoP ${token}`;
    headers.DPoP = await getDPoPHeader(url, method);
  }

  return headers;
}

// ── 401 처리 + 재시도 ─────────────────────────────────────────────────────
/**
 * 401 응답 시 onUnauthorized 콜백으로 토큰을 갱신하고 요청을 재시도한다.
 *
 * @param url    API 경로 (baseUrl 제외)
 * @param method HTTP 메서드
 * @param fn     실제 fetch를 실행하는 함수 (헤더를 인자로 받음)
 */
async function withRefresh<T>(
  url: string,
  method: string,
  fn: (headers: HeadersInit) => Promise<Response>,
): Promise<T> {
  let headers = await buildHeaders(`${baseUrl}${url}`, method);
  let res = await fn(headers);

  if (res.status === 401) {
    if (!_onUnauthorized) {
      // 인터셉터 미설정 상태: 갱신 불가 → 예외 throw
      throw new ApiError(401, 'UNAUTHORIZED', '인증이 필요합니다. (interceptor 미설정)');
    }

    try {
      // onUnauthorized가 pendingQueue 조율을 담당하므로 여기서는 단순 await
      await _onUnauthorized();
      // 갱신 성공 → 새 토큰으로 헤더 재빌드 후 재시도
      headers = await buildHeaders(`${baseUrl}${url}`, method);
      res = await fn(headers);
    } catch (err) {
      // 갱신 실패 → 로그아웃
      _onClearAuth?.();
      throw err;
    }
  }

  if (!res.ok) throw await toApiError(res);

  // 204 No Content / 빈 본문 → JSON 파싱 throw 방지
  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }

  return res.json();
}

// ── 공개 API ─────────────────────────────────────────────────────────────

export const apiClient = {
  /** GET 요청. params는 쿼리스트링으로 직렬화된다(배열은 반복 파라미터). */
  get: <T>(url: string, params?: Record<string, unknown>) => {
    const qs = params
      ? '?' + new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v != null)
            .flatMap(([k, v]) =>
              Array.isArray(v)
                ? v.map((item) => [k, String(item)] as [string, string])
                : [[k, String(v)] as [string, string]],
            ),
        ).toString()
      : '';
    const fullUrl = url + qs;
    return withRefresh<T>(fullUrl, 'GET', (h) =>
      fetch(`${baseUrl}${fullUrl}`, { headers: h, credentials: 'include', cache: 'no-store' }),
    );
  },

  /** POST 요청. body는 JSON 직렬화된다. */
  post: <T>(url: string, body?: unknown) =>
    withRefresh<T>(url, 'POST', (h) =>
      fetch(`${baseUrl}${url}`, {
        method:      'POST',
        headers:     h,
        credentials: 'include',
        body:        body ? JSON.stringify(body) : undefined,
      }),
    ),

  /** PUT 요청. */
  put: <T>(url: string, body?: unknown) =>
    withRefresh<T>(url, 'PUT', (h) =>
      fetch(`${baseUrl}${url}`, {
        method:      'PUT',
        headers:     h,
        credentials: 'include',
        body:        body ? JSON.stringify(body) : undefined,
      }),
    ),

  /** DELETE 요청. */
  delete: <T>(url: string) =>
    withRefresh<T>(url, 'DELETE', (h) =>
      fetch(`${baseUrl}${url}`, {
        method:      'DELETE',
        headers:     h,
        credentials: 'include',
      }),
    ),
};
