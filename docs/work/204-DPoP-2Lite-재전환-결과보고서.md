# 204. DPoP 네이티브 위임 2-Full → 2-Lite 재전환 — 결과 보고서

<<<<<<< HEAD
> 배경: 요건이 "인증 API 전체를 네이티브가 대행(2-Full)"에서 "**웹뷰가 브릿지로 네이티브로부터 DPoP 헤더(proof)만 수신해 HTTP 헤더에 세팅하고, 서버(스프링 서비스)로 거래를 직접 요청**"으로 변경됨에 따라, 202/203에서 구현된 2-Full을 `30-dpop-mode-switch-proposal.md`가 원래 권고했던 **2-Lite**로 되돌린 작업 기록.  
> 서버: 변경 없음(202/203 당시 결론과 동일 — 토큰이 DPoP 키에 바인딩되지 않아 웹/네이티브 키가 교환 가능. `docs/21` 2장 참고).  
> 대상 저장소: 최초 작성 시점에는 웹(hmmbl-web)만 반영했고 네이티브(android-mobile) 쪽은 범위 밖으로 남겨뒀으나(5장), **이후 android-mobile도 2-Lite로 반영 완료**했다. 변경 내용은 5.1절에 추가 기록.
=======
> 배경: 요건이 "인증 API 전체를 네이티브가 대행(2-Full)"에서 "**웹뷰가 브릿지로 네이티브로부터 DPoP 헤더(proof)만 수신해 HTTP 헤더에 세팅하고, 서버(스프링 서비스)로 거래를 직접 요청**"으로 변경됨에 따라, 202/203에서 구현된 2-Full을 `21-dpop-mode-switch-proposal.md`가 원래 권고했던 **2-Lite**로 되돌린 작업 기록.
> 서버: 변경 없음(202/203 당시 결론과 동일 — 토큰이 DPoP 키에 바인딩되지 않아 웹/네이티브 키가 교환 가능. `docs/21` §2 참고).
> 대상 저장소: 최초 작성 시점에는 웹(hpoint-mobile)만 반영했고 네이티브(android-mobile) 쪽은 범위 밖으로 남겨뒀으나(§5), **이후 android-mobile도 2-Lite로 반영 완료**했다. 변경 내용은 §5.1에 추가 기록.
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda

---

## 1. 무엇이 바뀌었나 (2-Full → 2-Lite)

| 항목 | 2-Full (202/203, 되돌려짐) | 2-Lite (204, 현재) |
|---|---|---|
| HTTP 전송 주체 | 네이티브(`bridge.callApi` → `ApiClient.okHttpClient`) | **웹(fetch/XHR)** — webview 모드와 동일 |
| 네이티브가 웹에 주는 것 | 최종 HTTP 응답(`apiResponse`) | **DPoP proof 문자열만**(`createDpopProof`, 동기 반환) |
| 액세스 토큰 위치 | 네이티브만 보유(웹 `_accessToken` 항상 null) | **웹 메모리에도 보유**(네이티브가 `tokenReceived`로 푸시) |
| 인증 상태 판정 | `authState` 이벤트(토큰 없음) | `tokenReceived`(토큰 포함) → 기존 `setAuth`와 동일 |
| CSP `connect-src` | native 모드에서 API 오리진 제외 | **모드 무관 항상 허용**(웹이 항상 직접 연결) |
| 업로드 | base64 인코딩 후 `callApi` multipart 위임 | **웹이 직접 multipart 전송**(DPoP 헤더만 교체) |

---

<<<<<<< HEAD
## 2. 변경 파일 목록 (웹, hmmbl-web)
=======
## 2. 변경 파일 목록 (웹, hpoint-mobile)
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda

### 신규
| 파일 | 내용 |
|---|---|
| `lib/auth/dpop/proofProvider.ts` | `getDPoPHeader(url, method)` — webview는 `createDPoPProof`, native는 `window.bridge.createDpopProof` 위임 |

