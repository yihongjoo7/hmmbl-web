# 202. 웹뷰 DPoP 네이티브 전면 위임 (2-Full) — 작업 설계서

<<<<<<< HEAD
> ⚠️ **이력 안내:** 이 설계(2-Full)는 203에서 실제 구현되었으나, 이후 요건이 "proof만 네이티브 위임 + 웹이 서버로 직접 요청"(2-Lite)으로 다시 바뀌어 **204에서 되돌려졌습니다.** 현재 구현 기준 문서는 `05-auth-system.md` 9장입니다. 이 문서는 2-Full 채택 당시의 설계 기록으로 보존합니다.  
>
> 상태: 설계(구현 전) / 작성 기준: **소스 코드 직접 분석** (docs/20100 등 기존 문서는 현행화 안 됨 → 미참조)  
> 목표 요건(고객·심사): **"DPoP는 네이티브가 처리한다 + 액세스 토큰을 웹(JS) 계층에 두지 않는다"**  
> 결론: 웹뷰의 모든 인증 API 호출을 네이티브에 위임(2-Full). `.env.local` 로 기존 자체처리(Mode 1)와 전환.  
> 변경이력: v2 — 소스 재대조로 누락 15건(G1–G15) 반영(14장 추적표). 해당 절에 통합.  
> v3 — 11장 검증계획 보강(N1–N15: 동시성·수명주기·봉투/쿼리 정합·에러매핑·감사종합·검증수단·순서/롤백·기기매트릭스).  
> v4 — 타 절 구현수준 보강(5.4절 transport 계약, 6.5절 파일/함수 인벤토리, 8장 업로드 계약, 9장 시퀀스, 12장 권장기본값) + 15장 구현 충분성·범위경계 추가.  
> v5 — A1/A3/B1/B2 결정 확정 반영(4장 게이팅·5.2절 에러매핑표·7장 헤더·12장 확정·15장 해소).  
> v6 — 오해 소지 보강: Rules of Hooks 패턴(6.1-5절/6.5절), native 401 우회 명시(6.1-3절), 업로드 진행률 배선(6.1-4절/5.4절), ApiBridgeHandler 예외매핑·멀티파트(6.2-2절), authState dispatch 지점·appForeground 트리거(6.2-3절).  
> v7 — **16장 구현 코드 계약(복붙 기준)** 추가: 분기 지점 정정(verb 레벨), 레이어 규칙(주입 onClearAuth), 401/transportError 처리, 토큰 로그 redact, validator·CSP·errorMessages 스켈레톤. 목표=문서만으로 버그 없이 구현.
=======
> ⚠️ **이력 안내:** 이 설계(2-Full)는 203에서 실제 구현되었으나, 이후 요건이 "proof만 네이티브 위임 + 웹이 서버로 직접 요청"(2-Lite)으로 다시 바뀌어 **204에서 되돌려졌습니다.** 현재 구현 기준 문서는 `13-auth-system.md` §9입니다. 이 문서는 2-Full 채택 당시의 설계 기록으로 보존합니다.
>
> 상태: 설계(구현 전) / 작성 기준: **소스 코드 직접 분석** (docs/20100 등 기존 문서는 현행화 안 됨 → 미참조)
> 목표 요건(고객·심사): **"DPoP는 네이티브가 처리한다 + 액세스 토큰을 웹(JS) 계층에 두지 않는다"**
> 결론: 웹뷰의 모든 인증 API 호출을 네이티브에 위임(2-Full). `.env.local` 로 기존 자체처리(Mode 1)와 전환.
> 변경이력: v2 — 소스 재대조로 누락 15건(G1–G15) 반영(§14 추적표). 해당 절에 통합.
> v3 — §11 검증계획 보강(N1–N15: 동시성·수명주기·봉투/쿼리 정합·에러매핑·감사종합·검증수단·순서/롤백·기기매트릭스).
> v4 — 타 절 구현수준 보강(§5.4 transport 계약, §6.5 파일/함수 인벤토리, §8 업로드 계약, §9 시퀀스, §12 권장기본값) + §15 구현 충분성·범위경계 추가.
> v5 — A1/A3/B1/B2 결정 확정 반영(§4 게이팅·§5.2 에러매핑표·§7 헤더·§12 확정·§15 해소).
> v6 — 오해 소지 보강: Rules of Hooks 패턴(§6.1-5/§6.5), native 401 우회 명시(§6.1-3), 업로드 진행률 배선(§6.1-4/§5.4), ApiBridgeHandler 예외매핑·멀티파트(§6.2-2), authState dispatch 지점·appForeground 트리거(§6.2-3).
> v7 — **§16 구현 코드 계약(복붙 기준)** 추가: 분기 지점 정정(verb 레벨), 레이어 규칙(주입 onClearAuth), 401/transportError 처리, 토큰 로그 redact, validator·CSP·errorMessages 스켈레톤. 목표=문서만으로 버그 없이 구현.
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda

---

## 1. 요건과 설계 결정

| 요건 | 충족 방식 |
|---|---|
| DPoP 키·서명이 네이티브 하드웨어에 있을 것 | 네이티브 `DPoPUtil`(Android KeyStore, 추출불가)만 사용 |
| **액세스 토큰이 웹 JS에 존재하지 않을 것** | 웹은 토큰을 받지도 보관하지도 않음. 네이티브가 보관·첨부 |
| 인증된 API 호출을 웹이 직접 수행하지 않을 것 | 웹은 논리적 요청만 브릿지로 전달, **HTTP 전송은 네이티브** |

→ "토큰 JS 미노출"은 **proof만 위임(2-Lite)으로는 불가**(2-Lite는 토큰이 JS에 있음). **전 인증요청을 네이티브가 대행하는 2-Full만 요건을 충족**한다.

부수 효과(감사 우호적): 네이티브가 **서명자이자 송신자**가 되어 RFC 9449의 "요청자 = 키 소유자" 의미가 **복원**된다.

---

## 2. 현행 소스 사실관계 (검증 완료)

설계 전제. 모두 실제 소스에서 확인.

<<<<<<< HEAD
**웹뷰 (hmmbl-web)**
=======
**웹뷰 (hpoint-mobile)**
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
- 인증 송신구는 **두 곳뿐**: `lib/api/apiClient.ts`(get/post/put/delete), `lib/api/fileUploadClient.ts`(uploadFile). 둘 다 `_getToken()`+`createDPoPProof()` 첨부, `useAuthInterceptor.ts` **단일 지점**에서 DI.
- 토큰 생성 부트스트랩(웹에 토큰을 들이는 실경로): `app/(protected)/layout.tsx`(`requestAuthCode→initAuthFromCode→setAuth`). 그 외 `simple-auth`·`file-upload-test`의 requestAuthCode 는 **주석**, `/api/auth/route.ts` 는 **빈 스텁** — 활성 경로 아님.
- 통합 마운트 지점 **`app/WebviewLayoutClient.tsx`**: `useAuthInterceptor()` + `useKeyRotation()` + `useTokenReceiver()` 를 함께 마운트.
  - `useKeyRotation`(`features/auth/hooks/useKeyRotation.ts`) → `keyRotation` 이벤트 → `rotateDPoPKey()`(`lib/auth/dpop/keyRotation.ts`, **웹 IndexedDB 키** 교체).
  - `useTokenReceiver` → `tokenReceived` 이벤트 → `setAuth(user, access_token)` (**토큰을 JS로 들임**).
- 웹발 로그아웃 `features/auth/hooks/useAuth.ts::logout` = `authApi.logout()`(→`apiClient.post('/auth/logout')`) + `window.bridge.logout()` + `deleteDPoPKeyPair()` + `clearAuth()` + redirect.
- 인증상태 store `features/auth/hooks/useAuthStore.ts::setAuth(user, accessToken)` — **토큰 인자 필수**(현재 토큰 없이 user만 세팅 불가).
- 버전 게이팅 도구 **존재**: `lib/bridge/appVersion.ts::isVersionAtLeast(min)`.
- 엣지 `middleware.ts`: 비-dev UA 게이트(`HPointApp`), CSP `connect-src 'self' <NEXT_PUBLIC_API_BASE_URL>` — **웹의 API 직접연결 허용 중**. matcher 는 `/api` 제외.
- Next 내부 라우트(동일 오리진, 로그인서버 아님): `/api/messages`·`/api/translate`·`/api/native-strings`(+`/api/auth` 스텁). 사용자 토큰 무관.
- 비이슈(확인): SSE/WebSocket 없음, 웹 JWT 디코드 없음, 인증 바이너리 GET(blob/arrayBuffer) 없음.

**네이티브 (android-mobile)**
- `core/network/ApiClient.kt::okHttpClient` — `DPoPInterceptor`+`AuthInterceptor`(401 갱신)+`TokenCookieJar` 완비. **인증 HTTP 스택 완비.**
  - ⚠️ `HttpLoggingInterceptor.Level.BODY` **무조건 ON**(env 게이팅 없음) → 요청/응답 본문·Authorization 로깅.
