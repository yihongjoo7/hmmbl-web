/**
 * bridgeClient.ts
 * window.postMessage 래퍼·타입 보장
 * 이벤트 버스 + Native 호출 액션 통합
 *
 * 보안 강화 (P2):
 *   - ALLOWED_EVENTS: 허용된 이벤트만 수신 (미허용 이벤트 silently drop)
 *   - EVENT_VALIDATORS: 이벤트별 페이로드 구조 검증 (타입 안전성 확보)
 *   - once() 내부 순서 보장: unsub() 먼저 호출 후 listener 실행
 *     (예외 발생 시 구독 누수 방지)
 */

import type { BridgeEventName } from './bridgeProtocol';

// ── 화이트리스트 ───────────────────────────────────────────────────────────
/**
 * 네이티브에서 수신 허용된 이벤트 목록.
 * 여기에 없는 이벤트는 `window.onBridgeEvent`로 들어와도 무시된다.
 *
 * 신규 이벤트 추가 시 bridgeProtocol.ts의 BridgeEventName에도 함께 등록할 것.
 */
const ALLOWED_EVENTS = new Set<BridgeEventName>([
  'appAuthCode',
  'biometricResult',
  'pinResult',
  'gpsResult',
  'cameraResult',
  'galleryResult',
  'videoProgress',
  'videoPlayerClosed',
  'appBackPressed',
  'stepCountUpdate',
  'stepCountResult',
  // 인증·보안 (네이티브 → 웹)
  'tokenReceived',
  'keyRotation',
  // 환경 정보 (요청 응답)
  'deviceInfo',
  'appVersion',
  // 다운로드 응답
  'imageDownloadResult',
  // 다국어 (네이티브 언어 설정 → 웹)
  'appLanguage',
  'appLanguageChanged',
]);

// ── 페이로드 검증기 ────────────────────────────────────────────────────────
/**
 * 이벤트별 페이로드 유효성 검사 함수 맵.
 * 검증기가 false를 반환하면 해당 이벤트를 drop하고 경고 로그를 남긴다.
 *
 * 구조 검증만 수행 (값 범위 검증은 각 핸들러에서 처리).
 */
const EVENT_VALIDATORS: Partial<Record<BridgeEventName, (data: unknown) => boolean>> = {
  appAuthCode: (d): boolean =>
    // { code: string } 또는 { error: string } 둘 다 허용 (B-1 패턴)
    typeof d === 'object' && d !== null && ('code' in d || 'error' in d),

  biometricResult: (d): boolean =>
    typeof d === 'object' && d !== null && 'success' in d && typeof (d as { success: unknown }).success === 'boolean',

  pinResult: (d): boolean =>
    typeof d === 'object' && d !== null && 'success' in d && typeof (d as { success: unknown }).success === 'boolean',

  gpsResult: (d): boolean =>
    typeof d === 'object' && d !== null && ('latitude' in d || 'error' in d),

  cameraResult: (d): boolean =>
    typeof d === 'object' && d !== null && ('base64' in d || 'error' in d),

  galleryResult: (d): boolean =>
    typeof d === 'object' && d !== null && ('base64' in d || 'error' in d),

  videoProgress: (d): boolean =>
    typeof d === 'object' && d !== null && 'videoId' in d && 'percentage' in d,

  videoPlayerClosed: (d): boolean =>
    typeof d === 'object' && d !== null && 'videoId' in d,

  stepCountResult: (d): boolean =>
    typeof d === 'object' && d !== null && ('steps' in d || 'error' in d),
};

// ── 이벤트 버스 ───────────────────────────────────────────────────────────
type Listener<T = unknown> = (data: T) => void;

interface BridgeEventBus {
  on<T = unknown>(event: string, listener: Listener<T>): () => void;
  once<T = unknown>(event: string, listener: Listener<T>): () => void;
  waitFor<T = unknown>(event: string, timeoutMs?: number): Promise<T>;
  emit<T = unknown>(event: string, data: T): void;
}

function createBridgeEventBus(): BridgeEventBus {
  const listeners = new Map<string, Set<Listener>>();

  if (typeof window !== 'undefined') {
    /**
     * 네이티브 → 웹 이벤트 수신 진입점.
     *
     * 보안 필터 2단계:
     *   1. ALLOWED_EVENTS 화이트리스트 체크
     *   2. EVENT_VALIDATORS 페이로드 구조 검증
     */
    window.onBridgeEvent = (event: string, data: unknown) => {
      // 1단계: 허용 이벤트 체크
      if (!ALLOWED_EVENTS.has(event as BridgeEventName)) {
        console.warn(`[BridgeClient] 허용되지 않은 이벤트 수신 — 무시됨: "${event}"`);
        return;
      }

      // 2단계: 페이로드 구조 검증
      const validator = EVENT_VALIDATORS[event as BridgeEventName];
      if (validator && !validator(data)) {
        console.warn(`[BridgeClient] "${event}" 페이로드 검증 실패 — 무시됨`, data);
        return;
      }

      bus.emit(event, data);
    };
  }

  const bus: BridgeEventBus = {
    on<T>(event: string, listener: Listener<T>) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(listener as Listener);
      // 구독 해제 함수 반환
      return () => listeners.get(event)?.delete(listener as Listener);
    },

    /**
     * 1회 전용 구독.
     *
     * 주의: unsub()을 listener() 호출 이전에 실행해야
     *   listener 내부에서 예외가 발생해도 구독이 남지 않는다.
     *   (원본 bridgeEventBus.ts 패턴과 동일)
     */
    once<T>(event: string, listener: Listener<T>) {
      const unsub = bus.on<T>(event, (data) => {
        unsub();      // ← 먼저 구독 해제 (누수 방지)
        listener(data);
      });
      return unsub;
    },

    waitFor<T>(event: string, timeoutMs = 10_000): Promise<T> {
      return new Promise<T>((resolve, reject) => {
        const timer = setTimeout(() => {
          unsub();
          reject(new BridgeTimeoutError(event, timeoutMs));
        }, timeoutMs);

        const unsub = bus.once<T>(event, (data) => {
          clearTimeout(timer);
          resolve(data);
        });
      });
    },

    emit<T>(event: string, data: T) {
      listeners.get(event)?.forEach((fn) => {
        try {
          fn(data);
        } catch (e) {
          console.error(`[BridgeClient] "${event}" listener error`, e);
        }
      });
    },
  };

  return bus;
}

export const bridgeEventBus = createBridgeEventBus();

export class BridgeTimeoutError extends Error {
  constructor(event: string, timeoutMs: number) {
    super(`BridgeClient: timeout waiting for "${event}" (${timeoutMs}ms)`);
    this.name = 'BridgeTimeoutError';
  }
}

// ── WebView 환경 판단 ──────────────────────────────────────────────────────
export function isWebView(): boolean {
  if (typeof window === 'undefined') return false;
  return typeof window.bridge !== 'undefined';
}

// ── Native 호출 액션 ───────────────────────────────────────────────────────
// 액션 함수(requestBiometric/requestCamera/requestGallery/getLocation/
// requestStepCount 등)는 단일 출처인 bridgeActions.ts에 정의한다.
// 이 파일(bridgeClient)은 이벤트 버스·수신 필터·환경 감지만 담당한다.
