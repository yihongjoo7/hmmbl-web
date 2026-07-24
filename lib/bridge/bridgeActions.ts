/**
 * lib/bridge/bridgeActions.ts
 *
 * 네이티브 브릿지 호출 래퍼 함수 모음
 *
 * 원본: nextjs-new/lib/env/bridgeActions.ts
<<<<<<< HEAD
 * 이전 변경: import 경로를 hmmbl-web 구조에 맞게 조정
=======
 * 이전 변경: import 경로를 hpoint-mobile 구조에 맞게 조정
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
 *   - bridgeEventBus, BridgeTimeoutError → './bridgeClient'
 *   - isWebView, isCameraError, CameraResult 등 → './bridgeProtocol' + './bridgeClient'
 *
 * 각 네이티브 기능을 타입 안전한 async 함수로 래핑한다.
 * 패턴: waitFor() 등록 → 네이티브 메서드 호출 → 응답 대기
 *
 * 사용법:
 *   import { requestAuthCode, getLocation } from '@/lib/bridge/bridgeActions';
 *   const code = await requestAuthCode();
 */

import { bridgeEventBus, BridgeTimeoutError, isWebView } from './bridgeClient';
import { isCameraError } from './bridgeProtocol';
import type { CameraResult, CameraResultOrError, GPSResult } from './bridgeProtocol';

// ── 타임아웃 상수 ──────────────────────────────────────────────────────────
/**
 * 브릿지 호출 최대 응답 대기 시간 (밀리초).
 * 네이티브 다이얼로그 자동 종결 시간을 고려해 여유있게 설정한다.
 */
const TIMEOUT = {
  AUTH_CODE:   10_000,  // 10초: 인증 코드
  BIOMETRIC:   60_000,  // 60초: 생체인증 (사용자 입력 대기)
  PIN:         90_000,  // 90초: PIN (네이티브 다이얼로그 60초 자동 종결 + 여유)
  CAMERA:     120_000,  // 2분:  카메라/갤러리 (촬영 및 편집 시간 고려)
  GALLERY:    120_000,
  GPS:         45_000,  // 45초: GPS (네이티브 타임아웃 20초 + 권한 다이얼로그 여유)
  STEP_COUNT:  45_000,  // 45초: 걸음수 (Health Connect 권한 다이얼로그 여유)
  DEVICE:       5_000,  // 5초:  디바이스 정보
  VERSION:      5_000,  // 5초:  앱 버전
  DOWNLOAD:   120_000,  // 2분:  이미지 다운로드
} as const;

// ── 인증 ────────────────────────────────────────────────────────────────────

/**
 * 앱 인증 코드를 요청한다.
 *
 * 네이티브가 기존 로그인 세션에서 1회성 인증 코드를 발급해
 * `appAuthCode` 이벤트로 전달한다.
 * 웹은 이 코드로 `/auth/token` 엔드포인트를 호출해 액세스 토큰을 발급받는다.
 *
 * @returns 네이티브에서 발급한 인증 코드 문자열
 * @throws Error(BridgeErrorCode)  네이티브 오류 페이로드({ error }) 수신 시
 *   - NOT_AUTHENTICATED: 네이티브 세션 없음·만료
 *   - NETWORK_ERROR: 코드 발급 네트워크 실패
 * @throws BridgeTimeoutError  10초 이내 응답 없을 때
 */
export async function requestAuthCode(): Promise<string> {
  if (!window.bridge) throw new Error('[Bridge] bridge 객체가 없습니다. 웹뷰 환경을 확인하세요.');

  // waitFor()를 먼저 등록해야 이벤트 누락을 방지할 수 있다
  const promise = bridgeEventBus.waitFor<{ code?: string; error?: string }>(
    'appAuthCode',
    TIMEOUT.AUTH_CODE,
  );
  window.bridge.requestAuthCode();

  const result = await promise;
  // 네이티브가 { error: string }을 보낸 경우 즉시 throw
  if (result.error) throw new Error(result.error);
  if (typeof result.code !== 'string') throw new Error('UNKNOWN');
  return result.code;
}

