/**
 * lib/bridge/bridge.ts
 *
 * @/lib/bridge/bridge 경로 호환 re-export 진입점
 *
 * 배경:
 *   nextjs-new의 `lib/env/bridge.ts`에 해당하는 파일.
<<<<<<< HEAD
 *   hmmbl-web 이전 시 타입 정의는 `bridgeProtocol.ts`에 통합되었으나
=======
 *   hpoint-mobile 이전 시 타입 정의는 `bridgeProtocol.ts`에 통합되었으나
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
 *   import 경로(`@/lib/bridge/bridge`)를 사용하는 파일 7개를 위해
 *   이 re-export 파일을 생성한다.
 *
 * 이 파일을 참조하는 곳:
 *   - app/dev/bridge/scenario/gps/page.tsx           → GPSResult
 *   - app/dev/bridge/scenario/image-upload/page.tsx  → isCameraError, CameraResultOrError
 *   - app/dev/bridge/scenario/video-handoff/page.tsx → VideoProgressEvent, VideoPlayerClosedEvent
 *   - app/dev/bridge/scenario/video-tracking/page.tsx → VideoProgressEvent, VideoPlayerClosedEvent
 *   - features/shared/hooks/useBridgeEvent.ts        → BridgeEventName
 *   - features/video/hooks/useVideoProgress.ts       → VideoProgressEvent, VideoPlayerClosedEvent
 *   - features/video/types/video.ts                  → VideoProgressEvent, VideoPlayerClosedEvent
 *
 * 향후 bridgeProtocol.ts에 없는 타입(BridgeInterface, DeviceInfo, isWebView 등)이
 * 필요해지면 이 파일에 직접 정의하거나 re-export를 추가한다.
 */

// ── 타입 re-export ───────────────────────────────────────────────────────────
// 아래 타입들은 모두 bridgeProtocol.ts에 정의되어 있다.

export type {
  /** 브릿지 이벤트 이름 유니언 */
  BridgeEventName,

  /** GPS 좌표 결과 */
  GPSResult,

  /** 카메라/갤러리 촬영 결과 */
  CameraResult,

  /**
   * CameraResult | CameraError 유니언.
   * 네이티브가 성공/실패를 동일 이벤트로 전달하는 B-02 패턴에 사용.
   */
  CameraResultOrError,

  /** 비디오 재생 진행률 이벤트 */
  VideoProgressEvent,

  /** 비디오 플레이어 닫힘 이벤트 */
  VideoPlayerClosedEvent,
} from './bridgeProtocol';

// ── 함수 re-export ───────────────────────────────────────────────────────────

export {
  /**
   * CameraResultOrError가 오류 응답인지 판별하는 타입 가드.
   * `if (isCameraError(result)) throw new Error(result.error)` 패턴으로 사용.
   */
  isCameraError,
} from './bridgeProtocol';
