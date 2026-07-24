# DPoP 인증 내부 구현

> 대상: 관리자  
> DPoP 키 관리·Proof 생성, 로그인/토큰 갱신, 토큰 캐시, apiClient 인증 DI 연결, 로그아웃 내부 구현의 실제 구현 상세를 다룹니다.  
> 일반 기능 개발(화면 추가, API 연동 등) 시에는 이 문서를 직접 다룰 일이 없습니다 — 개발자가 알아야 할 핵심 사용법은 [05-auth-system.md](./05-auth-system.md)를 참고하세요.

---

## 1. DPoP 키 관리 및 Proof 생성 (`lib/auth/dpop/proofGenerator.ts`)

DPoP(Demonstrating Proof of Possession, RFC 9449)는 API 요청 시 토큰 도용을 방지하는 보안 메커니즘입니다.  
매 요청마다 요청 URL과 메서드를 포함한 JWT를 생성해 `DPoP` 헤더로 전송합니다. 웹이 ES256 키쌍을 자체 생성·보관하고 매 proof를 직접 서명합니다.

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
  "htu": "https://api.../auth/login",  // URL (쿼리스트링 제외)
  "iat": 1234567890           // 발급 시각 (Unix timestamp)
}
```

`lib/auth/dpop/proofProvider.ts::getDPoPHeader(url, method)`는 apiClient/fileUploadClient가 사용하는 진입점으로, 내부적으로 `createDPoPProof()`를 그대로 호출하는 얇은 래퍼입니다.

---

## 2. 로그인 (`features/auth/services/authApi.ts`)

```ts
import { authApi } from '@/features/auth/services/authApi';

const { accessToken, user } = await authApi.login(email, password);
useAuthStore.getState().setAuth(user, accessToken);
```

내부 동작:

1. `createDPoPProof(\`${baseUrl}/auth/login\`, 'POST')` 호출 — 토큰 발급 엔드포인트는 미로그인 상태에서도 DPoP가 필수이므로 apiClient(토큰 게이팅)를 거치지 않고 직접 호출합니다.
2. `POST /auth/login` — `{ email, password }`, `credentials:'include'`(refresh 토큰은 httpOnly 쿠키로 수신)
3. 응답 `{ access_token, expires_in, user }` → `LoginPage`가 `setAuth(user, accessToken)` 호출

`authApi.ts`는 `features/` 레이어이므로 이 함수는 `features/auth/login/LoginPage.tsx`에서만 호출됩니다.

---

## 3. 토큰 캐시 (`lib/auth/token/tokenCache.ts`)

Access Token을 메모리에 캐싱합니다.  
페이지 새로고침 시 캐시가 초기화되므로, 새로고침 후에는 4장의 쿠키 기반 갱신으로 세션을 복구합니다.

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

`refreshFromCookie(onSuccess)`는 httpOnly refresh 쿠키(`credentials:'include'`)로 `POST /auth/refresh`를 호출해 새 액세스 토큰을 발급받습니다. 두 곳에서 사용됩니다.

- **세션 복구**: `(protected)/layout.tsx` 마운트 시 `isAuthenticated`가 false면 호출 — 실패 시 `/auth/login?redirect=...`로 리다이렉트
- **401 재시도**: `lib/auth/interceptor.ts`의 `onUnauthorized` 콜백에서 호출

`apiClient`는 갱신 과정에서 Zustand에 직접 의존하지 않습니다. 모두 `configureApiClient()`로 주입받은 콜백을 통해 처리됩니다.

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

이 훅은 `app/WebviewLayoutClient.tsx`에서 마운트합니다.

---

## 6. 로그아웃 흐름 내부 구현 (`features/auth/hooks/useAuth.ts`)

```ts
// 1. 서버에 로그아웃 요청 (실패해도 클라이언트 상태는 초기화 — try/finally)
try {
  await authApi.logout();
} catch {
  // 서버 에러여도 클라이언트 상태 초기화는 계속 진행
} finally {
  // 2. DPoP 키쌍 삭제 (실패해도 무시하고 계속 진행)
  await deleteDPoPKeyPair().catch(() => {});

  // 3. Zustand 상태 초기화 (내부에서 tokenCache.clear()도 호출)
  clearAuth();

  // 4. 로그인 화면으로 이동
  router.replace('/auth/login');
}
```

일반 개발자를 위한 호출법 요약은 `05-auth-system.md` 3장을 참고하세요.