/**
 * 생체인증(지문/FaceID)을 요청한다.
 *
 * @returns 인증 성공 시 true
 * @throws Error(BridgeErrorCode)  실패 또는 취소 시
 * @throws BridgeTimeoutError  60초 이내 응답 없을 때
 */
export async function requestBiometric(): Promise<boolean> {
  if (!window.bridge) throw new Error('[Bridge] bridge 객체가 없습니다.');

  const promise = bridgeEventBus.waitFor<{ success: boolean; error?: string }>(
    'biometricResult',
    TIMEOUT.BIOMETRIC,
  );
  window.bridge.requestBiometric();

  const result = await promise;
  if (!result.success) {
    throw new Error(result.error ?? 'UNKNOWN');
  }
  return true;
}

/**
 * PIN 인증을 요청한다.
 *
 * @returns 인증 성공 시 true
 * @throws Error(BridgeErrorCode)  실패 또는 취소 시
 * @throws BridgeTimeoutError  90초 이내 응답 없을 때
 */
export async function requestPin(): Promise<boolean> {
  if (!window.bridge) throw new Error('[Bridge] bridge 객체가 없습니다.');

  const promise = bridgeEventBus.waitFor<{ success: boolean; error?: string }>(
    'pinResult',
    TIMEOUT.PIN,
  );
  window.bridge.requestPin();

  const result = await promise;
  if (!result.success) {
    throw new Error(result.error ?? 'UNKNOWN');
  }
  return true;
}

/**
<<<<<<< HEAD
 * 네이티브 세션의 액세스 토큰을 요청한다(2-Lite, docs/30 §4.2·§5.2).
=======
 * 네이티브 세션의 액세스 토큰을 요청한다(2-Lite, docs/21 §4.2·§5.2).
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
 *
 * 네이티브가 자기 세션을 확인(필요 시 자체 리프레시)한 후 `tokenReceived` 이벤트로
 * `{ access_token, user }`를 푸시한다. 토큰을 store에 반영하는 것은
 * `useTokenReceiver`(지속 구독)가 담당하므로, 이 함수는 대기 후 값만 반환한다
 * (lib/auth/interceptor.ts의 401 재시도 흐름에서 사용).
 *
 * @returns 네이티브가 발급한 액세스 토큰
 * @throws Error(BridgeErrorCode)  네이티브 오류 페이로드({ error }) 수신 시
 *   - NOT_AUTHENTICATED: 네이티브 세션 없음·만료
 * @throws BridgeTimeoutError  10초 이내 응답 없을 때
 */
export async function requestNativeToken(): Promise<string> {
  if (!window.bridge?.requestNativeToken) throw new Error('[Bridge] requestNativeToken 미지원');

  const promise = bridgeEventBus.waitFor<{ access_token?: string; error?: string }>(
    'tokenReceived',
    TIMEOUT.AUTH_CODE,
  );
  window.bridge.requestNativeToken();

  const result = await promise;
  if (result.error) throw new Error(result.error);
  if (typeof result.access_token !== 'string') throw new Error('UNKNOWN');
  return result.access_token;
}

// ── 미디어 ──────────────────────────────────────────────────────────────────

/**
 * 카메라로 사진을 촬영한다.
 *
 * @returns 촬영된 이미지 정보 (base64, mimeType, width, height)
 * @throws Error  네이티브가 오류 페이로드({ error })를 반환한 경우
 * @throws BridgeTimeoutError  2분 이내 응답 없을 때
 */
export async function requestCamera(): Promise<CameraResult> {
  if (!window.bridge) throw new Error('[Bridge] bridge 객체가 없습니다.');

  const promise = bridgeEventBus.waitFor<CameraResultOrError>('cameraResult', TIMEOUT.CAMERA);
  window.bridge.requestCamera();

  const result = await promise;
  if (isCameraError(result)) throw new Error(result.error);
  return result;
}

/**
 * 갤러리에서 이미지를 선택한다.
 *
 * @returns 선택된 이미지 정보 (base64, mimeType, width, height)
 * @throws Error  네이티브가 오류 페이로드({ error })를 반환한 경우
 * @throws BridgeTimeoutError  2분 이내 응답 없을 때
 */