- `core/util/DPoPUtil.kt`(KeyStore `mobile_dpop_key`), `core/auth/data/TokenStorage.kt`(accessToken 메모리 + refreshToken EncryptedSharedPreferences).
- `core/bridge/JsBridge.kt` — `@JavascriptInterface` + `dispatchBridgeEvent(event, payloadJson)`. 현재 emit 이벤트에 `appForeground` 포함(웹 allowlist 엔 미등록 — 기존 편차).

**서버 (login-server)** — `verify_dpop_proof`(htm/htu/iat±5분/jti). `create_access_token` 에 `cnf` 없음, verify 에 `ath`/`jkt` 매칭 없음 → **토큰 키-미바인딩**. 네이티브 키 proof + 네이티브 토큰 조합이 그대로 통과. **서버 변경 불필요.**

---

## 3. 목표 아키텍처 (2-Full)

```
[Mode 1: webview (현행, 기본)]
  웹뷰 JS ──(DPoP proof 자체생성 + 토큰 자체보관)──▶ login-server

[Mode 2: native (요건 충족)]
  웹뷰 JS ──bridge.callApi({reqId,method,path,headers,body})──▶ 네이티브
                                                                 │ ApiClient.okHttpClient
                                                                 │  + DPoPInterceptor(KeyStore 서명)
                                                                 │  + AuthInterceptor(토큰 첨부·401 갱신)
                                                                 ▼
                                                            login-server
  웹뷰 JS ◀──onBridgeEvent("apiResponse",{reqId,status,body})── 네이티브
```

웹은 토큰·DPoP 키·proof를 일절 보유하지 않는다. 인증 상태(로그인 여부·사용자 프로필)만 별도로 수신해 UI/라우팅에 사용한다.

---

## 4. 전환 스위치 (.env) + 능력 게이팅 (G1)

```bash
# .env.local
# webview = Mode 1 (기본) | native = Mode 2 (전면 위임)
NEXT_PUBLIC_DPOP_MODE=webview
```

```ts
// lib/auth/dpop/mode.ts (신규)
import { isWebView } from '@/lib/bridge/bridgeClient';
export type DpopMode = 'webview' | 'native';
export function resolveDpopMode(): DpopMode {
  const want = process.env.NEXT_PUBLIC_DPOP_MODE === 'native' ? 'native' : 'webview';
  if (want !== 'native') return 'webview';
  // (G1) 브릿지·callApi 능력 미보유(브라우저/구버전 네이티브)면 native 불가
  if (!isWebView() || typeof window.bridge?.callApi !== 'function') return 'webview';
  return 'native';
}
```

- **(G1) 배포 호환 — 확정:** 네이티브 callApi 도입 버전 **`1.0.0`**, **과거 배포 앱 없음(그린필드)**. 따라서 `isVersionAtLeast('1.0.0')` 는 사실상 항상 참이고 **실제 가드는 능력 체크 `typeof window.bridge.callApi`** 다(모든 네이티브 빌드가 callApi 포함 → 프로덕션 항상 통과). 비정상으로 callApi 부재 시 **차단+업데이트 안내**(감사 빌드: 조용한 webview 폴백 **금지** — 토큰 JS 유입 방지).
- `NEXT_PUBLIC_*` 는 빌드 타임 인라인. 환경 매트릭스: 감사/배포 = `native`, 개발/브라우저 = `webview`.

---

## 5. 브릿지 RPC 프로토콜 (신규)

기존 `waitFor('eventName')` 는 동명 이벤트 첫 건만 resolve → 동시 다발 부적합. **requestId 상관관계** 도입.

### 5.1 요청 (웹 → 네이티브: `bridge.callApi(JSON.stringify(req))`, 반환 void)
```ts
interface NativeApiRequest {
  requestId: string;                 // crypto.randomUUID()
  method: 'GET'|'POST'|'PUT'|'DELETE';
  path: string;                      // (G11) baseUrl 제외, 쿼리스트링 포함 완성 경로. 절대 URL 금지
<<<<<<< HEAD
  headers?: Record<string,string>;   // (7장) 화이트리스트만. Authorization/DPoP/Cookie 금지
=======
  headers?: Record<string,string>;   // (§7) 화이트리스트만. Authorization/DPoP/Cookie 금지
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
  body?: string | null;              // JSON 문자열
  upload?: { fileBase64: string; fileName: string; mimeType: string; field?: string };
}
```
- **(G11)** 쿼리스트링은 웹의 기존 `apiClient.get` 직렬화(배열 반복 파라미터 포함)를 재사용해 `path` 에 완성해 전달 — 네이티브 재구현 금지.

### 5.2 응답 (네이티브 → 웹: `apiResponse` 이벤트)
```ts
interface NativeApiResponse {
  requestId: string;
  ok: boolean;                       // 2xx
  status: number;
  bodyText: string;                  // 원문 (빈 문자열 가능)
  isEmpty?: boolean;                 // (G9) 204/빈 본문 표식
  transportError?:                   // (G8) HTTP 이전 단계 실패
    'TIMEOUT'|'OFFLINE'|'NATIVE_ERROR'|'NOT_AUTHENTICATED';
}
```
- **(G9) 봉투 정합:** 웹은 `new Response(bodyText,{status})` 로 정규화해 기존 `!ok→toApiError`(서버 `detail{code,message,fields}` 보존)·`json()` 후처리를 **그대로 재사용**. 204/빈 본문은 `isEmpty` 로 판정(현행 `content-length` 분기 대체).
- **(G8) 에러 매핑 — 확정:** `transportError` → `ApiError` 변환. **모든 에러는 토스트**(단 폼 필드검증은 인라인).

| transportError | ApiError(status, code) | 메시지(신규) | 표시 | 추가 동작 |
|---|---|---|---|---|
| OFFLINE | (0, `NETWORK_ERROR`) | "네트워크 연결을 확인해 주세요." | 토스트 | — |
| TIMEOUT | (0, `TIMEOUT`) | "요청 시간이 초과되었습니다." | 토스트 | — |
| NATIVE_ERROR | (0, `BRIDGE_ERROR`) | `errorMessages.unknown` 재사용 | 토스트 | — |
| NOT_AUTHENTICATED | (401, `UNAUTHORIZED`) | "다시 로그인해 주세요." | 토스트 | **로그인 이동**(`authState{false}`→`clearAuth`→리다이렉트) |

  - HTTP 에러는 기존 `toApiError` 재사용(토스트). **단 `ApiError.fields` 존재 시 인라인**(폼 처리) — 전역 토스트 핸들러는 `fields` 있으면 토스트 생략. 동일 에러 토스트 **dedupe**. `errorMessages` 에 `network`/`timeout`/`unauthorized` 추가.
- 선택 이벤트 `apiUploadProgress { requestId, percent }`.

### 5.3 상관관계 / 동시성 / 한계
- 웹 `lib/bridge/nativeApiTransport.ts`(신규): `Map<requestId,{resolve,reject,timer}>`. `apiResponse` 를 `requestId` 로 라우팅, 미존재 id drop, 요청별 타임아웃(기본 30s·업로드 120s).
- 신규 이벤트(`apiResponse`,`apiUploadProgress`,`authState`)를 `bridgeClient.ts` `ALLOWED_EVENTS`+`EVENT_VALIDATORS` 에 등록.
- **(G13) 페이로드 크기:** 응답은 `evaluateJavascript` 문자열로 주입되므로 대용량 JSON(대형 목록)은 성능/한계 우려 — 서버 페이지네이션 준수, 과대 응답 회피.
<<<<<<< HEAD
- **(G14) 무결성:** 인페이지 JS가 `window.onBridgeEvent('apiResponse',…)` 를 직접 호출해 대기 요청을 위조 resolve 가능(동일오리진 신뢰의 본질적 한계). requestId 는 추측 불가(UUID), 신뢰 오리진 로드·CSP(7장) 전제. 잔여 위험 명시.
=======
- **(G14) 무결성:** 인페이지 JS가 `window.onBridgeEvent('apiResponse',…)` 를 직접 호출해 대기 요청을 위조 resolve 가능(동일오리진 신뢰의 본질적 한계). requestId 는 추측 불가(UUID), 신뢰 오리진 로드·CSP(§7) 전제. 잔여 위험 명시.
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda

### 5.4 구현 계약 (스켈레톤)

```ts
// lib/bridge/nativeApiTransport.ts (신규)
type Pending = { resolve:(r:NativeApiResponse)=>void; reject:(e:unknown)=>void; timer:ReturnType<typeof setTimeout> };
const pending = new Map<string, Pending>();
let wired = false;
function wireOnce(): void {
  if (wired) return; wired = true;
  bridgeEventBus.on<NativeApiResponse>('apiResponse', (r) => {
    const p = pending.get(r.requestId); if (!p) return;       // 미존재 id → drop
    pending.delete(r.requestId); clearTimeout(p.timer); p.resolve(r);  // at-most-once
  });
}
export function callViaNative(
  req: Omit<NativeApiRequest,'requestId'>, timeoutMs = 30_000,
): Promise<NativeApiResponse> {
  wireOnce();
  const requestId = crypto.randomUUID();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {                          // (N2) detach/유실 정리
      pending.delete(requestId);
      reject(new ApiError(0, 'TIMEOUT', '요청 시간 초과'));
    }, timeoutMs);
    pending.set(requestId, { resolve, reject, timer });
    window.bridge!.callApi(JSON.stringify({ requestId, ...req }));
  });
}
```

