# 203. DPoP 네이티브 전면위임(2-Full) — 소스 반영 결과 보고서

> ⚠️ **이력 안내:** 이 문서가 반영한 2-Full 구현은 이후 204에서 2-Lite로 되돌려졌습니다(`bridge.callApi`/`apiResponse`/`apiUploadProgress`/`authState`/`useAuthStateReceiver`/`setAuthState` 등 이 보고서의 신규·변경 항목 다수가 204에서 제거·대체됨). 현재 구현 기준 문서는 `13-auth-system.md` §9입니다. 이 문서는 2-Full 구현 당시의 기록으로 보존합니다.
>
> 대상: 202 설계서 내용을 실제 소스에 반영한 결과 기록
> 기본 동작 불변: `NEXT_PUBLIC_DPOP_MODE` 미설정/`webview` = 현행(Mode 1). `native` 일 때만 2-Full 활성.
> 서버(login-server): **변경 없음**(토큰 키-미바인딩, 네이티브 기존 호출과 동일).

---

## 1. 변경 파일 목록 (총 21개: 웹 17, 네이티브 4, 서버 0)

### 웹 (hpoint-mobile) — 신규 3
| 파일 | 내용 |
|---|---|
| `lib/auth/dpop/mode.ts` | `resolveDpopMode()` — env + 능력체크(callApi) 폴백 |
| `lib/bridge/nativeApiTransport.ts` | `callViaNative`/`callViaNativeUpload` + `NativeApiRequest/Response` 타입, requestId 상관관계·타임아웃 |
| `features/auth/hooks/useAuthStateReceiver.ts` | `authState` 수신 + `requestAuthState` 당겨오기(native 전용, 토큰 없음) |

### 웹 (hpoint-mobile) — 변경 14
| 파일 | 변경점 |
|---|---|
| `types/bridge.ts` | `NativeBridge`에 `callApi?`·`requestAuthState?` 추가 |
| `lib/bridge/bridgeProtocol.ts` | `BridgeEventName`에 `apiResponse`·`apiUploadProgress`·`authState` 추가 |
| `lib/bridge/bridgeClient.ts` | ALLOWED_EVENTS + EVENT_VALIDATORS에 3종 등록 |
| `lib/utils/errorMessages.ts` | `network`·`timeout`·`unauthorized` 메시지 추가 |
| `lib/api/apiClient.ts` | verb 레벨 native 분기(`nativeRequest`/`mapTransportError`), `withRefresh`는 webview 전용 |
| `lib/api/fileUploadClient.ts` | native 업로드(`nativeUpload`/`fileToBase64`) + `onClearAuth` 주입 |
| `features/auth/hooks/useAuthStore.ts` | `setAuthState(user, isAuthenticated)` 액션(토큰 미설정) |
| `features/auth/hooks/useAuthInterceptor.ts` | `configureFileUploadClient`에 `onClearAuth` 주입 |
| `app/WebviewLayoutClient.tsx` | `useAuthStateReceiver()` 마운트 |
| `features/auth/hooks/useKeyRotation.ts` | native 모드 early-return |
| `features/auth/hooks/useTokenReceiver.ts` | native 모드 early-return |
| `app/(protected)/layout.tsx` | native 모드 부트스트랩(requestAuthCode) skip |
| `features/auth/hooks/useAuth.ts` | `logout()` native 분기(bridge.logout 권위) |
| `middleware.ts` | native 모드 CSP `connect-src`에서 API 오리진 제거 |

### 네이티브 (android-mobile) — 신규 1 / 변경 3
| 파일 | 변경점 |
|---|---|
| `core/bridge/handler/ApiBridgeHandler.kt` (신규) | `callApi`(okHttpClient 위임·예외→transportError·multipart 진행률) + `requestAuthState` + `authStateJson` |
| `core/bridge/JsBridge.kt` | 생성자에 `ApiBridgeHandler` 주입 + `@JavascriptInterface callApi`/`requestAuthState` |
| `core/network/ApiClient.kt` | 로깅 release=NONE/debug=BODY + `redactHeader("Authorization"/"DPoP")` |
| `core/webview/WebViewScreen.kt` | `UserSessionStore.state` 구독→`authState` 발송 + ON_RESUME 재동기화 |

---

## 2. 핵심 구현 상세

**모드 분기(단일 지점):** 모든 인증 송신은 `apiClient`·`fileUploadClient` 내부에서 `resolveDpopMode()`로 분기. 공개 API(get/post/put/delete/uploadFile) 시그니처 불변 → **화면/서비스 호출부 0 변경**.

