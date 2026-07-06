# 인증 시스템 (DPoP + 토큰 관리)

> 대상: 개발자  
> DPoP 기반 인증 흐름, 토큰 캐시, authService, Zustand AuthStore를 다룹니다.
> 아래 1~8절은 기본 모드(`webview`)를 기준으로 합니다. 네이티브 위임 모드(`native`)는 §9를 참고하세요.

---

## 1. 인증 흐름 개요 (webview 모드)

이 앱은 Native WebView 환경에서 동작합니다. 네이티브 앱이 사용자 인증을 담당하고, 웹에서는 네이티브로부터 Authorization Code를 받아 Access Token으로 교환합니다.

```
네이티브 앱 로그인
      │
      ▼
bridge.requestAuthCode()          ← 웹에서 네이티브로 코드 요청
      │
      ▼
appAuthCode 이벤트 수신            ← 네이티브 → 웹 (1회성 코드)
      │
      ▼
initAuthFromCode(code, setAuth)   ← POST /auth/token + DPoP Proof
      │
      ▼
Access Token + User 정보 수신
      │
      ▼
useAuthStore.setAuth(user, token) ← Zustand 저장
      │
      ▼
tokenCache.set(token, expiresIn)  ← 메모리 캐시
      │
      ▼
apiClient 이후 요청에서 자동 사용
```

---

## 2. DPoP (RFC 9449)

DPoP(Demonstrating Proof of Possession)는 API 요청 시 토큰 도용을 방지하는 보안 메커니즘입니다. 매 요청마다 요청 URL과 메서드를 포함한 JWT를 생성해 `DPoP` 헤더로 전송합니다.

### 키 관리 (`lib/auth/dpop/proofGenerator.ts`)

```ts
// ES256 (ECDSA P-256) 키쌍 생성 → IndexedDB 저장
await generateDPoPKeyPair();

// 기존 키 조회 (없으면 새로 생성)
const keyPair = await getOrCreateKeyPair();

// 키 삭제 (로그아웃 시)
await deleteDPoPKeyPair();
```

키쌍은 IndexedDB의 `hpoint-dpop` DB → `keypair` 스토어에 `dpop-key`로 저장됩니다. `extractable: false`로 생성되므로 JavaScript에서 개인키 값에 직접 접근할 수 없습니다.

### Proof JWT 생성

```ts
import { createDPoPProof } from '@/lib/auth/dpop/proofGenerator';

const proof = await createDPoPProof(url, method);
// 결과: base64url(header).base64url(payload).base64url(signature)
```

생성되는 DPoP Proof JWT:

```json
// header
{ "typ": "dpop+jwt", "alg": "ES256", "jwk": { /* 공개키 */ } }

// payload
{
  "jti": "uuid-v4",           // 요청마다 유니크 ID
  "htm": "POST",              // HTTP 메서드
  "htu": "https://api.../auth/token",  // URL (쿼리스트링 제외)
  "iat": 1234567890           // 발급 시각 (Unix timestamp)
}
```

---

## 3. Authorization Code 교환 (`lib/auth/authService.ts`)

```ts
import { initAuthFromCode } from '@/lib/auth/authService';

// features 레이어에서 호출 — setAuth는 Zustand 액션을 주입
await initAuthFromCode(code, (user, accessToken) => {
  useAuthStore.getState().setAuth(user, accessToken);
});
```

내부 동작:

1. `createDPoPProof(url, 'POST')` 호출
2. `POST /auth/token` — `{ grant_type: 'authorization_code', code }`
3. 응답 `{ user, accessToken }` → `setAuth(user, accessToken)` 콜백 호출

`lib/auth/authService.ts`는 `lib/` 레이어이므로 Zustand에 직접 의존하지 않습니다. `setAuth`는 호출부에서 주입합니다.

---

## 4. 토큰 캐시 (`lib/auth/token/tokenCache.ts`)

Access Token을 메모리에 캐싱합니다. 페이지 새로고침 시 캐시가 초기화되므로, Zustand store의 `accessToken`이 캐시의 정보 소스입니다.

```ts
import { tokenCache } from '@/lib/auth/token/tokenCache';

// 토큰 저장
tokenCache.set(accessToken, expiresInSec);

// 토큰 조회 (만료 30초 전이면 null 반환)
const token = tokenCache.get();

// 만료 임박 여부 확인
if (tokenCache.isExpiringSoon()) {
  // 갱신 필요
}

// 토큰 초기화 (로그아웃 시)
tokenCache.clear();
```

