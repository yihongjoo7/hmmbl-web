'use client';

/**
 * app/dev/bridge/layout.tsx
 *
 * 개발/스테이징 환경 전용 Mock 브릿지 주입 레이아웃
 *
 * 실제 네이티브 앱 없이 브릿지 기능을 개발/테스트할 수 있도록
 * window.bridge Mock 객체와 window.onBridgeEvent 핸들러를 주입한다.
 *
 * 보안:
 *   NEXT_PUBLIC_APP_ENV === 'prod' | 'staging' 환경에서는 Mock을 주입하지 않는다.
 *
 * 메서드명은 122.네이티브_연동.md의 인터페이스 명세를 따른다.
 */

import { ReactNode, useEffect } from 'react';

/** Mock 이미지 데이터 (SVG base64, 300x300 회색 사각형) */
const MOCK_IMAGE_BASE64 =
  'PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4' +
  '8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAl' +
  'IiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Nb2NrPC90ZXh0Pjwvc3ZnPg==';

/** Mock 이미지 결과 공통 페이로드 */
const MOCK_CAMERA_RESULT = {
  base64: MOCK_IMAGE_BASE64,
  mimeType: 'image/png',
  width: 300,
  height: 300,
  fileSize: 500,
};

/**
 * window.bridge Mock 객체를 주입한다.
 * 이미 주입된 경우 중복 실행하지 않는다.
 */
