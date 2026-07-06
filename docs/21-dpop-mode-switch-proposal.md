# 21. 웹뷰 DPoP 처리방식 이중화 (.env 전환) — 설계 제안

> ⚠️ **현행화 안내(소스 기준):** 이 문서는 **2-Lite(proof만 네이티브 위임)를 권고**했고, 한때("액세스 토큰을 웹 JS에 두지 않을 것" 요건에 따라) **2-Full(모든 인증 API를 네이티브가 대행)** 로 구현된 적이 있습니다(`docs/work/202`·`203`). 이후 요건이 다시 "proof만 네이티브 위임 + 웹이 서버로 직접 요청"으로 바뀌어 **2-Lite로 재전환해 현재까지 유지 중**입니다(`docs/work/204-DPoP-2Lite-재전환-결과보고서.md`). 실제 구현 기준 최신 문서는 `13-auth-system.md` §9·`14-bridge-guide.md` §9·`15-api-client.md` §1.1입니다. 아래 본문은 2-Lite 최초 검토 당시의 설계 제안이며, 실제 구현은 §4~§5의 `bridge.createDpopProof`/`requestNativeToken` 설계를 그대로 채택했습니다(§5.2의 `tokenReceived` 401 재사용 부분은 §7 대신 `lib/auth/interceptor.ts`에 반영).
>
> 관련: login-server/docs/20100(인증 아키텍처 보안 분석), 13-auth-system, 14-bridge-guide, 15-api-client
> 목표: 웹뷰의 DPoP 처리방식을 `.env.local` 한 줄로 두 모드 중 선택 가능하게 한다.

---

## 1. 요구사항

`.env.local` 설정으로 다음 두 방식을 전환한다.

- **Mode 1 (webview, 현행 유지):** 웹뷰가 DPoP 키 생성·proof 서명·토큰 발급/보관을 모두 자체 처리.
- **Mode 2 (native, 위임):** 웹뷰는 **DPoP proof 생성을 네이티브에 의뢰**하고 네이티브가 만든 proof를 사용한다. **인증 토큰은 네이티브가 관리**한다.

---

## 2. 현행 구조 확인 (요약)

| 레이어 | 핵심 파일 | 현행 동작 |
|---|---|---|
| 웹뷰 | `lib/auth/dpop/proofGenerator.ts` | Web Crypto ES256 키(IndexedDB `hpoint-dpop`, `extractable:false`) 로 `createDPoPProof(url, method)` |
| 웹뷰 | `lib/api/apiClient.ts` `buildHeaders()` | 토큰 있으면 `Authorization: DPoP <token>` + `DPoP: <proof>` 첨부 |
| 웹뷰 | `lib/auth/token/tokenRefresh.ts`, `authService.ts` | 1회용 코드 → `POST /auth/token` 으로 **웹뷰 자체 세션** 발급 |
| 웹뷰 | `lib/auth/interceptor.ts` | 401 시 `window.bridge.requestAuthCode()` → `appAuthCode` 수신 → 재교환 |
| 웹뷰 | `features/auth/hooks/useTokenReceiver.ts` | **이미 존재** — `tokenReceived` 이벤트 수신 시 `useAuthStore.setAuth` |
| 네이티브 | `core/util/DPoPUtil.kt` | Android KeyStore ES256 키(`mobile_dpop_key`, 추출불가) 로 `createDPoPProof(method, url, nonce?)` |
| 네이티브 | `core/network/interceptor/DPoPInterceptor.kt` | 네이티브 자체 API 호출에 DPoP 자동 첨부 |
| 네이티브 | `core/auth/data/TokenStorage.kt` | accessToken(메모리) + refreshToken(EncryptedSharedPreferences) **이미 관리** |
| 네이티브 | `core/bridge/JsBridge.kt` | `@JavascriptInterface` 20종 + `dispatchBridgeEvent` (네이티브→웹) |
| 서버 | `core/dpop.py` `verify_dpop_proof()` | 구조/typ/alg/jwk/서명/htm/htu/iat(±5분)/jti 9단계 검증 |
| 서버 | `core/security.py` | `create_access_token(user)` — JWT, `get_current_user`에서 DPoP 검증 |

### 핵심 발견 — 토큰은 DPoP 키에 바인딩되어 있지 않다

