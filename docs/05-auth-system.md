# 인증 시스템 (DPoP + 토큰 관리)

> 대상: 개발자  
> 인증 흐름 개요, Zustand AuthStore 사용법, 로그아웃 호출법을 다룹니다.  
> DPoP 키 관리·Proof 생성, 토큰 캐시·갱신, apiClient DI 연결 등 내부 구현 상세는 관리자 문서 참고: [31-auth-dpop-internals.md](./31-auth-dpop-internals.md)

---

## 1. 인증 흐름 개요

이메일/비밀번호로 로그인하고, 액세스 토큰은 메모리에만 보관합니다(새로고침 시 소실). 갱신은 로그인 시 발급되는 httpOnly refresh 쿠키로 조용히 수행됩니다.

```
/auth/login (이메일/비밀번호 입력)
      │
      ▼
authApi.login(email, password)     ← POST /auth/login + DPoP Proof
      │
      ▼
Access Token + User 정보 수신        (refresh 토큰은 httpOnly 쿠키로 별도 수신)
      │
      ▼
useAuthStore.setAuth(user, token)  ← Zustand 저장
      │
      ▼
tokenCache.set(token, expiresIn)   ← 메모리 캐시
      │
      ▼
apiClient 이후 요청에서 자동 사용
```

**세션 복구(새로고침 등):** `(protected)/layout.tsx`가 마운트 시 `isAuthenticated`가 false면 httpOnly refresh 쿠키로 `POST /auth/refresh`를 호출해 조용히 세션을 복구합니다. 실패하면 `/auth/login?redirect=<원래 경로>`로 리다이렉트합니다.

**401 재시도:** API 호출 중 401이 오면 `lib/auth/interceptor.ts`가 동일한 `/auth/refresh` 흐름으로 토큰을 갱신한 뒤 요청을 재시도합니다.

---

## 2. Zustand AuthStore (`features/auth/hooks/useAuthStore.ts`)

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
| `setAuth(user, token)` | 로그인 완료 시 상태 저장 — `_accessToken` 갱신 |
| `clearAuth()` | 로그아웃 시 상태·토큰 캐시 초기화 |
| `setInitialized()` | 부트스트랩 완료 표시 |

---

## 3. 로그아웃 (`features/auth/hooks/useAuth.ts`)

컴포넌트에서는 `useAuth().logout()`을 호출하면 됩니다.

```ts
import { useAuth } from '@/features/auth/hooks/useAuth';

const { logout } = useAuth();
await logout(); // 서버 로그아웃 → 키·상태 초기화 → /auth/login 이동
```

내부적으로 서버 로그아웃 요청(`POST /auth/logout`), DPoP 키쌍 삭제, Zustand 상태 초기화, `/auth/login`으로 이동까지 순서대로 처리됩니다.  
내부 구현 상세는 `31-auth-dpop-internals.md` 6장을 참고하세요.