**`EXPIRY_BUFFER_MS = 30_000`**: 만료 30초 전부터 `get()`이 null을 반환해 갱신을 트리거합니다. 네트워크 지연을 고려한 여유 시간입니다.

---

## 5. 토큰 갱신 (`lib/auth/token/tokenRefresh.ts`)

401 응답 수신 시 `onUnauthorized` 콜백을 통해 토큰을 갱신합니다. 갱신은 `POST /auth/token`을 다시 호출하는 방식입니다.

`apiClient`는 갱신 과정에서 Zustand·bridge에 직접 의존하지 않습니다. 모두 `configureApiClient()`로 주입받은 콜백을 통해 처리됩니다.

동시 401 처리(여러 요청이 동시에 401을 받는 경우)는 `lib/auth/interceptor.ts`의 `pendingQueue`로 관리합니다. 첫 번째 요청만 갱신을 시도하고 나머지는 큐에서 대기합니다.

---

## 6. Zustand AuthStore (`features/auth/hooks/useAuthStore.ts`)

> ⚠️ `hooks/useAuthStore.ts`(루트)는 빈 스텁이며 어디서도 import되지 않는 미사용 파일입니다. 실제 스토어는 `features/auth/hooks/useAuthStore.ts`입니다.

```ts
import { useAuthStore, getAccessToken } from '@/features/auth/hooks/useAuthStore';

// 컴포넌트에서 구독
const isAuthenticated = useAuthStore(s => s.isAuthenticated);
const user            = useAuthStore(s => s.user);

// 이벤트 핸들러 / 콜백에서 직접 접근 (구독 없이)
useAuthStore.getState().setAuth(user, accessToken);
useAuthStore.getState().clearAuth();
getAccessToken(); // 모듈 레벨 변수 — apiClient의 동기 getToken으로 주입됨
```

`accessToken`은 Zustand state가 아니라 모듈 레벨 변수(`_accessToken`)로 관리되며 `getAccessToken()`으로 조회합니다(리렌더 없이 동기 접근하기 위함).

| 상태 | 타입 | 설명 |
|---|---|---|
| `user` | `User \| null` | 로그인된 사용자 정보 |
| `isAuthenticated` | `boolean` | 로그인 여부 |
| `isInitialized` | `boolean` | 부트스트랩 완료 여부 |

| 액션 | 설명 |
|---|---|
| `setAuth(user, token)` | 로그인 완료 시 상태 저장 (webview·native 공통, §9 참고) — `_accessToken` 갱신 |
| `clearAuth()` | 로그아웃 시 상태·토큰 캐시 초기화 |
| `setInitialized()` | 부트스트랩 완료 표시 |

---

## 7. apiClient 인증 설정 (DI 연결)

`features/auth/hooks/useAuthInterceptor.ts`에서 앱 시작 시 콜백을 주입합니다.

```ts
// features/auth/hooks/useAuthInterceptor.ts (실제 구현 요약)
import { useEffect } from 'react';
import { getAccessToken, useAuthStore } from './useAuthStore';
import { createAuthInterceptor }    from '@/lib/auth/interceptor';
import { configureApiClient }       from '@/lib/api/apiClient';
import { configureFileUploadClient } from '@/lib/api/fileUploadClient';

export function useAuthInterceptor(): void {
  const setAuth   = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    const onUnauthorized = createAuthInterceptor((token, user) => setAuth(user, token));

    configureApiClient({
      getToken: getAccessToken,   // 동기 토큰 getter (module-level 변수)
      onUnauthorized,
      onClearAuth: clearAuth,
    });

    configureFileUploadClient({
      getToken: getAccessToken,
      onUnauthorized,
      onClearAuth: clearAuth,    // native 모드 업로드의 401 세션 정리용
    });
  }, [setAuth, clearAuth]);
}
```

이 훅은 `app/WebviewLayoutClient.tsx`에서 마운트합니다(같은 곳에서 `useKeyRotation()`, `useTokenReceiver()`도 함께 마운트).

---

## 8. 로그아웃 흐름 (`features/auth/hooks/useAuth.ts`)

webview 모드:

```ts
// 1. 서버에 로그아웃 요청 (실패해도 클라이언트 상태는 초기화)
await authApi.logout().catch(() => {});

// 2. 네이티브에 로그아웃 알림
window.bridge?.logout();

// 3. DPoP 키쌍 삭제
await deleteDPoPKeyPair();

// 4. Zustand 상태 초기화 (내부에서 tokenCache.clear()도 호출)
clearAuth();
```

native 모드(§9)는 서버 로그아웃 호출·웹 DPoP 키 삭제 없이, 네이티브가 세션 정리의 권위를 가집니다:

```ts
window.bridge?.logout();
clearAuth();
```

로그아웃은 네이티브 이벤트(예: 세션 만료 알림)로도 트리거될 수 있습니다. Bridge 이벤트 처리는 `14-bridge-guide.md`를 참고하세요.

---

## 9. DPoP 처리 모드 — webview / native (`lib/auth/dpop/mode.ts`)

`NEXT_PUBLIC_DPOP_MODE` 환경변수로 두 모드를 전환할 수 있습니다. 이 절은 **2-Lite** 방식(proof 서명만 네이티브 위임)을 설명합니다. 설계 배경은 `docs/21-dpop-mode-switch-proposal.md` §3·§4를 참고하세요.

> ⚠️ 과거(2025~2026 상반기) 한때 인증 API 호출 전체를 네이티브가 대행하는 **2-Full** 방식(`bridge.callApi`, 토큰·DPoP 키가 웹 JS에 전혀 없음)으로 구현되었던 적이 있습니다(`docs/work/202`·`203`). 이후 요건이 "proof 서명만 네이티브 위임 + 웹이 서버로 직접 요청"으로 변경되어 **2-Lite로 재전환**했습니다. 2-Full 관련 기록은 `docs/work/202`·`203`·`204`(전환 결과보고서)에 이력으로 남아 있습니다.

| 모드 | 설명 |
|---|---|
| `webview` (기본) | 위 1~8절과 동일. 웹이 DPoP 키·proof를 자체 관리 |
| `native` | DPoP proof 서명만 네이티브에 위임(`bridge.createDpopProof`). 토큰은 네이티브가 발급/갱신해 `tokenReceived`로 푸시. **fetch는 두 모드 모두 웹이 직접 수행** |

```ts
// lib/auth/dpop/mode.ts
export function resolveDpopMode(): DpopMode {
  const want = process.env.NEXT_PUBLIC_DPOP_MODE === 'native' ? 'native' : 'webview';
  if (want !== 'native') return 'webview';
  // 능력 체크: 브릿지·createDpopProof 미보유(브라우저/구버전 네이티브) 시 webview로 폴백
  if (!isWebView() || typeof window.bridge?.createDpopProof !== 'function') return 'webview';
  return 'native';
}
```

native 모드에서의 요청 흐름 (`lib/api/apiClient.ts`, `lib/auth/dpop/proofProvider.ts`):

```
apiClient.get/post/put/delete
      │  buildHeaders(url, method)
      ▼
getDPoPHeader(url, method)                 ← lib/auth/dpop/proofProvider.ts
      │  resolveDpopMode() === 'native'
      ▼
window.bridge.createDpopProof(method, url) ← 네이티브 KeyStore가 동기 서명, 즉시 문자열 반환
      │
      ▼
Authorization: DPoP <token> + DPoP: <proof> 헤더로 웹이 직접 fetch(baseUrl + url) 수행
      │
      ▼
서버 응답 → 기존 toApiError/json() 그대로 재사용 (webview 모드와 동일 코드 경로)
```

- **토큰**: native 모드에서도 웹 메모리(`useAuthStore._accessToken`)에 보관됩니다. 최초 진입 시 `app/(protected)/layout.tsx`가 `bridge.requestNativeToken()`을 호출하고, 네이티브가 `tokenReceived` 이벤트로 `{ access_token, user }`를 푸시하면 `features/auth/hooks/useTokenReceiver.ts`가 `setAuth(user, access_token)`으로 반영합니다. 401 갱신도 동일하게 `requestNativeToken()`을 다시 호출합니다(`lib/auth/interceptor.ts`).
- **DPoP 키**: native 모드에서는 웹이 키를 생성하지 않습니다(`useKeyRotation`이 내부적으로 early-return). 서명은 항상 네이티브 KeyStore가 수행합니다.
- **업로드**(`lib/api/fileUploadClient.ts`)도 동일한 `getDPoPHeader()`로 DPoP 헤더만 교체하고, 파일 전송(fetch/XHR)은 두 모드 모두 웹이 직접 수행합니다.
- **CSP**: `proxy.ts`는 모드에 관계없이 `connect-src`에 API 오리진을 허용합니다(웹이 항상 서버에 직접 연결하므로).