서버 `create_access_token()`은 `sub/email/role/iat/exp/jti`만 담고 **`cnf`(키 지문) 클레임이 없다.** `verify_dpop_proof()`도 **`ath`(액세스 토큰 해시)와 `jkt`(키 thumbprint) 매칭을 검사하지 않는다.** proof는 "유효한 P-256 키로 올바른 htm/htu/iat/jti를 서명했는가"만 본다.

> **결론:** **어느 키로 서명한 proof든 동일한 액세스 토큰에 유효하다.** 따라서 웹 키(Mode 1)와 네이티브 키(Mode 2)는 서버 관점에서 교환 가능하며, **모드 전환은 순수하게 클라이언트(웹+네이티브)만의 문제다. 서버 변경이 필요 없다.**

---

## 3. Mode 2의 두 변형 — 먼저 결정해야 할 핵심 갈림길

"네이티브 위임"은 강도에 따라 두 가지로 갈린다. 이미 `20100` 문서가 이 둘을 분석했고, **전면 위임(2-Full)은 비권장**, **sign 전용 제한 위임은 권고**로 결론냈다.

### 2-Lite (권장) — proof만 위임 + 토큰은 네이티브가 발급/갱신해 웹에 전달

```
웹뷰: fetch 직접 수행
  Authorization: DPoP <네이티브가 발급/푸시한 토큰>
  DPoP: <네이티브가 서명한 proof>   ← bridge.createDpopProof(method, url)
네이티브: 키 소유·서명 + 토큰 수명주기(발급/갱신) 관리, tokenReceived 로 토큰 푸시
```

- 사용자 요구 문구("proof 생성을 네이티브에 의뢰", "토큰은 네이티브가 관리")에 정확히 부합.
- 20100 §5 권고("KeyStore 연동을 **sign 용도로만 극도로 제한적으로** 추가")와 일치.
- 매 API가 네이티브를 거치지만 **proof 서명은 in-process JNI 호출(네트워크 왕복 아님)**이라 지연이 작다.

### 2-Full (비권장) — 모든 API를 `bridge.callApi()`로 네이티브가 대행

```
웹뷰: bridge.callApi({method, url, body}) → 네이티브가 토큰+proof 붙여 호출 → 응답 전달
```

- 토큰이 JS에 전혀 노출되지 않는 유일한 방식이나, 20100이 적시한 7대 단점:
  Bridge 단일 장애점 / IPC 직렬 지연 / 네이티브-웹뷰 침해 결합 / **임의 JS가 모든 인증 API 호출 가능(callApi 공격면)** / 브라우저 단독 실행 불가 / 앱-웹 버전 결합.

### 비교

| 항목 | Mode 1 (현행) | 2-Lite (권장) | 2-Full |
|---|---|---|---|
| DPoP 키 보안 | Web Crypto(SW) | **KeyStore(HW)** | KeyStore(HW) |
| 토큰의 JS 노출 | 있음(웹뷰 자체 토큰) | 있음(네이티브 토큰 공유) | **없음** |
| XSS 침해 범위 | 웹뷰 세션 한정 | 네이티브 세션까지 확대 | 네이티브 세션까지 확대 |
| API 경로 | 직접 | 직접(서명만 위임) | **전부 Bridge 경유** |
| 브라우저 단독 실행 | 가능 | 가능(자동 폴백) | 불가 |
| Bridge 공격면 | 최소 | proof 서명 1종 추가 | callApi(전 API) |
| 구현량 | — | 작음 | 큼 |

> **권고: 2-Lite.** 이하 설계는 2-Lite 기준이며, 2-Full이 필요하면 별도 검토.

---

## 4. 전환 스위치 설계

### 4.1 환경변수

```bash
# .env.local
# webview = Mode 1 (기본, 현행) | native = Mode 2 (proof 위임 + 네이티브 토큰)
NEXT_PUBLIC_DPOP_MODE=webview
```

- 기존 `NEXT_PUBLIC_*` 관례 준수. 미설정 시 `webview`로 폴백(하위호환).
- `NEXT_PUBLIC_*`는 **빌드 타임 인라인**이다. 모드를 바꾸려면 `.env.local` 수정 후 재빌드. (요구사항 "`.env.local` 설정으로"에 부합.)
- **안전장치:** `native`라도 `isWebView()===false`(일반 브라우저·`window.bridge` 없음)이면 자동으로 `webview` 모드로 폴백한다. → 20100 단점 6(브라우저 단독 실행 불가) 회피.