### 변경
| 파일 | 변경점 |
|---|---|
| `types/bridge.ts` | `callApi`/`requestAuthState` 제거 → `createDpopProof`/`requestNativeToken` 추가 |
| `lib/bridge/bridgeProtocol.ts` | `BridgeEventName`에서 `apiResponse`/`apiUploadProgress`/`authState` 제거 |
| `lib/bridge/bridgeClient.ts` | ALLOWED_EVENTS·EVENT_VALIDATORS에서 위 3종 제거 |
| `lib/bridge/bridgeActions.ts` | `requestNativeToken()` 추가(브릿지 호출 + `tokenReceived` 대기, `requestAuthCode`와 동일 패턴) |
| `lib/bridge/index.ts` | `requestNativeToken` re-export 추가 |
| `lib/auth/dpop/mode.ts` | 능력 체크를 `callApi` → `createDpopProof`로 교체 |
| `lib/api/apiClient.ts` | verb 레벨 native 위임(`nativeRequest`/`mapTransportError`) 제거. `buildHeaders()`가 `getDPoPHeader()` 사용. get/post/put/delete 모두 `withRefresh()`(fetch) 단일 경로로 통합 |
| `lib/api/fileUploadClient.ts` | native 업로드 위임(`nativeUpload`/`fileToBase64`/`callViaNativeUpload`) 제거. `sendUpload()`가 `getDPoPHeader()` 사용. `configureFileUploadClient`에서 `onClearAuth` 제거(native 401도 기존 `onUnauthorized` 재시도 경로로 흡수) |
| `lib/auth/interceptor.ts` | `createAuthInterceptor`에 모드 분기 추가: webview는 기존 `requestAuthCode`+`/auth/token` 유지(`refreshViaWebviewCode`), native는 `requestNativeToken()`(`refreshViaNative`) |
| `features/auth/hooks/useTokenReceiver.ts` | native 모드 early-return 제거 — 이제 두 모드 모두 `tokenReceived` 수신 |
| `features/auth/hooks/useAuthStore.ts` | `setAuthState` 액션 제거(호출부 소멸로 orphan) |
| `features/auth/hooks/useAuthInterceptor.ts` | `configureFileUploadClient` 호출에서 `onClearAuth` 인자 제거 |
| `app/(protected)/layout.tsx` | native 모드 분기를 "부트스트랩 skip"에서 `requestNativeToken()` 호출로 교체 |
| `app/WebviewLayoutClient.tsx` | `useAuthStateReceiver()` 마운트 제거 |
| `proxy.ts` | CSP `connect-src`의 native 모드 API 오리진 제외 로직 제거 — 항상 허용 |
| `lib/utils/errorMessages.ts` | `network`/`timeout`/`unauthorized` 키 제거(2-Full transportError 매핑 전용, orphan) |

### 삭제
| 파일 | 사유 |
|---|---|
| `lib/bridge/nativeApiTransport.ts` | `callApi` 기반 전송 계층 전체가 불필요(2-Lite는 웹이 직접 fetch) |
| `features/auth/hooks/useAuthStateReceiver.ts` | `authState`(토큰 없는 상태 푸시) 수신기 — `tokenReceived`로 대체되어 불필요 |

<<<<<<< HEAD
### 네이티브(android-mobile) — 반영 완료 (5.1절)
=======
### 네이티브(android-mobile) — 반영 완료 (§5.1)
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
최초 작성 시에는 아래 스켈레톤만 제시하고 android-mobile 작업은 범위 밖으로 남겨뒀으나, 이후 android-mobile 저장소에 직접 반영했다. 실제 구현은 신규 파일 추가 없이 기존 `AuthBridgeHandler`/`JsBridge`에 통합했다(스켈레톤의 `authHandler.provideNativeToken()`가 아니라 `authHandler.requestNativeToken()`으로 명명, `DPoPUtil.createDPoPProof`를 그대로 재사용).

**변경 파일**
| 파일 | 변경점 |
|---|---|
| `core/bridge/handler/AuthBridgeHandler.kt` | `DPoPUtil` 주입 추가. `createDpopProof(method,url): String?`(동기, `dPoPUtil.createDPoPProof` 위임) + `requestNativeToken(dispatch)`(매 호출마다 `authRepository.refreshToken()` 실제 수행 → 성공 시 `tokenReceived{access_token,user}`, 실패 시 `tokenReceived{error}`) 추가 |
| `core/bridge/JsBridge.kt` | 생성자에서 `apiHandler: ApiBridgeHandler` 제거. `@JavascriptInterface callApi`/`requestAuthState` 제거 → `createDpopProof`/`requestNativeToken` 추가(둘 다 `authHandler`에 위임) |
| `core/webview/WebViewScreen.kt` | `authStateJson` import 제거. `UserSessionStore.state` 구독 후 `authState` 이벤트를 웹에 쏘던 `LaunchedEffect` 전체 삭제, `ON_RESUME` 재동기화 블록에서도 `authState` 전송 제거(`appForeground` 전송은 유지) |

**삭제 파일**
| 파일 | 사유 |
|---|---|
| `core/bridge/handler/ApiBridgeHandler.kt` | `callApi`/`requestAuthState`를 호출하는 곳이 웹 쪽에 더 이상 없어 전체가 고아 코드 — 삭제(`authStateJson()` 헬퍼도 함께 제거) |

