# 보안 인프라 (`proxy.ts`) — CSP · 보안 헤더 · 인증 부트스트랩 구현

> 대상: 관리자  
> `proxy.ts`의 보안 헤더, CSP(nonce 포함), `(protected)/layout.tsx` 인증 부트스트랩의 실제 구현 상세를 다룹니다.  
> 일반 기능 개발(화면 추가, API 연동 등) 시에는 이 문서를 직접 다룰 일이 없습니다 — 개발자가 알아야 할 핵심 동작 요약은 [04-routing-architecture.md](./04-routing-architecture.md) 3장을 참고하세요.

---

## 1. proxy.ts — 보안 헤더 미들웨어

모든 요청은 `proxy.ts`를 통과합니다.  
보안 헤더 적용과 `/dev/*` 프로덕션 차단을 담당합니다.

### 보안 헤더

```ts
// proxy.ts에서 applySecurityHeaders() 적용

// 항상 적용
X-Frame-Options: DENY                         // 클릭재킹 방지
X-Content-Type-Options: nosniff               // MIME 스니핑 방지
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()

// 프로덕션에서만 추가
Strict-Transport-Security: max-age=31536000; includeSubDomains  // HSTS
```

### Content-Security-Policy (CSP)

환경에 따라 CSP 전략이 다릅니다.

**개발 환경** (`NODE_ENV=development`):

```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob: https:;
media-src 'self' blob: https:;
frame-src 'self' https://www.openstreetmap.org;
connect-src 'self' ws: wss: [NEXT_PUBLIC_API_BASE_URL];
```

Next.js HMR(Hot Module Reload)이 `unsafe-eval`과 WebSocket을 필요로 하기 때문입니다.

**프로덕션 환경**:

```
default-src 'self';
script-src 'self' 'nonce-{nonce}';
style-src 'self' 'nonce-{nonce}';
img-src 'self' data: blob: https:;
media-src 'self' blob: https:;
frame-src 'self' https://www.openstreetmap.org;
connect-src 'self' [NEXT_PUBLIC_API_BASE_URL];
object-src 'none';
```

`proxy.ts`가 요청마다 nonce를 자동 생성해 `x-nonce` 응답 헤더로 전달합니다.  
이 생성 과정은 `proxy.ts` 안에서 자동으로 처리되므로 개발자가 직접 신경 쓸 일은 없습니다. 실제로 nonce 값을 인라인 `<script>`/`<style>`에 붙여 쓰는 것은 **필수가 아니라 선택 사항**입니다 — 아래 "nonce 사용법"은 예외적으로 인라인 스크립트·스타일을 꼭 추가해야 할 때만 참고하면 됩니다. 인라인 스크립트·스타일은 원칙적으로 금지되어 있고(`26-roles-and-responsibilities.md` 3-5절) 현재 코드베이스에도 없으므로, `app/providers.tsx`가 전달받는 `nonce` prop은 실제로는 사용되지 않는 상태(`_nonce`)입니다.

- `img-src`/`media-src`는 파일 선택 결과(`data:`/`blob:`)와 업로드·백엔드 이미지(`https:`)를 허용합니다. `default-src 'self'`만으로는 미리보기 이미지가 렌더링되지 않습니다.
- `frame-src`는 GPS 결과 지도(OpenStreetMap embed)용입니다.
- `connect-src`에는 항상 `NEXT_PUBLIC_API_BASE_URL`이 포함됩니다(웹이 API 서버로 직접 연결).

### nonce 사용법 (선택 — 필수 아님)

nonce는 프로젝트에 필수가 아닌 선택 사항입니다. 인라인 스크립트·스타일은 원칙적으로 금지되어 있어 대부분의 경우 이 절차가 필요 없으며, 부득이하게 인라인 스크립트·스타일을 추가해야 하는 예외 상황에서만 아래와 같이 nonce를 적용하면 됩니다.

```tsx
// app/layout.tsx에서 nonce 수신
import { headers } from 'next/headers';

export default async function RootLayout({ children }) {
  const nonce = (await headers()).get('x-nonce') ?? '';
  return (
    <html>
      <head>
        <script nonce={nonce} src="..." />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 2. `(protected)` 라우트 보호 구현 상세

`(protected)/layout.tsx`는 마운트 시 미인증 상태(`isAuthenticated === false`)면 httpOnly refresh 쿠키로 세션 복구를 시도합니다. 실패하면 로그인 화면으로 리다이렉트합니다.

```tsx
// app/(protected)/layout.tsx (실제 구현 요약)
'use client';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { refreshFromCookie } from '@/lib/auth/token/tokenRefresh';

export default function ProtectedLayout({ children }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const setAuth         = useAuthStore(s => s.setAuth);

  useEffect(() => {
    if (isAuthenticated) return;

    let cancelled = false;
    refreshFromCookie((token, user) => setAuth(user, token)).catch(() => {
      if (cancelled) return;
      router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    });

    return () => { cancelled = true; };
  }, [isAuthenticated]);

  return <>{children}</>;
}
```

실제 접근 제어는 두 곳에서 이뤄집니다: ① 위 리다이렉트(비인증 사용자는 `/auth/login`으로 이동), ② 백엔드 API가 DPoP 액세스 토큰을 요구 — 미인증 상태로는 실데이터 API 호출이 실패합니다.  
화면 자체는 라우트 레벨 리다이렉트 외에, 필요 시 각 페이지가 `isAuthenticated`를 읽어 개별적으로 UI를 제한합니다(예: `app/(protected)/main/page.tsx`).

---

## 3. `/dev/*` 프로덕션 차단 (`proxy.ts`)

`/dev/*` 경로는 개발 전용 도구(IA 네비게이터, UI 카탈로그, 인증 디버그 등)이므로 프로덕션에서 노출되면 안 됩니다.

### 정책

| 환경 | 일반 페이지 | `/dev/*` |
|---|---|---|
| dev (`NODE_ENV=development`, `next dev`) | 전면 개방 | 접근 가능 |
| staging·prod (`NODE_ENV=production`, `next build`) | 전면 개방 | 차단(`/404` rewrite) |

### 동작 요약

```
요청 → proxy()
  ├─ NODE_ENV=development → 통과 (dev 전면 개방)
  └─ NODE_ENV=production
       ├─ /dev/* → /404 rewrite
       └─ 그 외 → 통과 (보안 헤더 적용 후 next())
```

`proxy.ts`는 위 차단 로직 통과 후 모든 응답에 보안 헤더(CSP, X-Frame-Options, HSTS 등)도 함께 적용합니다.

### 연관

- `/api/*`는 `proxy.ts`의 `config.matcher`에서 제외되어 이 미들웨어의 대상이 아니며, DPoP 액세스 토큰으로 별도 보호됩니다.
- `(protected)/layout.tsx`의 인증 부트스트랩·리다이렉트는 2장을 참고하세요.
