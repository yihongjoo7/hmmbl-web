/**
 * bridgeProtocol.ts
 * 이벤트 타입·메시지 스키마·에러 코드·버전 정의
 */

// ── 이벤트 이름 ──────────────────────────────────────────────────────────
export type BridgeEventName =
  | 'appAuthCode'
  | 'biometricResult'
  | 'pinResult'
  | 'gpsResult'
  | 'cameraResult'
  | 'galleryResult'
  | 'videoProgress'
  | 'videoPlayerClosed'
  | 'appBackPressed'
  | 'stepCountUpdate'
  | 'stepCountResult'
  // 인증·보안 (네이티브 → 웹)
  | 'tokenReceived'
  | 'keyRotation'
  // 환경 정보 (요청 응답)
  | 'deviceInfo'
  | 'appVersion'
  // 다운로드 응답
  | 'imageDownloadResult'
  // 다국어 (네이티브 언어 설정 → 웹)
  | 'appLanguage'
  | 'appLanguageChanged';

// ── 페이로드 타입 ─────────────────────────────────────────────────────────
export interface GPSResult {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export interface CameraResult {
  base64: string;
  mimeType: string;
  width: number;
  height: number;
  fileSize?: number;
}

export interface CameraError {
  error: string;
}

export type CameraResultOrError = CameraResult | CameraError;

export function isCameraError(result: CameraResultOrError): result is CameraError {
  return 'error' in result;
}

export interface VideoProgressEvent {
  videoId: string;
  currentTime: number;
  duration: number;
  percentage: number;
  timestamp: string;
}

export interface VideoPlayerClosedEvent {
  videoId: string;
  currentTime: number;
  duration: number;
  watchedPercentage: number;
}

// ── 에러 코드 ─────────────────────────────────────────────────────────────
//
// 원본: nextjs-new/lib/env/bridgeErrorCodes.ts (21개)
// 이전 완료분:  USER_CANCELLED, PERMISSION_DENIED, BIOMETRIC_LOCKED, NO_BIOMETRIC,
//              NOT_SUPPORTED, GPS_DISABLED, TIMEOUT, UNKNOWN (8개)
// 이번 추가분 (13개): 권한·인증·네트워크·기기·다운로드·건강 카테고리
//
export const BridgeErrorCode = {
  // ── 공통 ──────────────────────────────────────────────────────────────
  /** 사용자가 직접 취소 */
  USER_CANCELLED:        'USER_CANCELLED',
  /** 타임아웃 초과 */
  TIMEOUT:               'TIMEOUT',
  /** 해당 기기/OS에서 미지원 */
  NOT_SUPPORTED:         'NOT_SUPPORTED',
  /** 알 수 없는 오류 */
  UNKNOWN:               'UNKNOWN',

  // ── 권한 ──────────────────────────────────────────────────────────────
  /** 권한 거부 (앱 설정에서 이미 거부됨) */
  PERMISSION_DENIED:     'PERMISSION_DENIED',
  /** 권한 미결정 (아직 요청하지 않은 상태) */
  PERMISSION_UNKNOWN:    'PERMISSION_UNKNOWN',       // ← 신규 추가

  // ── 인증 ──────────────────────────────────────────────────────────────
  /** 인증 실패 (생체 불일치 등) */
  AUTH_FAILED:           'AUTH_FAILED',              // ← 신규 추가
  /** 생체인증 잠김 (연속 실패로 인한 잠금) */
  BIOMETRIC_LOCKED:      'BIOMETRIC_LOCKED',
  /** 생체인증 미등록 (지문/FaceID 설정 없음) */
  NO_BIOMETRIC:          'NO_BIOMETRIC',
  /** 네이티브 세션 없음 — requestAuthCode 응답 (38번 B-1·B-6) */
  NOT_AUTHENTICATED:     'NOT_AUTHENTICATED',        // ← 신규 추가
  /** PIN 연속 실패 잠금 (38번 §C) */
  PIN_LOCKED:            'PIN_LOCKED',               // ← 신규 추가
  /** PIN 미등록 (38번 §C) */
  PIN_NOT_REGISTERED:    'PIN_NOT_REGISTERED',       // ← 신규 추가

  // ── 네트워크 ──────────────────────────────────────────────────────────
  /** 네트워크 오류 */
  NETWORK_ERROR:         'NETWORK_ERROR',            // ← 신규 추가

  // ── 기기 ──────────────────────────────────────────────────────────────
  /** 카메라 사용 불가 */
  CAMERA_UNAVAILABLE:    'CAMERA_UNAVAILABLE',       // ← 신규 추가
  /** GPS 비활성화 */
  GPS_DISABLED:          'GPS_DISABLED',
  /** 이미지 디코딩/재인코딩 실패 (미지원 포맷·손상 파일·구형 기기 HEIC — 36번 §3-2) */
  DECODE_FAILED:         'DECODE_FAILED',            // ← 신규 추가

  // ── 다운로드 ──────────────────────────────────────────────────────────
  /** http/https 외 스킴 (39번 §3-2) */
  INVALID_URL:           'INVALID_URL',              // ← 신규 추가
  /** 다운로드 저장 실패 (39번 §3-2) */
  DOWNLOAD_FAILED:       'DOWNLOAD_FAILED',          // ← 신규 추가

  // ── 건강 데이터 ───────────────────────────────────────────────────────
  /** Health Connect 권한 거부 또는 미부여 */
  HEALTH_PERMISSION_DENIED:  'HEALTH_PERMISSION_DENIED',   // ← 신규 추가
  /** Health Connect 앱 미설치 또는 사용 불가 */
  HEALTH_NOT_AVAILABLE:      'HEALTH_NOT_AVAILABLE',       // ← 신규 추가
  /** 해당 날짜의 걸음수 데이터 없음 */
  HEALTH_DATA_UNAVAILABLE:   'HEALTH_DATA_UNAVAILABLE',    // ← 신규 추가
} as const;

/** BridgeErrorCode 값의 유니언 타입 */
export type BridgeErrorCode = typeof BridgeErrorCode[keyof typeof BridgeErrorCode];