- 의미 보장: **at-most-once**(Map 삭제 후 resolve), **순서 무관**(id 매칭), detach 유실은 timer 가 정리(N2). 업로드는 `timeoutMs=120_000`. **`apiUploadProgress` 는 `callViaNative` 와 별개 채널** — 호출 측이 `requestId` 로 구독해 진행률 콜백을 받고, 완료/실패 시 구독 해제(누수 방지).

```kotlin
// ApiBridgeHandler 입출력 계약 (Kotlin)
data class CallApiReq(
  val requestId:String, val method:String, val path:String,
  val headers:Map<String,String>?, val body:String?, val upload:UploadPart?,
)
data class UploadPart(val fileBase64:String, val fileName:String, val mimeType:String, val field:String = "file")
// 응답: JSONObject { requestId, ok, status, bodyText, isEmpty?, transportError? }
//        → dispatchBridgeEvent("apiResponse", json)
```

---

## 6. 레이어별 변경 설계

<<<<<<< HEAD
### 6.1 웹뷰 (hmmbl-web) — 공개 API 불변, transport·배선만 분기
1. **신규 `lib/auth/dpop/mode.ts`** (4장, 능력 게이팅 포함).
2. **신규 `lib/bridge/nativeApiTransport.ts`** — `callViaNative(req): Promise<NativeApiResponse>`.
3. **`lib/api/apiClient.ts`** — 모드 분기는 **verb(get/post/put/delete) 레벨**에서 한다(⚠️ `withRefresh(url,method,fn)` 는 바디를 클로저 `fn` 안에 갖고 있어 그 안에서 분기 불가 — `withRefresh` 는 webview 전용으로 둔다). native → `nativeRequest(method, path, body)` → `Response` 정규화 → 기존 후처리 재사용. get/post/put/delete **시그니처·반환·throw 불변** → 호출부 변경 0. **native 분기는 웹 401 재시도(`_onUnauthorized`/`withRefresh` 루프)를 타지 않는다**(네이티브 `AuthInterceptor` 가 이미 갱신·재시도; 최종 401·`NOT_AUTHENTICATED` → `_onClearAuth` + `UNAUTHORIZED`, 5.2절). **상세 스켈레톤 16.1절.**
4. **`lib/api/fileUploadClient.ts`** — native: `File`→base64 → `callViaNative({upload}, 120_000)`. **진행률 배선:** 요청 직전 `apiUploadProgress` 를 `requestId` 로 구독해 `onProgress(percent)` 호출, `apiResponse`(완료) 또는 타임아웃 시 구독 해제(누수 주의). `validateFile` 선검증(8장)으로 상한 초과는 base64 전에 거부.
5. **(G6) 통합 마운트 `app/WebviewLayoutClient.tsx` 분기** — `resolveDpopMode()` 기준.
   **⚠️ Rules of Hooks 준수:** 훅을 조건부로 호출하지 말 것(`if (mode) useX()` 금지 — 렌더마다 훅 호출 수가 달라지면 React 에러). `WebviewLayoutClient` 의 **호출부는 그대로**(네 훅 모두 무조건 호출)두고, **분기는 각 훅 내부에서 `resolveDpopMode()` early-return** 으로 처리한다. (대안: webview/native 별 자식 컴포넌트를 분리해 각기 다른 훅셋을 마운트.)
   - `useAuthInterceptor`: native 모드면 내부에서 credential 주입 없이 return(transport 분기 전담).
   - **(G4) `useKeyRotation`**: native 모드면 내부 early-return(웹 키 없음 → `rotateDPoPKey` 무의미). 로테이션은 네이티브 KeyStore 책임(6.2절).
=======
### 6.1 웹뷰 (hpoint-mobile) — 공개 API 불변, transport·배선만 분기
1. **신규 `lib/auth/dpop/mode.ts`** (§4, 능력 게이팅 포함).
2. **신규 `lib/bridge/nativeApiTransport.ts`** — `callViaNative(req): Promise<NativeApiResponse>`.
3. **`lib/api/apiClient.ts`** — 모드 분기는 **verb(get/post/put/delete) 레벨**에서 한다(⚠️ `withRefresh(url,method,fn)` 는 바디를 클로저 `fn` 안에 갖고 있어 그 안에서 분기 불가 — `withRefresh` 는 webview 전용으로 둔다). native → `nativeRequest(method, path, body)` → `Response` 정규화 → 기존 후처리 재사용. get/post/put/delete **시그니처·반환·throw 불변** → 호출부 변경 0. **native 분기는 웹 401 재시도(`_onUnauthorized`/`withRefresh` 루프)를 타지 않는다**(네이티브 `AuthInterceptor` 가 이미 갱신·재시도; 최종 401·`NOT_AUTHENTICATED` → `_onClearAuth` + `UNAUTHORIZED`, §5.2). **상세 스켈레톤 §16.1.**
4. **`lib/api/fileUploadClient.ts`** — native: `File`→base64 → `callViaNative({upload}, 120_000)`. **진행률 배선:** 요청 직전 `apiUploadProgress` 를 `requestId` 로 구독해 `onProgress(percent)` 호출, `apiResponse`(완료) 또는 타임아웃 시 구독 해제(누수 주의). `validateFile` 선검증(§8)으로 상한 초과는 base64 전에 거부.
5. **(G6) 통합 마운트 `app/WebviewLayoutClient.tsx` 분기** — `resolveDpopMode()` 기준.
   **⚠️ Rules of Hooks 준수:** 훅을 조건부로 호출하지 말 것(`if (mode) useX()` 금지 — 렌더마다 훅 호출 수가 달라지면 React 에러). `WebviewLayoutClient` 의 **호출부는 그대로**(네 훅 모두 무조건 호출)두고, **분기는 각 훅 내부에서 `resolveDpopMode()` early-return** 으로 처리한다. (대안: webview/native 별 자식 컴포넌트를 분리해 각기 다른 훅셋을 마운트.)
   - `useAuthInterceptor`: native 모드면 내부에서 credential 주입 없이 return(transport 분기 전담).
   - **(G4) `useKeyRotation`**: native 모드면 내부 early-return(웹 키 없음 → `rotateDPoPKey` 무의미). 로테이션은 네이티브 KeyStore 책임(§6.2).
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
   - **(G6) 토큰→상태 수신 교체**: `useTokenReceiver` 는 native 모드면 내부 early-return(토큰 JS 유입 차단). 신규 `useAuthStateReceiver` 는 **항상 호출**하되 webview 모드면 내부 return(`authState` 수신·토큰 미포함).
6. **(G7) 인증상태 store/수신** — `useAuthStore` 에 **토큰 없이 `{user,isAuthenticated}` 만** 세팅하는 액션 추가(`setAuthState`). native 모드 `_accessToken` 은 항상 null. 신규 `useAuthStateReceiver` 가 이를 호출. 초기 유실 방지를 위해 마운트 시 `bridge.requestAuthState()` 로 **당겨오기**(push-only 레이스 차단).
7. **(G6/부트스트랩) `app/(protected)/layout.tsx` 분기(필수)** — 현행은 미인증 시 `requestAuthCode→initAuthFromCode→setAuth(user, accessToken)` 로 **토큰을 JS에 생성**(요건 위반). native 모드는 이 경로를 호출하지 않고 `authState` 수신만으로 `isAuthenticated` 판정. webview 모드 현행 유지.
8. **(G5) 웹발 로그아웃 `useAuth.ts::logout` 분기** — native 모드 권위 경로는 **`window.bridge.logout()`**(네이티브 세션·키 정리). `authApi.logout()`(callApi 위임)은 네이티브 쿠키로 서버 세션 revoke가 이미 `bridge.logout` 내부에서 처리되므로 **중복 호출 제거**, `deleteDPoPKeyPair()`(웹 키)는 native 모드 **불필요**(no-op). 최종 `clearAuth`/redirect 는 공통.
9. **(G10) Next 내부 `/api/*` 경계** — `/api/messages`·`/api/translate`·`/api/native-strings` 는 동일 오리진·비인증 → **위임 대상 아님**, 그대로 웹 fetch 유지. callApi 는 **로그인서버(API_BASE_URL) 호출만** 대행.
10. native 모드에서 Web Crypto 키 생성/`createDPoPProof`/`/auth/token` 교환 미호출.

