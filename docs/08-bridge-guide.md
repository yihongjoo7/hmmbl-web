# Native Bridge 통합 가이드

> 대상: 개발자  
> `lib/bridge/` 전체 구조, 이벤트 버스, 액션 함수, 앱 버전 호환성 체크를 다룹니다.

---

## 1. Bridge 통신 구조

```
웹 (JavaScript)                    네이티브 앱
─────────────────                  ──────────────────
window.bridge.requestGPS()    →    GPS 권한 요청 + 위치 조회
                               ←   window.onBridgeEvent('gpsResult', {...})
```

| 방향 | 방법 | 설명 |
|---|---|---|
| 웹 → 네이티브 | `window.bridge.[method]()` | 네이티브 기능 호출 |
| 네이티브 → 웹 | `window.onBridgeEvent(event, data)` | 이벤트 수신 |

`window.bridge`는 네이티브 앱이 WebView에 주입하는 객체입니다.  
웹 브라우저 환경에서는 존재하지 않으므로 항상 optional chaining 또는 `isWebView()` 체크를 사용합니다.

---

## 2. 이벤트 버스 (`lib/bridge/bridgeClient.ts`)

`window.onBridgeEvent`가 수신한 이벤트를 내부 이벤트 버스(`bridgeEventBus`)로 분배합니다.

### 보안 필터

수신 이벤트는 2단계 필터를 통과해야 처리됩니다.

**1단계: ALLOWED_EVENTS 화이트리스트**

```ts
const ALLOWED_EVENTS = new Set([
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
```

목록에 없는 이벤트는 경고 로그와 함께 무시됩니다.  
신규 이벤트 추가 시 이 목록과 `bridgeProtocol.ts`의 `BridgeEventName`에 함께 등록해야 합니다.

**2단계: EVENT_VALIDATORS 페이로드 검증**

이벤트별로 페이로드 구조를 검증합니다.  
검증 실패 시 drop됩니다.

```ts
// 예시: gpsResult는 latitude 또는 error 중 하나 필수
gpsResult: (d) => typeof d === 'object' && d !== null && ('latitude' in d || 'error' in d)
```

### 이벤트 버스 API

```ts
import { bridgeEventBus } from '@/lib/bridge/bridgeClient';

// 지속 구독 (컴포넌트 unmount 시 반환된 함수로 해제)
const unsubscribe = bridgeEventBus.on('appBackPressed', handler);
useEffect(() => unsubscribe, []);

// 1회 구독
bridgeEventBus.once('appVersion', handler);

// Promise로 대기 (타임아웃 지정)
const result = await bridgeEventBus.waitFor('gpsResult', 45_000);
```

---

## 3. Bridge Public API (`lib/bridge/index.ts`)

`lib/bridge/index.ts`에서 모든 public 함수를 export합니다.  
features 레이어에서는 이 경로로 import합니다.

```ts
import {
  // 이벤트 버스 + 환경 감지
  bridgeEventBus,
  BridgeTimeoutError,
  isWebView,
  // 프로토콜 타입 + 에러 코드
  BridgeErrorCode,
  isCameraError,
  // 브릿지 액션
  requestAuthCode,
  requestBiometric,
  requestPin,
  requestCamera,
  requestGallery,
  requestGPS,
  getLocation,
  requestStepCount,
  requestImageDownload,
  goBack,
  closeWebView,
  openExternalBrowser,
  hapticFeedback,
  setStatusBarColor,
  showNativeLoading,
  showNativeToast,
  getDeviceInfo,
  // 앱 버전 유틸 (캐싱 + semver 비교)
  getAppVersion,
  isVersionAtLeast,
  resetVersionCache,
} from '@/lib/bridge';
```

실제 구현체는 `bridgeClient.ts`(이벤트 버스·환경 감지)·`bridgeProtocol.ts`(타입·에러 코드)·`bridgeActions.ts`(액션 함수)·`appVersion.ts`(버전 유틸)에 나뉘어 있으며, `index.ts`가 이를 하나의 배럴로 재export합니다.  
`bridgeEventBus.ts`·`bridge.ts`·`bridgeErrorCodes.ts`는 해당 경로로 직접 import하는 기존 코드를 위한 하위 호환 re-export 파일입니다(신규 코드는 `@/lib/bridge` 배럴을 사용).

---

## 4. Bridge Action 함수 (`lib/bridge/bridgeActions.ts`)