```ts
// lib/auth/dpop/mode.ts (신규, 단일 판단 지점)
import { isWebView } from '@/lib/bridge/bridgeClient';
export type DpopMode = 'webview' | 'native';
export function resolveDpopMode(): DpopMode {
  const want = process.env.NEXT_PUBLIC_DPOP_MODE === 'native' ? 'native' : 'webview';
  return want === 'native' && isWebView() ? 'native' : 'webview';
}
```

### 4.2 추상화 — proof/토큰 공급자

현행은 `buildHeaders()`가 `createDPoPProof`를 직접 부르고, 토큰은 `configureApiClient({getToken})`로 주입된다. 이 **기존 주입 지점을 그대로 활용**해 모드별 구현만 갈아끼운다. (lib 순수성·의존성 역전 규칙 유지.)

```ts
// lib/auth/dpop/proofProvider.ts (신규)
export interface ProofProvider {
  getProof(absoluteUrl: string, method: string): Promise<string>;
}
// Mode 1: 기존 createDPoPProof 그대로
// Mode 2: window.bridge.createDpopProof(method, absoluteUrl) 호출
```

---

## 5. 레이어별 변경 (2-Lite)

### 5.1 웹뷰 (hpoint-mobile)

1. **신규 `lib/auth/dpop/mode.ts`** — `resolveDpopMode()` (위).
2. **신규 `lib/auth/dpop/proofProvider.ts`** — `webviewProofProvider`(기존 `createDPoPProof` 래핑) / `nativeProofProvider`(브릿지 호출). 동기 브릿지 반환을 `Promise.resolve()`로 감싼다.
3. **`lib/api/apiClient.ts` `buildHeaders()`** — `createDPoPProof(...)` 직접호출을 주입된 `proofProvider.getProof(url, method)`로 교체. (변경 1줄 + 주입 필드 추가.)
4. **`lib/auth/interceptor.ts`** — 401 처리에서 모드 분기.
   - webview: 현행 `requestAuthCode` → `/auth/token` 재교환 유지.
   - native: 새 액션 `requestNativeToken()` 호출 → 네이티브가 자기 세션 갱신 후 `tokenReceived` 푸시 → 그 토큰으로 재시도. (웹은 `/auth/token`·`/auth/refresh`를 직접 호출하지 않음.)
5. **부트스트랩** — native 모드 진입 시 `useTokenReceiver`(이미 존재)로 초기 토큰 수신. 최초 진입 트리거로 `requestNativeToken()` 1회 호출 추가.
6. **주입 배선** `features/auth/hooks/useAuthInterceptor.ts` — `resolveDpopMode()`로 `getToken`/`onUnauthorized`/`proofProvider` 세트를 선택해 `configureApiClient`에 전달.
7. native 모드에서는 **Web Crypto 키를 생성·사용하지 않는다**(IndexedDB 키 불필요).

> 토큰 보관처는 두 모드 모두 `useAuthStore._accessToken`(메모리)로 일원화 → `buildHeaders`의 `getToken`은 그대로. 차이는 "그 토큰을 누가 채우는가"뿐(Mode1=웹 교환, Mode2=네이티브 푸시).

### 5.2 네이티브 (android-mobile) — 브릿지 2종 추가

`core/bridge/JsBridge.kt`에 `@JavascriptInterface` 추가, 핸들러는 기존 컴포넌트 재사용.

```kotlin
// 1) proof 서명 위임 — 동기 String 반환 (DPoPUtil 재사용)
@JavascriptInterface
fun createDpopProof(method: String, url: String): String? =
    dpopUtil.createDPoPProof(method, url)   // 키 없으면 null

// 2) 토큰 공급/갱신 — 네이티브 세션 보장 후 tokenReceived 푸시
@JavascriptInterface
fun requestNativeToken() = authHandler.provideNativeToken(::dispatchBridgeEvent)
//   provideNativeToken: TokenStorage.accessToken 유효성 확인(필요시 AuthRepository.refreshToken())
//   → dispatchBridgeEvent("tokenReceived", {access_token, user})
```