### 6.2 네이티브 (android-mobile) — okHttpClient 재사용
1. **`JsBridge.callApi(requestJson: String)`**(void) → `ApiBridgeHandler` 위임, IO 코루틴 처리 후 `dispatchBridgeEvent("apiResponse", ...)`.
<<<<<<< HEAD
2. **신규 `core/bridge/handler/ApiBridgeHandler.kt`** — 파싱 → **검증(7장)** → `API_BASE_URL` 결합 → `okhttp3.Request`(body=JSON `RequestBody`, **화이트리스트 헤더만**) → `apiClient.okHttpClient.newCall(req).execute()`(DPoP·Auth·401 자동) → `{requestId,ok,status,bodyText,isEmpty}` dispatch.
=======
2. **신규 `core/bridge/handler/ApiBridgeHandler.kt`** — 파싱 → **검증(§7)** → `API_BASE_URL` 결합 → `okhttp3.Request`(body=JSON `RequestBody`, **화이트리스트 헤더만**) → `apiClient.okHttpClient.newCall(req).execute()`(DPoP·Auth·401 자동) → `{requestId,ok,status,bodyText,isEmpty}` dispatch.
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
   - **예외→transportError 매핑(구체):** `SocketTimeoutException`→`TIMEOUT`, 연결 실패 `IOException`(UnknownHost 등)→`OFFLINE`, JSON 파싱/그 외→`NATIVE_ERROR`, 갱신 영구실패(최종 401)→`NOT_AUTHENTICATED`.
   - **업로드:** `MultipartBody.Builder().setType(FORM).addFormDataPart(field, fileName, base64→RequestBody(mimeType))`. 진행률은 `RequestBody` 를 **바이트카운팅 래퍼**로 감싸 누적 percent 를 `apiUploadProgress{requestId,percent}` emit.
3. **인증상태 푸시** — `dispatchBridgeEvent("authState", {user, isAuthenticated})`(토큰 미포함)를 다음 지점에서 emit:
   - `AuthRepository` 의 **로그인/refresh/logout 성공·실패** 직후(세션 변화 시).
   - **웹뷰 attach** 직후(`WebViewConfig.setup`/`JsBridge.attachWebView`).
   - **포그라운드 복귀** — WebView 호스트 Activity(`MainActivity` 등)의 `onResume`(G12, 백그라운드 중 세션 변화 반영).
   - `bridge.requestAuthState()` 호출 시 현재 상태를 동일 형식으로 1회 emit(웹 초기 동기화).
4. **(G2) 로깅 축소(감사 필수)** — `core/network/ApiClient.kt` 의 `HttpLoggingInterceptor.Level.BODY` 를 release/native 빌드에서 **NONE 또는 HEADERS** 로(Authorization/DPoP/본문 logcat 노출 차단). 현재 무조건 BODY.
5. **(G4) DPoP 키 로테이션** — 필요 시 `DPoPUtil` 에 KeyStore 키 재생성 API 추가, 트리거/정책은 네이티브 소유(웹 `keyRotation` 의존 제거). 서버 키-미바인딩이라 로테이션은 클라이언트 로컬 사안.
6. `JsBridge` 생성자에 `ApiClient`(또는 핸들러) 추가.

### 6.3 서버 (login-server) — 변경 없음
- 토큰 키-미바인딩 + 네이티브 동일 호출 기존 동작 → **0 변경**. (감사 로깅(G2)은 클라이언트 사안, 서버 무관.)

### 6.4 타입/프로토콜
- `types/bridge.ts` `NativeBridge`: `callApi(requestJson: string): void`, `requestAuthState(): void` 추가.
- `bridgeProtocol.ts` `BridgeEventName`: `apiResponse`,`apiUploadProgress`,`authState` 추가 + `bridgeClient.ts` allowlist/검증기 등록.

### 6.5 신규 파일 + 변경 함수 인벤토리 (구현 체크리스트)

**신규(웹)**
<<<<<<< HEAD
- `lib/auth/dpop/mode.ts` — `resolveDpopMode()` (4장).
- `lib/bridge/nativeApiTransport.ts` — `callViaNative()` (5.4절).
- `features/auth/hooks/useAuthStateReceiver.ts` — `authState` 구독 + 마운트 시 `window.bridge.requestAuthState()` → `useAuthStore.setAuthState(user)`.

**변경(웹) — 함수 단위**
- `lib/api/apiClient.ts`: **verb(get/post/put/delete) 레벨** `resolveDpopMode()` 분기(16.1절) — native → `nativeRequest()`(→`callViaNative`→`new Response`→`!ok→toApiError`/`json()`/`isEmpty→undefined`, 401→`_onClearAuth`+UNAUTHORIZED), webview → 기존 `withRefresh()`. **시그니처 불변**.
- `lib/api/fileUploadClient.ts` `sendUpload()`: native 분기(File→base64). `uploadFile` **시그니처 불변**.
- `features/auth/hooks/useAuthStore.ts`: `setAuthState(user)` 액션 추가(토큰 미설정, `_accessToken` null 고정).
- `features/auth/hooks/useAuthInterceptor.ts`: native 모드 시 credential 주입 skip.
- `app/WebviewLayoutClient.tsx`: **호출부 불변(네 훅 무조건 호출)** — 모드 분기는 **각 훅 내부 early-return**(6.1-5절, Rules of Hooks). `useAuthStateReceiver` 신규 추가(webview 모드면 내부 no-op).
- `app/(protected)/layout.tsx`: native 부트스트랩 분기(6.1-7절).
- `features/auth/hooks/useAuth.ts` `logout()`: native 분기(6.1-8절).
- `types/bridge.ts`·`lib/bridge/bridgeProtocol.ts`·`lib/bridge/bridgeClient.ts`: 메서드/이벤트/allowlist 등록(6.4절).
=======
- `lib/auth/dpop/mode.ts` — `resolveDpopMode()` (§4).
- `lib/bridge/nativeApiTransport.ts` — `callViaNative()` (§5.4).
- `features/auth/hooks/useAuthStateReceiver.ts` — `authState` 구독 + 마운트 시 `window.bridge.requestAuthState()` → `useAuthStore.setAuthState(user)`.

**변경(웹) — 함수 단위**
- `lib/api/apiClient.ts`: **verb(get/post/put/delete) 레벨** `resolveDpopMode()` 분기(§16.1) — native → `nativeRequest()`(→`callViaNative`→`new Response`→`!ok→toApiError`/`json()`/`isEmpty→undefined`, 401→`_onClearAuth`+UNAUTHORIZED), webview → 기존 `withRefresh()`. **시그니처 불변**.
- `lib/api/fileUploadClient.ts` `sendUpload()`: native 분기(File→base64). `uploadFile` **시그니처 불변**.
- `features/auth/hooks/useAuthStore.ts`: `setAuthState(user)` 액션 추가(토큰 미설정, `_accessToken` null 고정).
- `features/auth/hooks/useAuthInterceptor.ts`: native 모드 시 credential 주입 skip.
- `app/WebviewLayoutClient.tsx`: **호출부 불변(네 훅 무조건 호출)** — 모드 분기는 **각 훅 내부 early-return**(§6.1-5, Rules of Hooks). `useAuthStateReceiver` 신규 추가(webview 모드면 내부 no-op).
- `app/(protected)/layout.tsx`: native 부트스트랩 분기(§6.1-7).
- `features/auth/hooks/useAuth.ts` `logout()`: native 분기(§6.1-8).
- `types/bridge.ts`·`lib/bridge/bridgeProtocol.ts`·`lib/bridge/bridgeClient.ts`: 메서드/이벤트/allowlist 등록(§6.4).
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda

**신규(네이티브)**
- `core/bridge/handler/ApiBridgeHandler.kt` — `callApi(req, dispatch)`: 검증→`okHttpClient` 실행→`apiResponse`; 업로드 `MultipartBody`+진행률.

**변경(네이티브)**
- `core/bridge/JsBridge.kt`: `@JavascriptInterface callApi/requestAuthState` 추가, 생성자에 핸들러 주입.
- `core/network/ApiClient.kt`: 로깅 레벨 빌드 게이팅(G2).
- 인증상태 push 지점(로그인/로그아웃/refresh/`appForeground`)에서 `authState` dispatch.

**서버:** 없음.

> 핵심: 웹 변경은 `apiClient`/`fileUploadClient` **내부 transport 교체**라 **엔드포인트별 마이그레이션이 불필요**(화면/서비스 호출부 0 변경). 작업량은 위 인벤토리로 한정.

---

## 7. 보안 설계 (감사 핵심)

**토큰 비노출 입증** — native 모드 웹 런타임/스토리지에 액세스·refresh 토큰·DPoP 개인키 부재(`_accessToken=null`). 네이티브: 토큰=메모리/EncryptedSharedPreferences, 키=KeyStore(추출불가).

**`callApi` 공격면 봉쇄**
- **Origin/Path 화이트리스트:** 상대경로만 허용, `API_BASE_URL` 로만 결합. 절대 URL·외부 호스트 거부(SSRF·토큰 오용 차단).
- **헤더 화이트리스트 — 확정:** 허용 목록 **사실상 빈 목록**(현행 웹이 로그인서버로 보내는 헤더는 `Content-Type` 하나뿐이고, JSON 시 네이티브가 설정). **네이티브 전담·웹 설정 불가 = `Authorization`·`DPoP`·`Cookie`·`Content-Type`**. 신규 API 가 커스텀 헤더를 요구하면 그때 화이트리스트에 추가.
- **메서드 화이트리스트:** GET/POST/PUT/DELETE.