### 타임아웃 상수

| 상수 | 값 | 대상 기능 |
|---|---|---|
| `AUTH_CODE` | 10초 | 인증 코드 발급 |
| `BIOMETRIC` | 60초 | 생체인증 (사용자 입력 대기) |
| `PIN` | 90초 | PIN 인증 (네이티브 다이얼로그 60초 + 여유) |
| `CAMERA` | 120초 | 카메라 촬영·편집 |
| `GALLERY` | 120초 | 갤러리 선택 |
| `GPS` | 45초 | GPS 위치 (권한 다이얼로그 여유 포함) |
| `STEP_COUNT` | 45초 | 걸음수 (Health Connect 권한 다이얼로그 여유) |
| `DEVICE` | 5초 | 디바이스 정보 |
| `VERSION` | 5초 | 앱 버전 |
| `DOWNLOAD` | 120초 | 이미지 다운로드 |

### 인증 관련

```ts
// Authorization Code 요청 (앱 로그인 세션 → 1회성 코드)
const code = await requestAuthCode();
// throws: Error('NOT_AUTHENTICATED'), Error('NETWORK_ERROR'), BridgeTimeoutError

// 생체인증 (지문 / FaceID)
const success = await requestBiometric();
// throws: Error(errorCode), BridgeTimeoutError

// PIN 인증
const success = await requestPin();
// throws: Error(errorCode), BridgeTimeoutError
```

### 미디어

```ts
// 카메라 촬영
const photo = await requestCamera();
// returns: { base64: string, mimeType: string, width: number, height: number }

// 갤러리 선택
const image = await requestGallery();
// returns: { base64: string, mimeType: string, width: number, height: number }

// 이미지 다운로드 (네이티브 사진 라이브러리 저장)
await requestImageDownload(url, fileName);
// throws: Error('NOT_SUPPORTED')  구버전 앱 미지원 시
```

### 위치

```ts
// 자동 분기: 웹뷰이면 네이티브 GPS, 아니면 navigator.geolocation 폴백
const { latitude, longitude, accuracy } = await getLocation();

// 네이티브 GPS 직접 호출
const gps = await requestGPS();
```

### 걸음수 (Android Health Connect)

```ts
const { steps, date } = await requestStepCount('2024-01-15');
// date 생략 시 오늘 날짜
```

### 네비게이션 (동기)

```ts
goBack();              // 네이티브 뒤로가기
closeWebView();        // 현재 웹뷰 닫기
openExternalBrowser(url);  // 기본 브라우저 앱으로 URL 열기
```

### UI/UX (동기)

```ts
hapticFeedback('light');   // 탭/선택
hapticFeedback('medium');  // 성공/완료
hapticFeedback('heavy');   // 에러/삭제

setStatusBarColor('#FFFFFF', false);  // color, isDark
showNativeLoading(true);
showNativeLoading(false);

// ⚠️ 앱 버전 1.1.0 이상에서만 동작
// isVersionAtLeast('1.1.0') 확인 후 호출 권장
showNativeToast('저장되었습니다.');
```

### 환경 정보

```ts
const deviceInfo = await getDeviceInfo();
// returns: { platform: 'ios'|'android', osVersion: string, model: string, ... }
```

---

## 5. 에러 처리 패턴

```ts
import { BridgeTimeoutError } from '@/lib/bridge';

try {
  const location = await getLocation();
} catch (err) {
  if (err instanceof BridgeTimeoutError) {
    // 타임아웃
    toast.show('위치 응답 시간이 초과되었습니다.');
  } else if (err instanceof Error) {
    // 네이티브 에러 코드
    const errorMessages: Record<string, string> = {
      'PERMISSION_DENIED': '위치 접근 권한이 없습니다.',
      'GPS_DISABLED':      'GPS가 꺼져 있습니다.',
    };
    toast.show(errorMessages[err.message] ?? '위치를 가져올 수 없습니다.');
  }
}
```

---

## 6. 앱 버전 호환성 체크 (`lib/bridge/appVersion.ts`)

구버전 네이티브 앱에서 지원하지 않는 bridge 메서드를 호출하면 앱이 크래시할 수 있습니다.  
`isVersionAtLeast()`로 사전 체크합니다.

```ts
import { isVersionAtLeast } from '@/lib/bridge/appVersion';

// showNativeToast는 앱 1.1.0 이상에서만 지원
if (await isVersionAtLeast('1.1.0')) {
  showNativeToast('저장되었습니다.');
} else {
  // 웹 Toast 폴백
  useToastStore.getState().addToast('저장되었습니다.');
}
```