---

## 10. WebView 전용 접근 게이트 (`proxy.ts`)

모든 페이지는 네이티브 앱 WebView를 통해서만 접근해야 합니다. `proxy.ts`가 서버단에서 이를 강제합니다(클라이언트 가드와 달리 SSR 셸도 노출되지 않음).

### 정책

| 환경 | 일반 페이지 | `/dev/*` |
|---|---|---|
| dev (`NODE_ENV=development`, `next dev`) | 전면 개방(게이트 없음) | 접근 가능 |
| staging·prod (`NODE_ENV=production`, `next build`) | **네이티브(WebView)만 허용**, 그 외 `/blocked` | 차단(`/404` rewrite) |

### 식별 방식 — User-Agent 마커

네이티브 WebView가 User-Agent에 `WEBVIEW_UA_MARKER`(현재 `'HPointApp'`)를 포함시킵니다. middleware는 비-dev에서 이 토큰이 없는 요청을 모두 `/blocked`로 rewrite합니다.

- iOS: `webView.customUserAgent = "<기본 UA> HPointApp/1.0"`
- Android: `settings.userAgentString = settings.userAgentString + " HPointApp/1.0"`
- ⚠️ 마커 문자열은 `proxy.ts`의 `WEBVIEW_UA_MARKER` 상수와 **정확히 일치**해야 합니다. 변경 시 웹·네이티브 양쪽을 함께 수정합니다.

### 동작 요약

```
요청 → proxy()
  ├─ NODE_ENV=development → 통과 (dev 전면 개방)
  └─ NODE_ENV=production
       ├─ /dev/*                 → /404 rewrite
       ├─ pathname === '/blocked'→ 통과 (예외 — 무한 rewrite 방지)
       ├─ UA에 'HPointApp' 없음  → /blocked rewrite
       └─ UA에 'HPointApp' 있음  → 통과 (보안 헤더 적용 후 next())
```

`proxy.ts`는 게이트 통과 후 모든 응답에 보안 헤더(CSP, X-Frame-Options, HSTS 등)도 함께 적용합니다. CSP `connect-src`에는 `NEXT_PUBLIC_DPOP_MODE`와 무관하게 항상 API 오리진이 포함됩니다 — 2-Lite는 webview·native 두 모드 모두 웹이 서버로 직접 연결하기 때문입니다(§9).

### 연관

- `/blocked` 안내 페이지: `app/blocked/page.tsx` (라우트 그룹 밖, 게이트 예외).
- `(protected)/layout.tsx`: 미인증 시 로그인 화면으로 **리다이렉트하지 않습니다.** 대신 webview-code SSO를 자동 수행합니다(`requestAuthCode` → `initAuthFromCode` → `setAuth`, dev·prod 공통 적용). 브라우저(`window.bridge` 없음)에서는 스킵됩니다. native 모드에서는 이 부트스트랩 자체를 건너뜁니다(인증 상태는 §9의 `authState` 수신으로 채워짐). 화면 단위 접근 제어는 각 페이지가 `isAuthenticated`를 읽어 개별 처리합니다(예: `app/(protected)/main/page.tsx`의 메뉴 항목별 `requiresAuth` 블록).
- `/api/*`는 `proxy.ts`의 `config.matcher`에서 제외되어 이 게이트의 대상이 아니며, DPoP 토큰(네이티브 전용)으로 별도 보호됩니다.

### 한계 / 주의

- User-Agent는 위조 가능한 소프트 게이트입니다. 단 `(protected)` 실데이터는 네이티브 전용 DPoP 액세스 토큰이 필요해 별도로 보호됩니다.
- 향후 앱 링크용 `/.well-known/assetlinks.json`·`apple-app-site-association`을 추가하면 OS가 WebView UA 없이 가져가므로 `proxy.ts`에서 해당 경로를 **예외 처리**해야 합니다.
- 로컬에서 prod 빌드(`next start`)로 테스트하면 `NODE_ENV=production`이라 게이트가 켜져 막힙니다 — UA 마커를 포함한 요청으로 테스트하세요.