function injectBridgeMock(): void {
  if (typeof window === 'undefined') return;

  // 중복 주입 방지
  if ((window as Window & { __bridgeMockInjected?: boolean }).__bridgeMockInjected) return;

  // 실제 네이티브 브릿지가 이미 주입돼 있으면 Mock으로 덮어쓰지 않는다.
  // addJavascriptInterface로 주입된 window.bridge는 읽기 전용 프로퍼티라,
  // 재할당(window.bridge = {...}) 시 TypeError가 발생해 화면이 빈 화면으로 깨진다.
  // (브라우저에는 window.bridge가 없으므로 이 가드를 통과해 Mock이 정상 주입된다.)
  if (typeof (window as Window & { bridge?: unknown }).bridge !== 'undefined') return;

  // 프로덕션/스테이징 환경에서는 Mock 비활성화
  const appEnv = process.env.NEXT_PUBLIC_APP_ENV ?? 'dev';
  if (appEnv === 'prod' || appEnv === 'staging') {
    console.warn('[MockBridge] 프로덕션/스테이징 환경에서는 Mock이 비활성화됩니다.');
    return;
  }

  // Mock 메서드 구현
  // 각 메서드는 실제 네이티브와 유사한 지연 후 onBridgeEvent를 통해 이벤트를 발행한다.
  window.bridge = {
    // 인증 코드 요청 -> appAuthCode 이벤트 (500ms 후)
    requestAuthCode: () => {
      console.log('[MockBridge] requestAuthCode 호출');
      setTimeout(() => {
        window.onBridgeEvent?.('appAuthCode', { code: 'mock-auth-' + String(Date.now()) });
      }, 500);
    },

    // 생체인증 요청 -> biometricResult 이벤트 (1.5초 후, 성공)
    requestBiometric: () => {
      console.log('[MockBridge] requestBiometric 호출');
      setTimeout(() => {
        window.onBridgeEvent?.('biometricResult', { success: true });
      }, 1500);
    },

    // PIN 인증 요청 -> pinResult 이벤트 (1초 후, 성공)
    requestPin: () => {
      console.log('[MockBridge] requestPin 호출');
      setTimeout(() => {
        window.onBridgeEvent?.('pinResult', { success: true });
      }, 1000);
    },

    // 앱 로그아웃 (단방향, 응답 없음)
    logout: () => {
      console.log('[MockBridge] logout 호출');
    },

    // refresh token 저장 (단방향)
    saveRefreshToken: (token: string) => {
      console.log('[MockBridge] saveRefreshToken 호출:', token.slice(0, 8) + '...');
    },

    // 카메라 촬영 -> cameraResult 이벤트 (1초 후)
    requestCamera: () => {
      console.log('[MockBridge] requestCamera 호출');
      setTimeout(() => {
        window.onBridgeEvent?.('cameraResult', MOCK_CAMERA_RESULT);
      }, 1000);
    },

    // 갤러리 선택 -> galleryResult 이벤트 (800ms 후)
    requestGallery: () => {
      console.log('[MockBridge] requestGallery 호출');
      setTimeout(() => {
        window.onBridgeEvent?.('galleryResult', MOCK_CAMERA_RESULT);
      }, 800);
    },

    // 네이티브 동영상 플레이어 열기 -> 진행률/종료 이벤트 시뮬레이션
    openVideoPlayer: (url: string, videoId: string, startPosition = 0) => {
      void url; // url은 네이티브가 처리하므로 Mock에서는 미사용
      console.log('[MockBridge] openVideoPlayer - videoId: ' + videoId + ', startAt: ' + String(startPosition) + 's');
      // 1.5초 후 진행률 이벤트 1회
      setTimeout(() => {
        window.onBridgeEvent?.('videoProgress', {
          videoId,
          currentTime: startPosition + 3,
          duration: 120,
          percentage: (startPosition + 3) / 120,
          timestamp: new Date().toISOString(),
        });
      }, 1500);
      // 3초 후 플레이어 종료 이벤트
      setTimeout(() => {
        window.onBridgeEvent?.('videoPlayerClosed', {
          videoId,
          currentTime: startPosition + 5,
          duration: 120,
          watchedPercentage: (startPosition + 5) / 120,
        });
      }, 3000);
    },

    // GPS 위치 요청 -> gpsResult 이벤트 (600ms 후, 서울시청 좌표)
    requestGPS: () => {
      console.log('[MockBridge] requestGPS 호출');
      setTimeout(() => {
        window.onBridgeEvent?.('gpsResult', {
          latitude: 37.5665,
          longitude: 126.9780,
          accuracy: 15,
        });
      }, 600);
    },

    // 네비게이션 (단방향)
    goBack: () => {
      console.log('[MockBridge] goBack 호출');
    },
    openExternalBrowser: (url: string) => {
      console.log('[MockBridge] openExternalBrowser:', url);
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    closeWebView: () => {
      console.log('[MockBridge] closeWebView 호출');
    },

    // UI/UX (단방향, 로그만 출력)
    hapticFeedback: (type) => {
      console.log('[MockBridge] hapticFeedback(' + type + ')');
    },
    setStatusBarColor: (color, isDark) => {
      console.log('[MockBridge] setStatusBarColor(' + color + ', isDark=' + String(isDark) + ')');
    },
    showNativeLoading: (show) => {
      console.log('[MockBridge] showNativeLoading(' + String(show) + ')');
    },
    showNativeToast: (message) => {
      console.log('[MockBridge] showNativeToast: "' + message + '"');
    },
    copyToClipboard: (text) => {
      console.log('[MockBridge] copyToClipboard: "' + text + '"');
      void navigator.clipboard?.writeText(text).catch(() => {});
    },

    // 환경 정보 -> deviceInfo 이벤트 (200ms 후)
    getDeviceInfo: () => {
      console.log('[MockBridge] getDeviceInfo 호출');
      setTimeout(() => {
        window.onBridgeEvent?.('deviceInfo', {
          platform: 'android',
          osVersion: '14',
          appVersion: '1.2.0',
          buildNumber: '100',
          deviceModel: 'Mock Device',
          deviceId: 'mock-device-id-001',
          locale: 'ko',
          timezone: 'Asia/Seoul',
          networkType: 'wifi',
        });
      }, 200);
    },

    // 앱 버전 -> appVersion 이벤트 (200ms 후)
    getAppVersion: () => {
      console.log('[MockBridge] getAppVersion 호출');
      setTimeout(() => {
        window.onBridgeEvent?.('appVersion', {
          version: '1.2.0',
          buildNumber: '100',
        });
      }, 200);
    },

    // 걸음수 조회 -> stepCountResult 이벤트 (400ms 후)
    requestStepCount: (date: string) => {
      console.log('[MockBridge] requestStepCount 호출:', date);
      setTimeout(() => {
        window.onBridgeEvent?.('stepCountResult', {
          steps: 7342,
          date: date || new Date().toISOString().slice(0, 10),
        });
     }, 400);
   },
  };

  (window as Window & { __bridgeMockInjected?: boolean }).__bridgeMockInjected = true;
  console.log('[MockBridge] 주입 완료 (환경:', appEnv, ')');
}

export default function BridgeLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    injectBridgeMock();
  }, []);

  return <>{children}</>;
}
