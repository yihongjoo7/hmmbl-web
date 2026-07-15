# DPoP 인증 내부 구현

> 대상: 관리자  
> DPoP 키 관리·Proof 생성, Authorization Code 교환, 토큰 캐시·갱신, apiClient 인증 DI 연결, 로그아웃 내부 구현, webview/native 모드 전환의 실제 구현 상세를 다룹니다.  
> 일반 기능 개발(화면 추가, API 연동 등) 시에는 이 문서를 직접 다룰 일이 없습니다 — 개발자가 알아야 할 핵심 사용법은 [05-auth-system.md](./05-auth-system.md)를 참고하세요.

---

## 1. DPoP 키 관리 및 Proof 생성 (`lib/auth/dpop/proofGenerator.ts`)

DPoP(Demonstrating Proof of Possession)는 API 요청 시 토큰 도용을 방지하는 보안 메커니즘입니다.  
매 요청마다 요청 URL과 메서드를 포함한 JWT를 생성해 `DPoP` 헤더로 전송합니다.

### 키 관리

```ts
// ES256 (ECDSA P-256) 키쌍 생성 → IndexedDB 저장
await generateDPoPKeyPair();

// 기존 키 조회 (없으면 새로 생성)
const keyPair = await getOrCreateKeyPair();

// 키 삭제 (로그아웃 시)
await deleteDPoPKeyPair();
```

키쌍은 IndexedDB의 `hpoint-dpop` DB → `keypair` 스토어에 `dpop-key`로 저장됩니다.  
`extractable: false`로 생성되므로 JavaScript에서 개인키 값에 직접 접근할 수 없습니다.

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

## 2. Authorization Code 교환 (`lib/auth/authService.ts`)

```ts
import { initAuthFromCode } from '@/lib/auth/authService';

// features 레이어에서 호출 — setAuth는 Zustand 액션을 주입
await initAuthFromCode(code, (user, accessToken) => {
  useAuthStore.getState().setAuth(user, accessToken);
});
```

내부 동작:

1. `createDPoPProof(\`${baseUrl}/auth/token\`, 'POST')` 호출
2. `POST /auth/token` — `{ grant_type: 'authorization_code', code }`
3. 응답 `{ access_token, refresh_token, expires_in, user }` → `setAuth(user, access_token)` 콜백 호출

> ⚠️ `/auth/token` 응답은 **snake_case**(`access_token`)입니다. `login`/`refresh` 응답의 camelCase `accessToken`과 다르므로, 새 코드를 작성할 때 필드명을 반드시 확인하세요. `refresh_token`은 응답에 포함되지만 현재 코드에서는 사용하지 않습니다.

`lib/auth/authService.ts`는 `lib/` 레이어이므로 Zustand에 직접 의존하지 않습니다.  
`setAuth`는 호출부에서 주입합니다.

이 함수는 `(protected)/layout.tsx`의 webview-code SSO 부트스트랩에서만 호출됩니다(상세: `31-security-infrastructure.md` 2장).

---

## 3. 토큰 캐시 (`lib/auth/token/tokenCache.ts`)

Access Token을 메모리에 캐싱합니다.  
페이지 새로고침 시 캐시가 초기화되므로, Zustand store의 `accessToken`이 캐시의 정보 소스입니다.

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

**`EXPIRY_BUFFER_MS = 30_000`**: 만료 30초 전부터 `get()`이 null을 반환해 갱신을 트리거합니다.  
네트워크 지연을 고려한 여유 시간입니다.

---

## 4. 토큰 갱신 (`lib/auth/token/tokenRefresh.ts`)

401 응답 수신 시 `onUnauthorized` 콜백을 통해 토큰을 갱신합니다.  
갱신은 `POST /auth/token`을 다시 호출하는 방식입니다.

`apiClient`는 갱신 과정에서 Zustand·bridge에 직접 의존하지 않습니다.  
모두 `configureApiClient()`로 주입받은 콜백을 통해 처리됩니다.

동시 401 처리(여러 요청이 동시에 401을 받는 경우)는 `lib/auth/interceptor.ts`의 `pendingQueue`로 관리합니다.  
첫 번째 요청만 갱신을 시도하고 나머지는 큐에서 대기합니다.

일반 개발자가 알아야 할 수준의 요약(자동 재시도 동작)은 `06-api-client.md` 1장을 참고하세요.

---

## 5. apiClient 인증 설정 (DI 연결)

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
      onUnauthorized,            // 401 시 갱신 재시도 (onClearAuth는 주입하지 않음 — apiClient만 담당)
    });
  }, [setAuth, clearAuth]);
}
```

이 훅은 `app/WebviewLayoutClient.tsx`에서 마운트합니다(같은 곳에서 `useKeyRotation()`, `useTokenReceiver()`도 함께 마운트).

---

## 6. 로그아웃 흐름 내부 구현 (`features/auth/hooks/useAuth.ts`)

webview 모드:

```ts
// 1. 서버에 로그아웃 요청 (실패해도 클라이언트 상태는 초기화 — try/finally)
try {
  await authApi.logout();
} catch {
  // 서버 에러여도 클라이언트 상태 초기화는 계속 진행
} finally {
  // 2. 네이티브에 로그아웃 알림
  window.bridge?.logout();

  // 3. DPoP 키쌍 삭제 (실패해도 무시하고 계속 진행)
  await deleteDPoPKeyPair().catch(() => {});

  // 4. Zustand 상태 초기화 (내부에서 tokenCache.clear()도 호출)
  clearAuth();

  // 5. 로그인 화면으로 이동
  router.replace('/auth/simple');
}
```

native 모드(7장)는 서버 로그아웃 호출·웹 DPoP 키 삭제 없이, 네이티브가 세션 정리의 권위를 가집니다:

```ts
window.bridge?.logout();
clearAuth();
router.replace('/auth/simple');
```

로그아웃은 네이티브 이벤트(예: 세션 만료 알림)로도 트리거될 수 있습니다.  
Bridge 이벤트 처리는 `08-bridge-guide.md`를 참고하세요.  
일반 개발자를 위한 호출법 요약은 `05-auth-system.md` 3장을 참고하세요.

---

## 7. DPoP 처리 모드 — webview / native (`lib/auth/dpop/mode.ts`)

`NEXT_PUBLIC_DPOP_MODE` 환경변수로 두 모드를 전환할 수 있습니다.  
이 절은 **2-Lite** 방식(proof 서명만 네이티브 위임)을 설명합니다.  
설계 배경은 `docs/30-dpop-mode-switch-proposal.md` 3장·4장을 참고하세요.

| 모드 | 설명 |
|---|---|
| `webview` (기본) | 위 1~6장과 동일. 웹이 DPoP 키·proof를 자체 관리 |
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
- **apiClient/fileUploadClient 공개 API**: `resolveDpopMode() === 'native'`이어도 `fetch` 흐름(`withRefresh`)은 동일하게 사용되며, `get`/`post`/`put`/`delete` 시그니처·401 재시도 로직은 두 모드에서 동일합니다 — 달라지는 것은 DPoP proof 서명 주체뿐이므로 화면·서비스 호출부는 변경이 없습니다(`08-bridge-guide.md` 9장의 `getDPoPHeader()` 참고).
