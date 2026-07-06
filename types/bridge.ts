/**
 * Native Bridge 인터페이스 타입
 * Native App이 window.bridge 객체를 주입합니다.
 */

interface NativeBridge {
  /** 간편인증 코드 요청 → window.onBridgeEvent('appAuthCode', { code }) */
  requestAuthCode(): void;
  /** 로그아웃 알림 */
  logout(): void;
  /** Refresh token 저장 (Native 보안 저장소) */
  saveRefreshToken(token: string): void;
  /** 생체 인증 요청 → window.onBridgeEvent('biometricResult', { success, error? }) */
  requestBiometric(): void;
  /** PIN 인증 요청 → window.onBridgeEvent('pinResult', { success, error? }) */
  requestPin(): void;
  /** GPS 요청 → window.onBridgeEvent('gpsResult', { latitude, longitude, accuracy }) */
  requestGPS(): void;
  /** 카메라 촬영 → window.onBridgeEvent('cameraResult', { base64, mimeType, width, height }) */
  requestCamera(): void;
  /** 갤러리 선택 → window.onBridgeEvent('galleryResult', { base64, mimeType, width, height }) */
  requestGallery(): void;
  /** 이미지 다운로드(사진 라이브러리 저장) → window.onBridgeEvent('imageDownloadResult', { success, error? }). 일부 구버전 앱 미지원 */
  requestImageDownload?(url: string, fileName: string): void;
  /** 기기 정보 조회 */
  getDeviceInfo(): void;
  /** 앱 버전 조회 */
  getAppVersion(): void;
  /** 뒤로가기 */
  goBack(): void;
  /** WebView 닫기 */
  closeWebView(): void;
  /** 상태바 색상 설정 */
  setStatusBarColor(color: string, isDark?: boolean): void;
  /** 네이티브 로딩 표시/숨기기 */
  showNativeLoading(show: boolean): void;
  /** 네이티브 토스트 메시지 표시 */
  showNativeToast(message: string): void;
  /** 외부 브라우저 열기 */
  openExternalBrowser(url: string): void;
  /** 걸음수 조회 → window.onBridgeEvent('stepCountResult', { steps, date }) */
  requestStepCount(date: string): void;
  /** 햅틱 피드백 */
  hapticFeedback?(type?: 'light' | 'medium' | 'heavy'): void;
  /** 클립보드 복사 */
  copyToClipboard?(text: string): void;
  /** 동영상 플레이어 열기 */
  openVideoPlayer?(url: string, videoId: string, startPosition?: number): void;
  /** [2-Lite] DPoP proof 서명 위임 (동기 반환) — 네이티브 KeyStore로 서명. 키 없으면 null */
  createDpopProof?(method: string, url: string): string | null;
  /** [2-Lite] 네이티브 세션의 액세스 토큰 발급/갱신 요청 → window.onBridgeEvent('tokenReceived', {...}) */
  requestNativeToken?(): void;
}

declare global {
  interface Window {
    /** Native App이 주입하는 Bridge 객체 */
    bridge?: NativeBridge;
    /** Native → WebView 이벤트 수신 콜백 (bridgeClient에서 자동 등록) */
    onBridgeEvent?: (event: string, data: unknown) => void;
  }
}

export {};