**`requestNativeToken` 설계 포인트:** 웹의 부트스트랩 호출과 401 재시도 호출이 동일한 이 메서드를 공유한다. `TokenStorage`에 만료시각 추적이 없어 "캐시된 토큰이 아직 유효한지" 판단할 수 없으므로, 캐시를 그대로 돌려주는 대신 매번 `authRepository.refreshToken()`으로 실제 갱신을 수행해 항상 최신 토큰을 보장한다(그렇지 않으면 만료 토큰을 반복 반환해 401 재시도 무한루프에 빠질 위험이 있었다). 에러 매핑은 기존 `requestAuthCode()`와 동일한 패턴(`HttpException 401` → `NOT_AUTHENTICATED`, 그 외 → `NETWORK_ERROR`)을 재사용했다.

**컴파일 검증 미완:** 이 작업 환경은 네트워크가 막혀 있어 Gradle 배포판을 내려받지 못해 `./gradlew :app:compileDebugKotlin`을 실행하지 못했다(202/203 때와 동일한 샌드박스 한계). 대신 변경/삭제한 심볼(`callApi`/`requestAuthState`/`authStateJson`/`ApiBridgeHandler`/`apiHandler`)에 대해 저장소 전체 grep으로 잔여 참조가 없음을 확인했다. **권장 후속:** 사용자 환경에서 `./gradlew :app:compileDebugKotlin` 실행.

---

## 3. 핵심 흐름 (구현 기준)

```
apiClient.get/post/put/delete
      │
      ▼
buildHeaders(url, method)
      │  token 있으면
      ▼
getDPoPHeader(url, method)          ← lib/auth/dpop/proofProvider.ts
      │  resolveDpopMode()
      ├─ webview → createDPoPProof(url, method)           (웹 IndexedDB 키 서명)
      └─ native  → window.bridge.createDpopProof(method, url)  (네이티브 KeyStore 서명, 동기)
      │
      ▼
Authorization: DPoP <token> / DPoP: <proof> 헤더로 fetch(baseUrl + url) — 웹이 직접 수행
      │
      ▼
401 → onUnauthorized()
      ├─ webview → requestAuthCode() → POST /auth/token
      └─ native  → requestNativeToken() → tokenReceived 이벤트 대기 → useTokenReceiver가 setAuth 반영
```

---

## 4. 202/203 대비 보안 성격 변화 (참고)

<<<<<<< HEAD
2-Full은 "액세스 토큰을 웹 JS에 절대 두지 않는다"는 감사 요건을 만족시키기 위한 구조였다(`docs/work/202` 1장). 2-Lite로 되돌리면 **native 모드에서도 액세스 토큰이 웹 메모리에 존재**하게 되어 그 요건은 더 이상 충족되지 않는다. 대신:

- DPoP 키·서명은 여전히 네이티브 KeyStore(하드웨어)에 있다 — 웹은 키를 생성·보유하지 않는다.
- 토큰 자체는 서버가 DPoP 키에 바인딩하지 않으므로(2장, `docs/21`), 웹이 토큰을 보유하는 것은 기존 webview 모드와 동일한 노출 수준이다.
=======
2-Full은 "액세스 토큰을 웹 JS에 절대 두지 않는다"는 감사 요건을 만족시키기 위한 구조였다(`docs/work/202` §1). 2-Lite로 되돌리면 **native 모드에서도 액세스 토큰이 웹 메모리에 존재**하게 되어 그 요건은 더 이상 충족되지 않는다. 대신:

- DPoP 키·서명은 여전히 네이티브 KeyStore(하드웨어)에 있다 — 웹은 키를 생성·보유하지 않는다.
- 토큰 자체는 서버가 DPoP 키에 바인딩하지 않으므로(§2, `docs/21`), 웹이 토큰을 보유하는 것은 기존 webview 모드와 동일한 노출 수준이다.
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
- CSP `connect-src`도 되돌아가 웹이 API 오리진에 항상 연결 가능하다(감사 통제 완화).

이 트레이드오프는 이번 요건 변경 시점에 확인된 사항이며, 추후 "토큰 미노출" 요건이 다시 필요해지면 202/203 방향(2-Full)으로 재전환해야 한다.

---

## 5. 잔여 작업