### 내부 동작

1. 세션 내 첫 호출 시 `window.bridge.getAppVersion()` 실행
2. `appVersion` 이벤트 수신 → `{ major, minor, patch }` 파싱 후 메모리 캐시
3. 이후 호출은 캐시 반환 (네이티브 재요청 없음)
4. 5초 내 응답 없으면 `null` 반환 → `isVersionAtLeast()`는 `false` 반환

### `getAppVersion()` 반환 타입

```ts
// lib/bridge/appVersion.ts
interface ParsedVersion {
  major: number;
  minor: number;
  patch: number;
}

// null: 웹뷰 아님 또는 타임아웃
const version = await getAppVersion(); // ParsedVersion | null
```

### 테스트에서 캐시 초기화

```ts
import { resetVersionCache } from '@/lib/bridge/appVersion';

// 각 테스트 케이스 시작 전에 호출
resetVersionCache();
```

---

## 7. NativeBridge 인터페이스 (`types/bridge.ts`)

네이티브 앱이 주입하는 `window.bridge`의 전체 인터페이스입니다.

```ts
interface NativeBridge {
  // 인증
  requestAuthCode(): void;
  logout(): void;
  saveRefreshToken(token: string): void;
  requestBiometric(): void;
  requestPin(): void;

  // 미디어
  requestCamera(): void;
  requestGallery(): void;
  requestImageDownload?(url: string, fileName: string): void;

  // 위치·센서
  requestGPS(): void;
  requestStepCount(date: string): void;

  // 네비게이션
  goBack(): void;
  closeWebView(): void;
  openExternalBrowser(url: string): void;

  // UI/UX
  setStatusBarColor(color: string, isDark?: boolean): void;
  showNativeLoading(show: boolean): void;
  showNativeToast(message: string): void;
  hapticFeedback?(type?: 'light' | 'medium' | 'heavy'): void;
  copyToClipboard?(text: string): void;

  // 동영상
  openVideoPlayer?(url: string, videoId: string, startPosition?: number): void;

  // 정보 조회
  getDeviceInfo(): void;
  getAppVersion(): void;

  // native DPoP 모드 — 2-Lite (32-auth-dpop-internals.md 7장)
  /** DPoP proof 서명 위임(동기 반환) — 네이티브 KeyStore. 키 없으면 null */
  createDpopProof?(method: string, url: string): string | null;
  /** 네이티브 세션 토큰 발급/갱신 요청 → 'tokenReceived' 이벤트로 응답 */
  requestNativeToken?(): void;
}
```

`?` 표시 메서드는 구버전 앱에 없을 수 있습니다.  
호출 전 `isVersionAtLeast()` 또는 optional chaining(`window.bridge?.method?.()`)으로 처리합니다.

---

## 8. 웹뷰 환경 체크

```ts
import { isWebView } from '@/lib/bridge/bridgeClient';

if (isWebView()) {
  // 네이티브 앱 내 웹뷰 환경
} else {
  // 일반 브라우저 (개발 서버, Storybook 등)
}
```

`isWebView()`는 `window.bridge` 존재 여부를 반환합니다.

---

## 9. native 모드 DPoP 위임 (`lib/auth/dpop/proofProvider.ts`)

`NEXT_PUBLIC_DPOP_MODE=native`일 때도 `lib/api/apiClient.ts`·`lib/api/fileUploadClient.ts`는 여전히 `fetch`/`XHR`을 웹이 직접 호출합니다.  
달라지는 것은 DPoP proof의 서명 주체뿐입니다 — `getDPoPHeader()`가 모드에 따라 웹 키(`createDPoPProof`) 또는 네이티브 KeyStore(`bridge.createDpopProof`)를 선택합니다.

```ts
import { getDPoPHeader } from '@/lib/auth/dpop/proofProvider';

// webview 모드: 웹 IndexedDB 키로 서명. native 모드: window.bridge.createDpopProof(method, url) 위임
const proof = await getDPoPHeader(`${baseUrl}${url}`, 'GET');
```

모드 전환·요청 흐름·토큰 발급 방식 등 내부 구현 상세는 관리자 문서 참고: `32-auth-dpop-internals.md` 7장, `docs/30-dpop-mode-switch-proposal.md`.