**(G3) CSP `connect-src` 강화(감사 레버)** — native 모드에선 웹이 API를 부르지 않으므로 `middleware.ts` 의 `connect-src` 에서 **`NEXT_PUBLIC_API_BASE_URL` 제거**(`'self'` 유지). "웹은 백엔드에 닿을 수 없음"을 브라우저 수준에서 강제·입증. 브릿지는 네트워크가 아니라 CSP 무관.

<<<<<<< HEAD
**(G2) 로그 위생** — 네이티브 BODY 로깅 비활성(6.2-4절): 토큰·PII 의 logcat 노출 차단.

**(G14) 브릿지 무결성** — apiResponse 위조 위험(5.3절): 신뢰 오리진 로드(UA 게이트)·CSP·UUID requestId 전제. 잔여 위험은 인-웹뷰 인증의 본질.
=======
**(G2) 로그 위생** — 네이티브 BODY 로깅 비활성(§6.2-4): 토큰·PII 의 logcat 노출 차단.

**(G14) 브릿지 무결성** — apiResponse 위조 위험(§5.3): 신뢰 오리진 로드(UA 게이트)·CSP·UUID requestId 전제. 잔여 위험은 인-웹뷰 인증의 본질.
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda

**RFC 9449 정합:** 서명자=송신자=네이티브 → proof-of-possession 의미 강화.

---

## 8. 바이너리/업로드/다운로드 처리와 한계
- **업로드:** `File`→base64 브릿지 전달(기존 카메라/갤러리 base64 핸드오프와 동일). `validateFile` 10MB 상한 유지 권장. 초과는 거부 또는 (후속) 임시파일 핸드오프.
- **진행률:** `apiUploadProgress`.
- **바이너리 다운로드/미리보기:** 기존 서명 URL + `requestImageDownload`(인증 헤더 없는 downloadClient) 유지 — callApi 대상 아님(callApi 는 JSON 텍스트 전제).
- **(G13)** 대용량 JSON 응답은 브릿지 문자열 한계 고려(페이지네이션).

**업로드 계약(구체)**
- 웹: `validateFile`(10MB·MIME)를 **base64 인코딩 전에 선검증** → 초과 시 callApi 미발생(즉시 거부). 통과분만 `FileReader`→base64 → `callViaNative({upload:{fileBase64,fileName,mimeType,field}}, 120_000)`.
- 네이티브: `MultipartBody.Builder().setType(FORM).addFormDataPart(field, fileName, base64→RequestBody(mimeType))`. 진행률은 RequestBody 를 바이트카운팅 래퍼로 감싸 `apiUploadProgress{requestId,percent}` emit.
<<<<<<< HEAD
- 크기: base64 ~33% 팽창(10MB→~13.3MB 문자열 1회 전달). 그 이상은 거부(현 단계) 또는 후속 `content://` 핸드오프(12-2절).
=======
- 크기: base64 ~33% 팽창(10MB→~13.3MB 문자열 1회 전달). 그 이상은 거부(현 단계) 또는 후속 `content://` 핸드오프(§12-2).
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda

---

## 9. 인증 상태·세션 수명주기
- **부트스트랩:** 웹뷰 attach 시 네이티브 `authState` 푸시 + 웹 `requestAuthState()` 당겨오기(G7 레이스 차단). 미인증이면 callApi 401→네이티브 갱신 시도, 실패 시 네이티브 로그인.
- **(G12) 포그라운드 복귀:** 네이티브 `appForeground` 시 세션이 바뀌었을 수 있어 `authState` 재푸시 → 웹 동기화.
- **401:** 네이티브 `AuthInterceptor` 가 갱신·재시도 후 최종 응답만 전달(웹은 401 로직 미보유).
<<<<<<< HEAD
- **(G5) 로그아웃:** 웹발은 `bridge.logout()` 권위(6.1-8절). 네이티브 세션·키 정리 후 `authState{isAuthenticated:false}` → 웹 `clearAuth`. 갱신 영구 실패 시도 동일 처리.
=======
- **(G5) 로그아웃:** 웹발은 `bridge.logout()` 권위(§6.1-8). 네이티브 세션·키 정리 후 `authState{isAuthenticated:false}` → 웹 `clearAuth`. 갱신 영구 실패 시도 동일 처리.
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda

**시퀀스(요약)**
```
부트스트랩: webview attach ─▶ 네이티브 authState push  ┐
            웹 mount ─▶ requestAuthState ──────────────┘─▶ setAuthState ─▶ 가드 통과 ─▶ 화면 callApi
호출:       화면 ─▶ apiClient ─▶ callViaNative ─▶ callApi ─▶ okHttpClient(DPoP+Auth) ─▶ 서버 ─▶ apiResponse ─▶ 화면
401:        callApi ─▶ (네이티브 AuthInterceptor 갱신·재시도) ─▶ 최종응답 / 영구실패 시 authState{false} push
포그라운드: appForeground ─▶ authState push(재동기화)
로그아웃:   웹 logout() ─▶ bridge.logout() ─▶ 네이티브 revoke+키정리 ─▶ authState{false} ─▶ 웹 clearAuth/redirect
```

---

## 10. native 모드에서 비활성/정리되는 기존 경로
- 비활성(코드 유지, 미호출): `proofGenerator`(웹키)·`authService.initAuthFromCode`·`tokenRefresh.refreshAccessToken`·`interceptor.createAuthInterceptor`·`useTokenReceiver`(토큰 수신)·**`useKeyRotation`/`rotateDPoPKey`(G4)**. webview 모드는 현행 유지.
<<<<<<< HEAD
- 데드/스텁(삭제 말고 메모만, CLAUDE.md 3장): `lib/api/apiClient - 복사본.ts`, **`app/api/auth/route.ts`(빈 스텁, G15)**.
=======
- 데드/스텁(삭제 말고 메모만, CLAUDE.md §3): `lib/api/apiClient - 복사본.ts`, **`app/api/auth/route.ts`(빈 스텁, G15)**.
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
- `app/dev/**` 인증 시나리오는 감사 빌드(native)에서 제외/가드.

---

<<<<<<< HEAD
## 11. 구현 단계 + 검증 (CLAUDE.md 4장 목표중심)
=======
## 11. 구현 단계 + 검증 (CLAUDE.md §4 목표중심)
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda

수단 표기: **자동**=단위/통합(모킹 브릿지, CI) · **기기**=실기기 수기 · **로그**=logcat/서버로그.

### 11.1 단계별 구현·검증

1. **브릿지 프로토콜·이벤트 등록** — `callApi`·`requestAuthState` 메서드 + `apiResponse`·`apiUploadProgress`·`authState` 이벤트(allowlist·validator 등록). 검증: 타입체크·빌드 통과, allowlist 통과. (자동/기기)
2. **네이티브 ApiBridgeHandler** — okHttpClient GET/POST + `transportError` 매핑(G8). 검증: `callApi('GET','/members/me')` 200, 서버로그에 **네이티브 발** Authorization·DPoP 첨부 확인, 오프라인/타임아웃/예외→`OFFLINE`/`TIMEOUT`/`NATIVE_ERROR` 응답. (기기/로그)
3. **웹 nativeApiTransport — 동시성·타임아웃 (N1)** — requestId 상관관계 Map. 검증: 동시 20요청 전부 정확 매칭(교차 resolve 0건), 미응답 시 요청별 타임아웃 reject. (자동)
4. **apiClient/fileUploadClient transport 분기** — 공개 API 불변. 검증: 기존 화면 정상, DevTools 네트워크에 **웹발 인증요청 0건**. (기기)
5. **응답봉투 정합 (N4/G9)·쿼리 직렬화 (N5/G11)** — 검증: 204→`undefined`, 4xx `detail{code,message,fields}` 보존→동일 `ApiError`, 배열 반복 파라미터 GET이 서버에 동일 쿼리로 도달. (자동/로그)
6. **에러 매핑·오프라인 UX (N3/G8)** — 검증: 비행기모드·타임아웃에서 기존 에러 토스트 정상 노출. (기기)
7. **authState 수신·당겨오기·레이스 (N9/G7) + ProtectedLayout 분기 (G6)** — `setAuthState`·`requestAuthState`. 검증: 구독 전 push 시나리오도 `requestAuthState`로 복구, 보호화면이 **토큰 없이** 정상. (자동/기기)
8. **로그아웃 분기 (N10/G5)** — `bridge.logout` 권위. 검증: 서버 세션 revoke(서버로그), 중복 revoke 없음, `deleteDPoPKeyPair` 미호출. (기기/로그)
9. **키 로테이션 native (N6/G4)** — 검증: native 모드 `useKeyRotation` 비활성·**IndexedDB DPoP 키 미생성**, 네이티브 KeyStore 로테이션 후 callApi 정상. (기기/DevTools)
10. **appForeground 재동기화 (N8/G12)** — 검증: 백그라운드→포그라운드 시 `authState` 재푸시·반영(세션 변경 시나리오). (기기)
11. **fileUpload base64·진행률·401·상한 (N11)** — 검증: 업로드·진행률, 업로드 중 401 네이티브 갱신 후 성공, 상한 초과 거부. (기기)
12. **보안 화이트리스트** — 검증: 절대 URL·외부 호스트·`Authorization`/`Cookie` 주입 거부. (자동/기기)
13. **Next `/api/*` 경계 (N7/G10)** — 검증: native 모드에서 `/api/messages`·`/api/translate` 직접 fetch 정상(위임 안 됨), i18n/번역 회귀 없음. (기기)
14. **(G1) 능력 게이팅** — 검증: `callApi` 없는(구버전) 브릿지에서 차단/안내(조용한 webview 폴백 아님). (자동, 모킹 브릿지)
15. **(G2) 로깅 — release/native** — 검증: logcat에 Authorization·본문 미노출. (기기/로그)
16. **(G3) CSP — native 빌드** — 검증: connect-src에 API 오리진 없음, 웹 직접 fetch가 CSP 위반으로 차단(콘솔 리포트). (기기)
17. **감사 종합 (N12)** — 검증: native 모드에서 IndexedDB DPoP 키 미생성 ∧ `/auth/token` 미호출 ∧ `_accessToken=null` ∧ 웹발 인증요청 0건 **동시 충족**. (기기/DevTools/로그)
18. **회귀 (Mode 1)** — 검증: `NEXT_PUBLIC_DPOP_MODE=webview`에서 인증·업로드·키로테이션·로그아웃 무변화. (기기)
19. **WebView 재생성/detach (N2)** — 검증: in-flight 중 화면 회전·재생성 시 무한 hang 없이 타임아웃 정리·복구(JsBridge detach drop 대응). (기기)

