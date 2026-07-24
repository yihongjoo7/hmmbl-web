/**
 * lib/auth/interceptor.ts
 *
 * API 401 응답 처리 조율자 (인증 인터셉터)
 *
 * 역할:
 *   - apiClient.ts로부터 주입받는 `onUnauthorized` 콜백의 실구현체
 *   - 401 발생 시 httpOnly refresh 쿠키로 토큰을 갱신한다(tokenRefresh.ts)
 *   - pendingQueue로 동시 다발 401 시 중복 갱신 방지
 *
 * 의존성 방향 (레이어 규칙 준수):
 *   lib/auth/interceptor → lib/auth/token/tokenRefresh (lib→lib, OK)
 *   lib/auth/interceptor ← features/auth/useAuthInterceptor (주입, 역방향 없음)
 *
 * 주입 방법:
 *   `configureApiClient({ onUnauthorized: createAuthInterceptor(setAuth) })`
 *   (useAuthInterceptor.ts에서 호출)
 */

import { refreshFromCookie } from './token/tokenRefresh';

// ── 동시 갱신 방지 상태 ─────────────────────────────────────────────────────
/**
 * pendingQueue:
 *   동시 401 응답이 여러 개 올 때 첫 번째 갱신이 끝날 때까지 나머지를 여기서 대기시킨다.
 *   갱신 성공 → drainQueue(newToken), 실패 → rejectQueue(err)
 */
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function drainQueue(token: string): void {
  pendingQueue.forEach((q) => q.resolve(token));
  pendingQueue = [];
}

function rejectQueue(err: unknown): void {
  pendingQueue.forEach((q) => q.reject(err));
  pendingQueue = [];
}

// ── 공개 API ─────────────────────────────────────────────────────────────────

/**
 * 인증 인터셉터 팩토리.
 *
 * @param onSuccess  토큰 갱신 성공 시 호출할 콜백.
 *                   Zustand store 업데이트(setAuth)를 features 레이어에서 주입한다.
 * @returns          apiClient.configureApiClient()에 전달할 `onUnauthorized` 콜백
 *
 * @example
 *   // features/auth/hooks/useAuthInterceptor.ts
 *   const setAuth = useAuthStore((s) => s.setAuth);
 *   useEffect(() => {
 *     configureApiClient({
 *       onUnauthorized: createAuthInterceptor(setAuth),
 *       onClearAuth: clearAuth,
 *     });
 *   }, [setAuth]);
 */
export function createAuthInterceptor(
  onSuccess: (token: string, user: unknown) => void,
): () => Promise<string> {
  /**
   * 401 발생 시 apiClient.ts가 호출하는 함수.
   * httpOnly refresh 쿠키로 새 토큰을 발급받는다.
   *
   * 동시 401 처리:
   *   - 첫 번째 호출: 갱신 요청 → pendingQueue drain
   *   - 이후 호출: pendingQueue에 등록 → 첫 번째 갱신 완료 시 함께 해소
   */
  return async function onUnauthorized(): Promise<string> {
    // 이미 갱신 중이면 pendingQueue에서 대기
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      });
    }

    isRefreshing = true;
    try {
      const newToken = await refreshFromCookie(onSuccess);

      // 대기 중인 요청들에 새 토큰 배포
      drainQueue(newToken);
      return newToken;
    } catch (err) {
      // 갱신 실패 시 모든 대기 요청 reject
      rejectQueue(err);
      throw err;
    } finally {
      isRefreshing = false;
    }
  };
}

/**
 * 테스트 환경에서 인터셉터 내부 상태를 초기화한다.
 * 프로덕션 코드에서는 사용하지 않는다.
 */
export function resetInterceptorState(): void {
  isRefreshing = false;
  pendingQueue = [];
}