**native 요청 흐름:** 웹 `nativeRequest` → `bridge.callApi(JSON)` → 네이티브 `ApiBridgeHandler`가 `ApiClient.okHttpClient`(DPoP·Auth·401 자동)로 호출 → `apiResponse` 이벤트 → 웹이 `Response`로 정규화해 기존 `toApiError`/`json()` 재사용. **토큰·키·proof 가 웹 JS에 일절 없음.**

**레이어 규칙 준수:** `lib/`은 store를 직접 import하지 않고 주입된 `_onClearAuth`로 NOT_AUTHENTICATED/401 세션 정리(가드가 로그인 이동).

**에러(B2 확정):** transportError(OFFLINE/TIMEOUT/NATIVE_ERROR/NOT_AUTHENTICATED) → ApiError, HTTP 에러는 `toApiError` 재사용. 모두 토스트, 폼 `fields`는 인라인(전역 토스트 핸들러가 `fields` 있으면 생략 — 호출부 정책).

**인증상태:** 네이티브 `UserSessionStore.state`(로그인/로그아웃) 구독으로 `authState{user,isAuthenticated}`(토큰 없음) 발송. 웹은 `useAuthStateReceiver`가 수신 + 마운트 시 `requestAuthState`로 당겨오기. `UserInfo(id/name/email/role/profileImage)` ↔ 웹 `User` 1:1, profileImage 미설정은 `""`.

**감사 통제:** native 빌드에서 CSP `connect-src`에 API 오리진 없음(웹이 백엔드에 못 닿음) + 네이티브 BODY 로깅 redact/NONE(토큰 logcat 차단) + 헤더 화이트리스트(Accept/Accept-Language만, Authorization/DPoP/Cookie/Content-Type 네이티브 전담).

---

## 3. 202 대비 편차 / 주의

1. **`useAuthInterceptor`:** 202 §16.4는 native 분기를 기술했으나, 기존 주입이 양 모드 모두 동작(native 경로는 getToken/onUnauthorized 미사용)하므로 **최소 변경**으로 `onClearAuth`만 추가(CLAUDE.md §2 단순화). 결과 동일.
2. **`JsBridge.kt` 헤더 주석**의 "메서드 목록 (20개)"이 22개로 stale — 주석만 미갱신(외과적 변경 원칙, 언급만).
3. **`mapTransportError` 중복:** apiClient와 fileUploadClient가 각자 transportError→ApiError 매핑(모듈별 `_onClearAuth` 때문). ~5줄 중복 허용.
4. **데드코드 미삭제(기존):** `lib/api/apiClient - 복사본.ts`는 그대로(202 지침). native 모드 영향 없음.

---

## 4. 검증 결과 ⚠️

**웹 — tsc 미완(샌드박스 한계) + 수동 타입검토:**
- 이 실행 환경의 리눅스 마운트가 **한글 포함 파일을 잘린 상태로 노출**(파일도구/실제 Windows 파일은 정상)하여 `npx tsc --noEmit`가 거짓 구문오류를 내 **신뢰 불가**. 마운트는 자가회복·재기록으로도 동기화되지 않음.
- 대신 파일도구(실제 파일) 기준 **수동 타입검토** 수행, 결함 1건 발견·수정: `bridge.callApi`를 optional로 선언해 `window.bridge!.callApi(...)` 직접호출이 타입오류 → `callApi!(...)`로 수정(`nativeApiTransport.ts`).
- **권장 후속:** 사용자 환경에서 `cd hpoint-mobile && npx tsc --noEmit` 및 `eslint` 실행.

**네이티브 — 컴파일 미검증:**
- 이 환경은 Android SDK/Gradle 빌드 불가 → 컴파일 검증 못 함. 표준 okhttp/okio·Hilt 패턴으로 작성.
- **권장 후속:** `./gradlew :app:compileDebugKotlin`(또는 assembleDebug)로 컴파일 확인. 점검 포인트: okhttp 4.x 확장 import(`RequestBody.Companion.toRequestBody`, `MediaType.Companion.toMediaTypeOrNull`), okio(`ForwardingSink`/`buffer()`), Hilt가 `ApiBridgeHandler`(ApiClient+UserSessionStore) 주입.

**기능 검증(빌드 후):** 202 §11 단계(동시성·401·authState 레이스·업로드·CSP·logcat·회귀) 수행 권장.

---

## 5. 활성화 / 잔여

**활성화:** `hpoint-mobile/.env.local`에 `NEXT_PUBLIC_DPOP_MODE=native` 추가 후 재빌드. 미설정/`webview`면 기존 동작 그대로.

**출시 전 잔여(202 §15):** 네이티브 callApi 도입 버전 확정(현 능력체크가 실가드), 헤더 화이트리스트 실사용 재확인, (있다면) iOS 병행 구현, 테스트 산출물. 전역 토스트 핸들러의 `fields`→인라인 정책이 실제로 적용돼 있는지 확인.