export async function requestGallery(): Promise<CameraResult> {
  if (!window.bridge) throw new Error('[Bridge] bridge 객체가 없습니다.');

  const promise = bridgeEventBus.waitFor<CameraResultOrError>('galleryResult', TIMEOUT.GALLERY);
  window.bridge.requestGallery();

  const result = await promise;
  if (isCameraError(result)) throw new Error(result.error);
  return result;
}

// ── 위치 ────────────────────────────────────────────────────────────────────

/**
 * 네이티브 GPS로 현재 위치를 요청한다.
 *
 * @returns 위도, 경도, 정확도 (미터)
 * @throws Error  네이티브가 오류 페이로드({ error })를 반환한 경우
 * @throws BridgeTimeoutError  45초 이내 응답 없을 때
 */
export async function requestGPS(): Promise<GPSResult> {
  if (!window.bridge) throw new Error('[Bridge] bridge 객체가 없습니다.');

  const promise = bridgeEventBus.waitFor<GPSResult | { error: string }>('gpsResult', TIMEOUT.GPS);
  window.bridge.requestGPS();

  const result = await promise;
  if ('error' in result) throw new Error(result.error);
  return result;
}

/**
 * 현재 위치를 가져온다. 환경에 따라 자동 분기한다.
 *
 * - 웹뷰 환경: requestGPS() — 네이티브 GPS (높은 정확도)
 * - 웹 환경:   navigator.geolocation API — 폴백
 *
 * @returns 위도, 경도, 정확도 (미터)
 * @throws Error  권한 거부·GPS 비활성화·미지원 브라우저 등
 */
export async function getLocation(): Promise<GPSResult> {
  // 웹뷰 환경이면 네이티브 GPS 우선
  if (isWebView() && window.bridge) {
    return requestGPS();
  }

  // 웹 환경: Geolocation API 폴백
  return new Promise<GPSResult>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('이 브라우저는 위치 서비스를 지원하지 않습니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude:  pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy:  pos.coords.accuracy,
        }),
      (err) => {
        // PositionError.code → 사람이 읽을 수 있는 메시지로 변환
        const messages: Record<number, string> = {
          1: '위치 정보 접근이 거부되었습니다.',
          2: '위치 정보를 가져올 수 없습니다.',
          3: '위치 요청이 시간 초과되었습니다.',
        };
        reject(new Error(messages[err.code] ?? '위치 오류가 발생했습니다.'));
      },
      { timeout: TIMEOUT.GPS, maximumAge: 60_000, enableHighAccuracy: true },
    );
  });
}

// ── 걸음수 (Android Health Connect) ───────────────────────────────────────────

/**
 * 네이티브 걸음수(Health Connect)를 요청한다.
 *
 * @param date 'YYYY-MM-DD' 형식. 생략 시 오늘 날짜.
 * @returns 걸음수와 해당 날짜
 * @throws Error  HEALTH_PERMISSION_DENIED | HEALTH_NOT_AVAILABLE | HEALTH_DATA_UNAVAILABLE
 * @throws BridgeTimeoutError  45초 이내 응답 없을 때
 */
export async function requestStepCount(date?: string): Promise<{ steps: number; date: string }> {
  if (!window.bridge) throw new Error('[Bridge] bridge 객체가 없습니다.');

  const targetDate = date ?? new Date().toISOString().slice(0, 10);
  const promise = bridgeEventBus.waitFor<{ steps: number; date: string } | { error: string }>(
    'stepCountResult',
    TIMEOUT.STEP_COUNT,
  );
  window.bridge.requestStepCount(targetDate);

  const result = await promise;
  if ('error' in result) throw new Error(result.error);
  return result;
}

// ── 다운로드 ─────────────────────────────────────────────────────────────────

/**
 * 이미지를 네이티브로 다운로드해 사진 라이브러리에 저장한다.
 *
 * @param url       인증 헤더 없이 접근 가능한 이미지 URL
 *                  비공개 파일은 서명 URL 발급 후 전달할 것
 * @param fileName  저장 파일명 (확장자 포함 권장)
 * @throws Error('NOT_SUPPORTED')  구버전 앱 — 메서드 미존재 시 (호출부가 폴백 처리)
 * @throws Error(BridgeErrorCode)  INVALID_URL | PERMISSION_DENIED | NETWORK_ERROR | DOWNLOAD_FAILED
 * @throws BridgeTimeoutError  2분 이내 응답 없을 때
 */
