# 인증 시스템 (DPoP + 토큰 관리)

> 대상: 개발자  
> 인증 흐름 개요, Zustand AuthStore 사용법, 로그아웃 호출법을 다룹니다.  
> DPoP 키 관리·Proof 생성, 토큰 캐시·갱신, apiClient DI 연결 등 내부 구현과 webview/native 모드 전환 상세는 관리자 문서 참고: [32-auth-dpop-internals.md](./32-auth-dpop-internals.md)

---

## 1. 인증 흐름 개요 (webview 모드)

이 앱은 Native WebView 환경에서 동작합니다.  
네이티브 앱이 사용자 인증을 담당하고, 웹에서는 네이티브로부터 Authorization Code를 받아 Access Token으로 교환합니다.

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
| `setAuth(user, token)` | 로그인 완료 시 상태 저장 (webview·native 공통, 상세: `32-auth-dpop-internals.md` 7장) — `_accessToken` 갱신 |
| `clearAuth()` | 로그아웃 시 상태·토큰 캐시 초기화 |
| `setInitialized()` | 부트스트랩 완료 표시 |

---

## 3. 로그아웃 (`features/auth/hooks/useAuth.ts`)

컴포넌트에서는 `useAuth().logout()`을 호출하면 됩니다.

```ts
import { useAuth } from '@/features/auth/hooks/useAuth';

const { logout } = useAuth();
await logout(); // 서버 로그아웃 → 네이티브 알림 → 키·상태 초기화 → 로그인 화면 이동
```

내부적으로 서버 로그아웃 요청, DPoP 키쌍 삭제, Zustand 상태 초기화, `/auth/simple`로 이동까지 순서대로 처리됩니다(webview·native 모드에 따라 세부 단계 차이 있음).  
로그아웃은 네이티브 이벤트(예: 세션 만료 알림)로도 트리거될 수 있습니다. Bridge 이벤트 처리는 `08-bridge-guide.md`를 참고하세요.  
내부 구현 상세는 `32-auth-dpop-internals.md` 6장을 참고하세요.