### 11.2 검증 수단·자동화 (N13)
- **자동(CI):** transport 상관관계·타임아웃·동시성(3), 봉투/쿼리/에러 매핑(5·6), authState 레이스(7), 화이트리스트(12), 능력 게이팅(14).
- **기기 수기:** KeyStore 서명·로그아웃·포그라운드·업로드·CSP·logcat·detach(8~11·15·16·19).
- **서버로그:** 네이티브 발 헤더 첨부·세션 revoke·쿼리 정합(2·5·8).

### 11.3 단계 의존·롤백 (N14)
- 직렬: 1→2→3→4. 이후 5~13 병렬 가능, 14~17·18·19는 통합 후 수행.
- **롤백:** `NEXT_PUBLIC_DPOP_MODE=webview` 재빌드로 즉시 복귀(서버 무변경 → 롤백 비용 최소). 단계적 출시(내부→일부→전체) 권장.

### 11.4 환경 매트릭스·정량 기준 (N15)
- **기기:** KeyStore/StrongBox 유무(API 28 vs 31+), 저사양 단말.
- **빌드:** dev(self-signed cert·`DPOP_VERIFY` 가변)·staging·prod.
- **정량 기준(예):** 동시 20요청 100% 정확 매칭, callApi P95 추가지연 ≤ 합의치, 타임아웃 정확 발동, logcat 토큰 노출 0건.

---

## 12. 결정 사항 (확정)

**확정**
<<<<<<< HEAD
1. **(A1) 버전·폴백** — 네이티브 도입 `1.0.0`, 과거 배포 앱 없음 → 능력 체크가 실가드, 비정상 부재 시 차단+안내(4장).
2. **(A3) user 스키마** — 현행 5필드(id/name/email/role/profileImage), `profileImage` 미설정은 `""`(현행과 동일).
3. **(B1) 헤더** — 허용 빈 목록, `Authorization`·`DPoP`·`Cookie`·`Content-Type` 네이티브 전담(7장).
4. **(B2) 에러** — 전부 토스트(5.2절 매핑표), 폼 필드검증(`fields`)은 인라인, `NOT_AUTHENTICATED` 는 토스트+로그인 이동. `errorMessages` 에 network/timeout/unauthorized 추가.
=======
1. **(A1) 버전·폴백** — 네이티브 도입 `1.0.0`, 과거 배포 앱 없음 → 능력 체크가 실가드, 비정상 부재 시 차단+안내(§4).
2. **(A3) user 스키마** — 현행 5필드(id/name/email/role/profileImage), `profileImage` 미설정은 `""`(현행과 동일).
3. **(B1) 헤더** — 허용 빈 목록, `Authorization`·`DPoP`·`Cookie`·`Content-Type` 네이티브 전담(§7).
4. **(B2) 에러** — 전부 토스트(§5.2 매핑표), 폼 필드검증(`fields`)은 인라인, `NOT_AUTHENTICATED` 는 토스트+로그인 이동. `errorMessages` 에 network/timeout/unauthorized 추가.
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
5. **로깅·CSP 범위** — native/release 전용 적용(dev 디버깅 보존).
6. **dev 페이지** — 감사 빌드에서 빌드 제외(middleware 가 prod `/dev` 차단 중이나 명시 제외).
7. **업로드** — 1단계 10MB base64, 초과 거부(대용량 후속).
8. **base URL** — path-only + 네이티브 `API_BASE_URL` 단일 결합.
9. **스트리밍/SSE** — 현재 없음 → 범위 제외.

**잔여 확인**
- 멀티 백엔드 호출 요구 여부(있으면 path 화이트리스트 확장). 없으면 잔여 없음.

---

## 13. 감사 대응 체크리스트 (요건 ↔ 근거)
| 심사 질문 | 답변 근거 |
|---|---|
| 액세스 토큰이 웹에 있나? | 없음. native 모드 웹 미수신·미보관(`_accessToken=null`), 송신 0건. |
| DPoP 키는 어디 있나? | 네이티브 KeyStore(`mobile_dpop_key`, 추출불가). 웹 키 미생성. |
| 서명자=송신자인가? | 예. 네이티브 `DPoPInterceptor`. |
| 웹이 임의 API/외부호스트를 부를 수 있나? | path/method/header 화이트리스트로 자사 API 한정, 자격증명 주입 불가. |
| (G3) 웹이 백엔드에 네트워크로 닿을 수 있나? | 아니오. CSP connect-src 에서 API 오리진 제거. |
| (G2) 토큰이 로그에 남나? | 아니오. 네이티브 BODY 로깅 비활성. |
| 서버 변경했나? | 없음(토큰 키-미바인딩, 네이티브 기존 호출과 동일). |

---

## 14. 재점검 보완 추적표 (소스 재대조, G1–G15)
| ID | 심각도 | 소스 근거 | 보완 | 반영 절 |
|---|---|---|---|---|
<<<<<<< HEAD
| G1 | 중대 | `lib/bridge/appVersion.ts`; 웹/네이티브 분리 배포 | callApi 능력 체크+버전 게이트+폴백 정책 | 4장, 11장(14), 12-1절 |
| G2 | 중대 | `core/network/ApiClient.kt` BODY 로깅 무조건 ON | release/native 로깅 NONE/HEADERS | 6.2-4절, 7장, 13장 |
| G3 | 중대 | `middleware.ts` connect-src 에 API 오리진 | native 모드 connect-src 에서 API 제거 | 7장, 11장(16), 13장 |
| G4 | 중대 | `WebviewLayoutClient`→`useKeyRotation`→`rotateDPoPKey`(웹키) | native 비활성 + 네이티브 KeyStore 로테이션 | 6.1-5절, 6.2-5절, 10장 |
| G5 | 중대 | `features/auth/hooks/useAuth.ts::logout` 복합 | bridge.logout 권위, 중복/웹키 정리 | 6.1-8절, 9장 |
| G6 | 중대 | `app/WebviewLayoutClient.tsx` 마운트 3종 | 마운트 분기, tokenReceiver→authState | 6.1-5절~6.1-7절 |
| G7 | 중간 | `useAuthStore.setAuth` 토큰 필수; push 레이스 | setAuthState 액션 + requestAuthState 당겨오기 | 6.1-6절, 9장 |
| G8 | 중간 | 네이티브/오프라인 실패 매핑 부재 | transportError→ApiError 매핑 | 5.2절, 6.2-2절 |
| G9 | 중간 | `apiClient` 204/`content-length`·`toApiError` | isEmpty + 에러 detail 봉투 보존 | 5.2절 |
| G10 | 중간 | `app/api/*`(messages/translate/native-strings) | 위임 제외, 로그인서버만 callApi | 6.1-9절 |
| G11 | 경미 | `apiClient.get` 쿼리 직렬화(배열) | path 에 완성 전달, 네이티브 재구현 금지 | 5.1절 |
| G12 | 경미 | 네이티브 `appForeground` emit | 포그라운드 시 authState 재동기화 | 6.2-3절, 9장 |
| G13 | 경미 | `evaluateJavascript` 문자열 주입 | 대용량 JSON 페이지네이션 | 5.3절, 8장 |
| G14 | 경미 | `window.onBridgeEvent` 전역 | UUID requestId+CSP+신뢰오리진 전제 | 5.3절, 7장 |
| G15 | 경미 | `apiClient - 복사본.ts`, `api/auth` 스텁 | 데드코드 메모(미삭제) | 10장 |
=======
| G1 | 중대 | `lib/bridge/appVersion.ts`; 웹/네이티브 분리 배포 | callApi 능력 체크+버전 게이트+폴백 정책 | §4, §11(14), §12-1 |
| G2 | 중대 | `core/network/ApiClient.kt` BODY 로깅 무조건 ON | release/native 로깅 NONE/HEADERS | §6.2-4, §7, §13 |
| G3 | 중대 | `middleware.ts` connect-src 에 API 오리진 | native 모드 connect-src 에서 API 제거 | §7, §11(16), §13 |
| G4 | 중대 | `WebviewLayoutClient`→`useKeyRotation`→`rotateDPoPKey`(웹키) | native 비활성 + 네이티브 KeyStore 로테이션 | §6.1-5, §6.2-5, §10 |
| G5 | 중대 | `features/auth/hooks/useAuth.ts::logout` 복합 | bridge.logout 권위, 중복/웹키 정리 | §6.1-8, §9 |
| G6 | 중대 | `app/WebviewLayoutClient.tsx` 마운트 3종 | 마운트 분기, tokenReceiver→authState | §6.1-5~7 |
| G7 | 중간 | `useAuthStore.setAuth` 토큰 필수; push 레이스 | setAuthState 액션 + requestAuthState 당겨오기 | §6.1-6, §9 |
| G8 | 중간 | 네이티브/오프라인 실패 매핑 부재 | transportError→ApiError 매핑 | §5.2, §6.2-2 |
| G9 | 중간 | `apiClient` 204/`content-length`·`toApiError` | isEmpty + 에러 detail 봉투 보존 | §5.2 |
| G10 | 중간 | `app/api/*`(messages/translate/native-strings) | 위임 제외, 로그인서버만 callApi | §6.1-9 |
| G11 | 경미 | `apiClient.get` 쿼리 직렬화(배열) | path 에 완성 전달, 네이티브 재구현 금지 | §5.1 |
| G12 | 경미 | 네이티브 `appForeground` emit | 포그라운드 시 authState 재동기화 | §6.2-3, §9 |
| G13 | 경미 | `evaluateJavascript` 문자열 주입 | 대용량 JSON 페이지네이션 | §5.3, §8 |
| G14 | 경미 | `window.onBridgeEvent` 전역 | UUID requestId+CSP+신뢰오리진 전제 | §5.3, §7 |
| G15 | 경미 | `apiClient - 복사본.ts`, `api/auth` 스텁 | 데드코드 메모(미삭제) | §10 |
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda

---

## 15. 문서만으로 부족한 부분 / 착수 전 확정 (구현 충분성)

> 본 설계서는 **설계·계약 수준까지 자족적**(어떤 파일·함수·계약·검증인지 확정)이다. 아래는 문서 외부에서 확정되어야 구현이 **완결**된다.

**A. 외부 승인·입력**
<<<<<<< HEAD
- ✅ **확정:** callApi 도입 버전 `1.0.0`·과거 배포 앱 없음(4장·12장), `authState.user` 5필드·`profileImage=""`(12장), 12장 결정 일체.
- 잔여: 고객/심사 요건 **최종 문구**(토큰 위치는 확인됨 — 추가 통제 요구 여부만).

**B. 코드 대조로 확정**
- ✅ **확정:** 헤더 화이트리스트(빈 목록 + 네이티브 전담, 7장), `transportError`→`ApiError` 매핑표(5.2절).
- 잔여(구현 시): 응답헤더 미사용 회귀 가드. (`appForeground` 트리거 위치·예외 매핑·진행률 배선은 6.2-3절·6.2-2절·6.1-4절 에 명시됨.)

**C. 산출물 (문서엔 계획, 별도 작성)**
- 모킹 브릿지 + 동시성/타임아웃/레이스 단위테스트 픽스처(11.2절).
=======
- ✅ **확정:** callApi 도입 버전 `1.0.0`·과거 배포 앱 없음(§4·§12), `authState.user` 5필드·`profileImage=""`(§12), §12 결정 일체.
- 잔여: 고객/심사 요건 **최종 문구**(토큰 위치는 확인됨 — 추가 통제 요구 여부만).

**B. 코드 대조로 확정**
- ✅ **확정:** 헤더 화이트리스트(빈 목록 + 네이티브 전담, §7), `transportError`→`ApiError` 매핑표(§5.2).
- 잔여(구현 시): 응답헤더 미사용 회귀 가드. (`appForeground` 트리거 위치·예외 매핑·진행률 배선은 §6.2-3·§6.2-2·§6.1-4 에 명시됨.)

**C. 산출물 (문서엔 계획, 별도 작성)**
- 모킹 브릿지 + 동시성/타임아웃/레이스 단위테스트 픽스처(§11.2).
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
- 감사 자동검증(IndexedDB 키 부재·토큰 부재·웹발요청 0건).

**D. 범위 경계**
- **플랫폼: 본 설계는 Android(android-mobile) 한정.** iOS WebView 가 존재하면 WKWebView 브릿지 + Keychain/Secure Enclave 로 **병행 구현 필요**(현 워크스페이스에 iOS 소스 없음).
- 네이티브 키 로테이션 정책/주기(서버 키-미바인딩이라 선택 사안).

<<<<<<< HEAD
**판정(v7):** 16장 구현 코드 계약으로 **문서만으로 버그 없이 구현 가능** 수준. 분기 지점(verb 레벨)·레이어 규칙(lib 순수성·주입 `onClearAuth`)·401 처리·토큰 로그 redact·validator·CSP 분기까지 명문화. 잔여는 (C)테스트 산출물, (D)iOS 병행(해당 시)뿐.
=======
**판정(v7):** §16 구현 코드 계약으로 **문서만으로 버그 없이 구현 가능** 수준. 분기 지점(verb 레벨)·레이어 규칙(lib 순수성·주입 `onClearAuth`)·401 처리·토큰 로그 redact·validator·CSP 분기까지 명문화. 잔여는 (C)테스트 산출물, (D)iOS 병행(해당 시)뿐.
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda

---

## 16. 구현 코드 계약 (스켈레톤 — 복붙 기준)

> 레이어 규칙: `lib/` 는 features/bridge store 를 **직접 import 하지 않는다**(주입된 콜백 사용). 아래 스켈레톤이 이를 준수한다.

### 16.1 웹 — apiClient native 경로 (분기는 **verb 레벨**, `withRefresh` 는 webview 전용)
```ts
// lib/api/apiClient.ts
import { resolveDpopMode } from '@/lib/auth/dpop/mode';
import { callViaNative } from '@/lib/bridge/nativeApiTransport';
import { ApiError } from '@/types/api';
<<<<<<< HEAD
import { fallbackMessages } from '@/lib/utils/errorMessages';   // 16.9절 키 추가
=======
import { fallbackMessages } from '@/lib/utils/errorMessages';   // §16.9 키 추가
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda

function mapTransportError(code: NonNullable<NativeApiResponse['transportError']>): ApiError {
  switch (code) {
    case 'OFFLINE': return new ApiError(0, 'NETWORK_ERROR', fallbackMessages.network);
    case 'TIMEOUT': return new ApiError(0, 'TIMEOUT', fallbackMessages.timeout);
    case 'NOT_AUTHENTICATED':
      _onClearAuth?.();                                          // 주입 콜백(레이어 규칙) → 가드가 로그인 이동
      return new ApiError(401, 'UNAUTHORIZED', fallbackMessages.unauthorized);
    default:        return new ApiError(0, 'BRIDGE_ERROR', fallbackMessages.unknown);
  }
}
async function nativeRequest<T>(method: NativeApiRequest['method'], path: string, body?: unknown): Promise<T> {
  const r = await callViaNative({ method, path, body: body !== undefined ? JSON.stringify(body) : null });
  if (r.transportError) throw mapTransportError(r.transportError);
  if (r.status === 401) { _onClearAuth?.(); throw new ApiError(401, 'UNAUTHORIZED', fallbackMessages.unauthorized); }
  if (r.isEmpty) return undefined as T;
  const res = new Response(r.bodyText, { status: r.status });
  if (!res.ok) throw await toApiError(res);
  return res.json();
}
// verb 분기 (예: get/post). path 는 기존 직렬화 그대로(쿼리 포함).
//  get:  const path = url + qs;
//        return resolveDpopMode()==='native' ? nativeRequest<T>('GET', path)
//                                            : withRefresh<T>(path,'GET',(h)=>fetch(`${baseUrl}${path}`,{headers:h,credentials:'include',cache:'no-store'}));
//  post: return resolveDpopMode()==='native' ? nativeRequest<T>('POST', url, body)
//                                            : withRefresh<T>(url,'POST',(h)=>fetch(`${baseUrl}${url}`,{method:'POST',headers:h,credentials:'include',body:body?JSON.stringify(body):undefined}));
//  put/delete 동일. withRefresh·buildHeaders 는 webview 전용(native 미경유 → 토큰·proof 웹 미사용).
```