<<<<<<< HEAD
1. ~~네이티브(android-mobile) 구현 필요~~ — **완료.** `AuthBridgeHandler`/`JsBridge`에 `createDpopProof`/`requestNativeToken` 추가, `ApiBridgeHandler` 삭제(2.1절 참고). `resolveDpopMode()`의 능력 체크가 이제 실제로 `native`를 반환할 수 있다.
2. **android-mobile 컴파일 검증 필요** — 이 환경은 Gradle 배포판을 받을 네트워크가 없어 `./gradlew :app:compileDebugKotlin`을 실행하지 못했다. 사용자 환경에서 실행 권장.
3. **iOS 병행** — WKWebView 브릿지에도 동일한 두 메서드가 필요(현재 워크스페이스에 iOS 소스 없음, `docs/work/202` 15장-D와 동일한 한계).
4. **타입체크/린트** — hmmbl-web 쪽은 `npx tsc --noEmit`/`eslint` 통과 확인(6장). android-mobile은 위 2번 참고.
=======
1. ~~네이티브(android-mobile) 구현 필요~~ — **완료.** `AuthBridgeHandler`/`JsBridge`에 `createDpopProof`/`requestNativeToken` 추가, `ApiBridgeHandler` 삭제(§2.1 참고). `resolveDpopMode()`의 능력 체크가 이제 실제로 `native`를 반환할 수 있다.
2. **android-mobile 컴파일 검증 필요** — 이 환경은 Gradle 배포판을 받을 네트워크가 없어 `./gradlew :app:compileDebugKotlin`을 실행하지 못했다. 사용자 환경에서 실행 권장.
3. **iOS 병행** — WKWebView 브릿지에도 동일한 두 메서드가 필요(현재 워크스페이스에 iOS 소스 없음, `docs/work/202` §15-D와 동일한 한계).
4. **타입체크/린트** — hpoint-mobile 쪽은 `npx tsc --noEmit`/`eslint` 통과 확인(§6). android-mobile은 위 2번 참고.
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
5. **로그아웃 재검토(선택)** — `features/auth/hooks/useAuth.ts::logout()`의 native 분기는 이번 변경에서 건드리지 않았다(여전히 `bridge.logout()` + `clearAuth()`만 수행, 서버 `POST /auth/logout` 미호출). 2-Lite에서는 웹이 서버에 직접 연결 가능해졌으므로, webview 모드처럼 웹이 `authApi.logout()`도 함께 호출할지는 별도 결정이 필요하다.

---

## 6. 검증 결과

<<<<<<< HEAD
**hmmbl-web(웹):** `npx tsc --noEmit` 통과(에러 0), `eslint`도 이번 변경으로 인한 신규 이슈 없음(기존에 있던 `eqeqeq` 경고 1건은 이번 변경과 무관한 pre-existing 코드). 삭제·변경한 심볼(`callApi`, `requestAuthState`, `authState`, `apiResponse`, `apiUploadProgress`, `nativeApiTransport`, `useAuthStateReceiver`, `setAuthState`, `fallbackMessages.network/timeout/unauthorized`)에 대해 저장소 전체 grep으로 잔여 참조 없음을 확인.

**android-mobile(네이티브):** 이 작업 환경은 네트워크가 막혀 있어 Gradle 배포판을 받지 못해 `./gradlew :app:compileDebugKotlin`을 실행하지 못했다(202/203 때와 동일한 한계). 대신 삭제·변경한 심볼(`callApi`, `requestAuthState`, `authStateJson`, `ApiBridgeHandler`, `apiHandler`)에 대해 저장소 전체 grep으로 잔여 참조가 없음을 확인하고, 수정 파일들을 다시 읽어 문법·타입 시그니처를 수동 대조했다.

**권장 후속:** `cd hmmbl-web && npx tsc --noEmit && npx next lint` / `cd android-mobile && ./gradlew :app:compileDebugKotlin`을 사용자 환경에서 실행해 최종 확인.
=======
**hpoint-mobile(웹):** `npx tsc --noEmit` 통과(에러 0), `eslint`도 이번 변경으로 인한 신규 이슈 없음(기존에 있던 `eqeqeq` 경고 1건은 이번 변경과 무관한 pre-existing 코드). 삭제·변경한 심볼(`callApi`, `requestAuthState`, `authState`, `apiResponse`, `apiUploadProgress`, `nativeApiTransport`, `useAuthStateReceiver`, `setAuthState`, `fallbackMessages.network/timeout/unauthorized`)에 대해 저장소 전체 grep으로 잔여 참조 없음을 확인.

**android-mobile(네이티브):** 이 작업 환경은 네트워크가 막혀 있어 Gradle 배포판을 받지 못해 `./gradlew :app:compileDebugKotlin`을 실행하지 못했다(202/203 때와 동일한 한계). 대신 삭제·변경한 심볼(`callApi`, `requestAuthState`, `authStateJson`, `ApiBridgeHandler`, `apiHandler`)에 대해 저장소 전체 grep으로 잔여 참조가 없음을 확인하고, 수정 파일들을 다시 읽어 문법·타입 시그니처를 수동 대조했다.

**권장 후속:** `cd hpoint-mobile && npx tsc --noEmit && npx next lint` / `cd android-mobile && ./gradlew :app:compileDebugKotlin`을 사용자 환경에서 실행해 최종 확인.
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