export async function requestImageDownload(url: string, fileName: string): Promise<void> {
  // requestImageDownload는 구버전 앱에 없을 수 있으므로 optional chaining으로 체크
  if (!window.bridge?.requestImageDownload) throw new Error('NOT_SUPPORTED');

  const promise = bridgeEventBus.waitFor<{ success?: boolean; error?: string }>(
    'imageDownloadResult',
    TIMEOUT.DOWNLOAD,
  );
  window.bridge.requestImageDownload(url, fileName);

  const result = await promise;
  if (result.error) throw new Error(result.error);
}

// ── 네비게이션 (동기) ────────────────────────────────────────────────────────

/** 네이티브 뒤로가기를 호출한다. bridge 없으면 무시. */
export function goBack(): void {
  window.bridge?.goBack();
}

/** 외부 브라우저(기본 브라우저 앱)를 열어 URL을 표시한다. */
export function openExternalBrowser(url: string): void {
  window.bridge?.openExternalBrowser(url);
}

/** 현재 웹뷰를 닫고 네이티브 화면으로 돌아간다. */
export function closeWebView(): void {
  window.bridge?.closeWebView();
}

// ── UI/UX (동기) ────────────────────────────────────────────────────────────

/**
 * 햅틱 피드백을 발생시킨다.
 * 가이드라인: light=탭/선택, medium=성공/완료, heavy=에러/삭제
 */
export function hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light'): void {
  window.bridge?.hapticFeedback?.(type);
}

/** 상태바(Status Bar) 색상과 아이콘 테마를 설정한다. */
export function setStatusBarColor(color: string, isDark = false): void {
  window.bridge?.setStatusBarColor(color, isDark);
}

/** 네이티브 전역 로딩 인디케이터 표시 여부를 설정한다. */
export function showNativeLoading(show: boolean): void {
  window.bridge?.showNativeLoading(show);
}

/**
 * 네이티브 토스트 메시지를 표시한다.
 * showNativeToast는 앱 버전 1.1.0 이상에서만 동작한다.
 * isVersionAtLeast('1.1.0') 확인 후 호출 권장.
 */
export function showNativeToast(message: string): void {
  // optional chaining: 구버전 앱에 메서드가 없을 수 있음
  window.bridge?.showNativeToast?.(message);
}

// ── 환경 정보 ─────────────────────────────────────────────────────────────────

/**
 * 디바이스 정보를 요청한다.
 * 네이티브가 `deviceInfo` 이벤트로 응답한다.
 *
 * @returns 플랫폼, OS 버전, 앱 버전, 모델명 등 디바이스 정보
 * @throws BridgeTimeoutError  5초 이내 응답 없을 때
 */
export async function getDeviceInfo(): Promise<Record<string, unknown>> {
  if (!window.bridge) throw new Error('[Bridge] bridge 객체가 없습니다.');

  const promise = bridgeEventBus.waitFor<Record<string, unknown>>('deviceInfo', TIMEOUT.DEVICE);
  window.bridge.getDeviceInfo();

  return promise;
}

/**
 * 앱 버전 정보를 요청한다.
 * 네이티브가 `appVersion` 이벤트로 응답한다.
 *
 * @returns version(예: '1.2.3')과 buildNumber(예: '100')
 * @throws BridgeTimeoutError  5초 이내 응답 없을 때
 */
export async function getAppVersion(): Promise<{ version: string; buildNumber: string }> {
  if (!window.bridge) throw new Error('[Bridge] bridge 객체가 없습니다.');

  const promise = bridgeEventBus.waitFor<{ version: string; buildNumber: string }>(
    'appVersion',
    TIMEOUT.VERSION,
  );
  window.bridge.getAppVersion();

  return promise;
}

// ── 타입 재-export (외부 편의) ───────────────────────────────────────────────
export { BridgeTimeoutError };