- `@JavascriptInterface`는 **String 동기 반환이 가능**하므로 `createDpopProof`는 이벤트 왕복 없이 즉시 값 반환. (KeyStore EC 서명 ~수 ms, UI 차단 없음.)
- `tokenReceived`는 이미 `BridgeEventName`/`ALLOWED_EVENTS` 화이트리스트에 등록됨 → 수신측 무변경.
- `DPoPUtil`을 `JsBridge`에 주입(현재 미주입). htu 정규화는 양측 모두 `?` 제거 + 서버 `rstrip('/')`로 일치.

### 5.3 서버 (login-server) — 변경 없음

토큰이 키에 바인딩되지 않으므로(§2) 네이티브 키 proof가 그대로 통과. **무변경.**

> (선택·별개 과제) 보안을 더 높이려면 `cnf.jkt` 바인딩 + proof `ath` 검증을 도입할 수 있으나, 이는 두 모드 **모두** 키 일관성을 강제하게 되어 전환 설계와 독립적으로 다뤄야 한다. 본 제안 범위 밖.

### 5.4 타입

`types/bridge.ts`의 `NativeBridge`에 `createDpopProof(method, url): string` / `requestNativeToken(): void` 추가.

---

## 6. 주의점 / 리스크

1. **htu 문자열 정합:** Mode 2에서 브릿지에 넘기는 url은 서버가 보는 것과 동일한 **절대 URL**(`${baseUrl}${path}`, 쿼리 제외)이어야 한다. `buildHeaders`가 이미 `${baseUrl}${url}`를 구성하므로 그대로 전달.
2. **토큰의 JS 노출(2-Lite 본질적 한계):** 네이티브 토큰이 웹뷰 메모리에 들어온다 → XSS 시 네이티브 세션 영향(20100 단점 3). 단 토큰은 키 비바인딩이라 Mode 1의 웹뷰 토큰과 노출 수준은 유사. 토큰을 JS에 절대 두지 않으려면 2-Full 필요.
3. **빌드 타임 고정:** `NEXT_PUBLIC_*`는 빌드시 고정. 런타임 동적 전환이 필요하면 별도 설정 채널 필요(요구사항 밖).
4. **nonce 미구현:** 서버는 아직 nonce 미사용. 향후 도입 시 `createDpopProof(method, url, nonce?)`로 확장(네이티브 `DPoPUtil`은 이미 nonce 인자 지원).
5. **iat 시계:** 네이티브 기기 시각 기준 ±5분. 기존 네이티브 자체 호출과 동일 제약이라 신규 위험 없음.

---

## 7. 구현 단계 + 검증 (CLAUDE.md §4 목표중심)

```
1. 네이티브 createDpopProof/requestNativeToken 추가
   → 검증: 웹뷰 콘솔에서 bridge.createDpopProof('GET', url) 가 3파트 JWT 반환,
            서버 verify_dpop_proof 통과(200)
2. 웹 proofProvider + mode 추상화, buildHeaders 분기
   → 검증: NEXT_PUBLIC_DPOP_MODE=native 빌드에서 DPoP 헤더가 네이티브 서명 proof로 나가고 API 200
3. 401 흐름 분기(requestNativeToken 재발급)
   → 검증: /auth/test-401 호출 시 네이티브 토큰 재수신 후 재시도 성공
4. 브라우저 폴백
   → 검증: window.bridge 없는 브라우저에서 native 설정이어도 webview 모드로 동작
5. Mode 1 회귀
   → 검증: NEXT_PUBLIC_DPOP_MODE=webview(기본)에서 기존 동작 무변화
```

---

## 8. 요약

- **서버 무변경.** 토큰이 DPoP 키에 바인딩되지 않아 웹/네이티브 키가 교환 가능.
- **권장은 2-Lite**(proof만 네이티브 위임 + 네이티브가 토큰 발급/갱신해 푸시). 사용자 요구·20100 권고에 부합.
- 전환은 `NEXT_PUBLIC_DPOP_MODE` + 기존 주입 지점(`configureApiClient`, 인터셉터, `useTokenReceiver`) 재사용으로 **소규모 변경**. 네이티브는 브릿지 메서드 2종 추가.
- 2-Full(전 API `callApi` 대행)은 토큰 비노출 이점이 있으나 20100의 7대 단점 → 명시적 요구 시에만.
