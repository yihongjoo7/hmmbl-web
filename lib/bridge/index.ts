/**
 * lib/bridge/index.ts
 *
 * Bridge 인프라 공개 API 진입점.
<<<<<<< HEAD
 * nextjs-new의 `@/lib/env` 배럴에 해당하는 hmmbl-web 버전.
=======
 * nextjs-new의 `@/lib/env` 배럴에 해당하는 hpoint-mobile 버전.
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
 *
 * 사용 예:
 *   import { bridgeEventBus, BridgeErrorCode, isWebView } from '@/lib/bridge';
 *   import { requestCamera, goBack }                      from '@/lib/bridge';
 */

// ── 이벤트 버스 + 환경 감지 ─────────────────────────────────────────────────
export { bridgeEventBus, BridgeTimeoutError, isWebView } from './bridgeClient';

// ── 프로토콜 타입 + 에러 코드 ────────────────────────────────────────────────
export { BridgeErrorCode, isCameraError } from './bridgeProtocol';
export type {
  BridgeEventName,
  GPSResult,
  CameraResult,
  CameraResultOrError,
  VideoProgressEvent,
  VideoPlayerClosedEvent,
} from './bridgeProtocol';

// ── 브릿지 액션 (네이티브 호출) ──────────────────────────────────────────────
// bridgeActions.ts: 순수 bridge 전용 고수준 래퍼 (getLocation은 web fallback 포함)
export {
  requestAuthCode,
  requestNativeToken,
  requestBiometric,
  requestPin,
  requestCamera,
  requestGallery,
  requestGPS,
  getLocation,
  requestStepCount,
  requestImageDownload,
  goBack,
  openExternalBrowser,
  closeWebView,
  hapticFeedback,
  setStatusBarColor,
  showNativeLoading,
  showNativeToast,
  getDeviceInfo,
  // getAppVersion은 appVersion.ts(캐싱+semver 비교 포함)에서 내보냄
} from './bridgeActions';

// ── 앱 버전 유틸 ─────────────────────────────────────────────────────────────
export { getAppVersion, isVersionAtLeast, resetVersionCache } from './appVersion';
