/**
 * lib/auth/interceptor.ts
 *
 * API 401 응답 처리 조율자 (인증 인터셉터)
 *
 * 역할:
 *   - apiClient.ts로부터 주입받는 `onUnauthorized` 콜백의 실구현체
 *   - 401 발생 시 토큰을 갱신한다. 갱신 경로는 모드에 따라 분기된다(2-Lite):
 *       webview: bridge에서 인가 코드를 요청하고 tokenRefresh.ts로 갱신
 *       native:  bridge.requestNativeToken()으로 네이티브 세션 갱신을 요청
 *                (새 토큰은 tokenReceived 이벤트로 오며, useTokenReceiver가 store에 반영)
 *   - pendingQueue로 동시 다발 401 시 중복 갱신 방지
 *
 * 의존성 방향 (레이어 규칙 준수):
 *   lib/auth/interceptor → lib/bridge/bridgeClient   (lib→lib, OK)
 *   lib/auth/interceptor → lib/bridge/bridgeActions  (lib→lib, OK)
 *   lib/auth/interceptor → lib/auth/token/tokenRefresh (lib→lib, OK)
 *   lib/auth/interceptor → lib/auth/dpop/mode        (lib→lib, OK)
 *   lib/auth/interceptor ← features/auth/useAuthInterceptor (주입, 역방향 없음)
 *
 * 주입 방법:
 *   `configureApiClient({ onUnauthorized: createAuthInterceptor(setAuth) })`
 *   (useAuthInterceptor.ts에서 호출)
 */

import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';
import { requestNativeToken } from '@/lib/bridge/bridgeActions';
import { resolveDpopMode } from '@/lib/auth/dpop/mode';
import { refreshAccessToken } from './token/tokenRefresh';

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
   * bridge에서 인가 코드를 수신하고 새 토큰을 반환한다.
   *
   * 동시 401 처리:
   *   - 첫 번째 호출: bridge 요청 → 토큰 갱신 → pendingQueue drain
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
      const newToken = resolveDpopMode() === 'native'
        ? await refreshViaNative()
        : await refreshViaWebviewCode(onSuccess);

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
 * webview 모드 갱신: bridge에서 인가 코드를 받아 `/auth/token`으로 교환한다(현행).
 */
async function refreshViaWebviewCode(
  onSuccess: (token: string, user: unknown) => void,
): Promise<string> {
  // bridge에 인가 코드 요청 (응답 대기 먼저 등록)
  const authCodePromise = bridgeEventBus.waitFor<{ code?: string; error?: string }>(
    'appAuthCode',
    10_000, // 10초 타임아웃
  );
  window.bridge?.requestAuthCode();

  const result = await authCodePromise;
  if (result.error) throw new Error(result.error);
  if (!result.code) throw new Error('UNKNOWN');

  // 인가 코드로 토큰 갱신 (HTTP POST /auth/token)
  return refreshAccessToken(result.code, onSuccess);
}

/**
 * native 모드 갱신(2-Lite): 네이티브에 세션 갱신을 요청한다.
 * 새 토큰은 `tokenReceived` 이벤트로 오며, store 반영은 useTokenReceiver가 담당한다
 * (여기서는 재시도용 토큰 값만 반환한다).
 */
async function refreshViaNative(): Promise<string> {
  return requestNativeToken();
}

/**
 * 테스트 환경에서 인터셉터 내부 상태를 초기화한다.
 * 프로덕션 코드에서는 사용하지 않는다.
 */
export function resetInterceptorState(): void {
  isRefreshing = false;
  pendingQueue = [];
}