### 16.2 웹 — 업로드(진행률 별도 채널)
```ts
// lib/bridge/nativeApiTransport.ts — 추가: callViaNative 와 동일하되 requestId 로 apiUploadProgress 구독
export function callViaNativeUpload(req: Omit<NativeApiRequest,'requestId'>, onProgress?: (p:number)=>void): Promise<NativeApiResponse>;
//   구현: requestId 생성 → onProgress 있으면 bridgeEventBus.on('apiUploadProgress', e=>{ if(e.requestId===id) onProgress(e.percent) })
//        → settle(resolve/reject/timeout) 시 progress 구독·pending 모두 해제(누수 방지).
// lib/api/fileUploadClient.ts sendUpload() native 분기:
//   validateFile 선검증(상한 초과 즉시 거부) → File→base64(FileReader) →
<<<<<<< HEAD
//   callViaNativeUpload({method:'POST', path:url, upload:{fileBase64,fileName,mimeType,field:'file'}}, onProgress) → 16.1절 와 동일 정규화.
=======
//   callViaNativeUpload({method:'POST', path:url, upload:{fileBase64,fileName,mimeType,field:'file'}}, onProgress) → §16.1 와 동일 정규화.
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
//   ※ 401/NOT_AUTHENTICATED 도 동일 처리하려면 configureFileUploadClient 에 onClearAuth 주입 추가.
```

### 16.3 웹 — 인증상태(토큰 없이)
```ts
// useAuthStore.ts — AuthState 에 액션 추가 (_accessToken 불변: null 유지)
setAuthState: (user: User | null, isAuthenticated: boolean) => set({ user, isAuthenticated }),
// features/auth/hooks/useAuthStateReceiver.ts (신규)
export function useAuthStateReceiver() {
  const setAuthState = useAuthStore(s => s.setAuthState);
  useEffect(() => {
    if (resolveDpopMode() !== 'native') return;                       // webview no-op (Rules of Hooks: 호출은 무조건, 분기는 내부)
    const off = bridgeEventBus.on<{user:User|null; isAuthenticated:boolean}>('authState',
      d => setAuthState(d.user, d.isAuthenticated));
    window.bridge?.requestAuthState();                                // 초기 당겨오기(push 레이스 차단)
    return off;
  }, [setAuthState]);
}
```

### 16.4 웹 — 훅/부트스트랩 early-return 가드
```
WebviewLayoutClient: 네 훅(useAuthInterceptor·useKeyRotation·useTokenReceiver·useAuthStateReceiver) 무조건 호출. 분기는 각 훅 '내부' 최상단.
useKeyRotation/useTokenReceiver: useEffect 첫 줄 `if (resolveDpopMode()==='native') return;`
useAuthInterceptor: native 모드여도 configureApiClient({ getToken:()=>null, onUnauthorized: async()=>{throw new ApiError(401,'UNAUTHORIZED','')}, onClearAuth: clearAuth }) 호출
<<<<<<< HEAD
                    → _onClearAuth 주입(16.1절 NOT_AUTHENTICATED 용). getToken/onUnauthorized 는 native 경로 미사용. webview 모드는 기존 주입.
=======
                    → _onClearAuth 주입(§16.1 NOT_AUTHENTICATED 용). getToken/onUnauthorized 는 native 경로 미사용. webview 모드는 기존 주입.
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
ProtectedLayout:    useEffect 첫 줄 `if (resolveDpopMode()==='native') return;` (requestAuthCode 부트스트랩 skip)
useAuth.logout():   native → window.bridge.logout(); (authApi.logout()·deleteDPoPKeyPair() 생략) → clearAuth()/redirect 공통.
```

### 16.5 웹 — 브릿지 타입/이벤트/validator
```ts
// types/bridge.ts NativeBridge += callApi(requestJson:string):void; requestAuthState():void;
// bridgeProtocol.ts BridgeEventName += 'apiResponse' | 'apiUploadProgress' | 'authState'
// bridgeClient.ts ALLOWED_EVENTS += 위 3개;  EVENT_VALIDATORS +=
apiResponse:       d => !!d && typeof (d as any).requestId==='string' && typeof (d as any).status==='number',
apiUploadProgress: d => !!d && typeof (d as any).requestId==='string' && typeof (d as any).percent==='number',
authState:         d => !!d && typeof (d as any).isAuthenticated==='boolean',
```

### 16.6 웹 — middleware CSP 모드 분기
```ts
// middleware.ts applySecurityHeaders()
const mode   = process.env.NEXT_PUBLIC_DPOP_MODE === 'native' ? 'native' : 'webview';
const apiUrl = mode === 'native' ? '' : (process.env.NEXT_PUBLIC_API_BASE_URL ?? '');  // native → connect-src 에서 API 제거
// 이후 connectSrc 계산은 기존대로 apiUrl 조건부. dev/prod CSP 양쪽 동일 반영.
```

### 16.7 네이티브 — ApiBridgeHandler (Kotlin)
```kotlin
@Singleton
class ApiBridgeHandler @Inject constructor(
  private val apiClient: ApiClient,
  private val sessionStore: UserSessionStore,                  // authState user 출처
) {
  private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
  private val ALLOWED_HEADERS = setOf("Accept", "Accept-Language")   // Authorization/DPoP/Cookie/Content-Type 제외(네이티브·인터셉터 전담)

  fun callApi(json: String, dispatch:(String,String)->Unit) { scope.launch {
    val req = parse(json); val id = req.requestId               // CallApiReq
    try {
<<<<<<< HEAD
      require(!req.path.startsWith("http")) { "absolute url 금지" }        // 화이트리스트(7장)
=======
      require(!req.path.startsWith("http")) { "absolute url 금지" }        // 화이트리스트(§7)
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
      val url = API_BASE_URL.trimEnd('/') + "/" + req.path.trimStart('/')
      val rb = Request.Builder().url(url)
      req.headers?.filterKeys { it in ALLOWED_HEADERS }?.forEach { (k,v) -> rb.header(k,v) }
      rb.method(req.method, buildBody(req))                     // upload→MultipartBody(진행률 래퍼) : JSON RequestBody("application/json") or null
      apiClient.okHttpClient.newCall(rb.build()).execute().use { res ->
        val text = res.body?.string() ?: ""
        dispatch("apiResponse", JSONObject().apply {
          put("requestId",id); put("ok",res.isSuccessful); put("status",res.code)
          put("bodyText",text); put("isEmpty", res.code==204 || text.isEmpty())
        }.toString())
      }
    } catch (e: SocketTimeoutException) { err(id,"TIMEOUT",dispatch) }
      catch (e: IOException)            { err(id,"OFFLINE",dispatch) }
      catch (e: Exception)              { err(id,"NATIVE_ERROR",dispatch) }
  }}
  private fun err(id:String, code:String, d:(String,String)->Unit) =
    d("apiResponse", JSONObject().apply{ put("requestId",id); put("ok",false); put("status",0); put("bodyText",""); put("transportError",code) }.toString())

  fun requestAuthState(dispatch:(String,String)->Unit) {
    val u = sessionStore.currentUser()                          // 없으면 null
    dispatch("authState", JSONObject().apply{ put("isAuthenticated", u!=null); put("user", u?.toJson()) }.toString())
  }
}
<<<<<<< HEAD
// 최종 401(okHttp AuthInterceptor 갱신 실패)은 status=401 응답으로 내려가고, 웹 16.1절 이 _onClearAuth+UNAUTHORIZED 처리.
=======
// 최종 401(okHttp AuthInterceptor 갱신 실패)은 status=401 응답으로 내려가고, 웹 §16.1 이 _onClearAuth+UNAUTHORIZED 처리.
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
```

### 16.8 네이티브 — JsBridge·로깅·트리거
```kotlin
// JsBridge (생성자에 apiHandler: ApiBridgeHandler 주입)
@JavascriptInterface fun callApi(requestJson:String) = apiHandler.callApi(requestJson, ::dispatchBridgeEvent)
@JavascriptInterface fun requestAuthState()          = apiHandler.requestAuthState(::dispatchBridgeEvent)
// ApiClient.kt 로깅 — 토큰 redact + release NONE (HEADERS 만으론 Authorization 노출되므로 redact 필수)
HttpLoggingInterceptor().apply {
  level = if (BuildConfig.DEBUG) HttpLoggingInterceptor.Level.BODY else HttpLoggingInterceptor.Level.NONE
  redactHeader("Authorization"); redactHeader("DPoP")
}
<<<<<<< HEAD
// authState dispatch 트리거: AuthRepository 로그인/refresh/logout 성공·실패, WebView attach, 호스트 Activity onResume(6.2-3절)
=======
// authState dispatch 트리거: AuthRepository 로그인/refresh/logout 성공·실패, WebView attach, 호스트 Activity onResume(§6.2-3)
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
```

### 16.9 웹 — errorMessages 추가
```ts
// lib/utils/errorMessages.ts  fallbackMessages +=
network:      '네트워크 연결을 확인해 주세요.',
timeout:      '요청 시간이 초과되었습니다.',
unauthorized: '다시 로그인해 주세요.',
```
