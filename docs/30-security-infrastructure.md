# 보안 인프라 (`proxy.ts`) — CSP · 보안 헤더 · 인증 게이트 구현

> 대상: 관리자  
> `proxy.ts`의 보안 헤더, CSP(nonce 포함), WebView 인증 게이트, `(protected)/layout.tsx` SSO 부트스트랩의 실제 구현 상세를 다룹니다.  
> 일반 기능 개발(화면 추가, API 연동 등) 시에는 이 문서를 직접 다룰 일이 없습니다 — 개발자가 알아야 할 핵심 동작 요약은 [04-routing-architecture.md](./04-routing-architecture.md) 3장을 참고하세요.

---

## 1. proxy.ts — 보안 헤더 및 인증 미들웨어

모든 요청은 `proxy.ts`를 통과합니다.  
보안 헤더 적용과 인증 체크를 담당합니다.

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

- `img-src`/`media-src`는 카메라·갤러리 결과(`data:`/`blob:`)와 업로드·백엔드 이미지(`https:`)를 허용합니다. `default-src 'self'`만으로는 카메라 결과물이 렌더링되지 않습니다.
- `frame-src`는 GPS 결과 지도(OpenStreetMap embed)용입니다.
- `NEXT_PUBLIC_DPOP_MODE=native`일 때는 `connect-src`에서 `NEXT_PUBLIC_API_BASE_URL`이 빠집니다(웹이 API를 직접 호출하지 않으므로). 상세는 `32-auth-dpop-internals.md` 7장.

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

`(protected)/layout.tsx`는 미인증 상태를 로그인 화면으로 **리다이렉트하지 않습니다.**  
대신 webview-code SSO를 자동 수행해 웹뷰 자체 토큰을 발급받습니다(네이티브 로그인 세션과 웹뷰 세션은 별개이므로).

```tsx
// app/(protected)/layout.tsx (실제 구현 요약)
'use client';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { initAuthFromCode } from '@/lib/auth/authService';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';
import { requestNativeToken } from '@/lib/bridge/bridgeActions';
import { resolveDpopMode } from '@/lib/auth/dpop/mode';

export default function ProtectedLayout({ children }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const setAuth         = useAuthStore(s => s.setAuth);

  useEffect(() => {
    if (isAuthenticated) return;
    if (typeof window === 'undefined' || !window.bridge) return; // 브라우저는 스킵

    if (resolveDpopMode() === 'native') {
      requestNativeToken().catch(console.warn);            // 2-Lite: 네이티브 세션 토큰 요청
      return;
    }

    const unsub = bridgeEventBus.on('appAuthCode', async ({ code }) => {
      await initAuthFromCode(code, setAuth);
    });
    window.bridge.requestAuthCode();
    return unsub;
  }, [isAuthenticated]);

  return <>{children}</>;
}
```

실제 접근 제어는 두 곳에서 이뤄집니다: ① `proxy.ts`의 WebView UA 게이트(1장, 3장) — 일반 브라우저는 `/blocked`로 차단, ② 백엔드 API가 DPoP 액세스 토큰을 요구 — 미인증 상태로는 실데이터 API 호출이 실패합니다.  
화면 자체는 라우트 레벨에서 강제 리다이렉트되지 않으며, 필요 시 각 페이지가 `isAuthenticated`를 읽어 개별적으로 UI를 제한합니다(예: `app/(protected)/main/page.tsx`).

---

## 3. WebView 전용 접근 게이트 (`proxy.ts`)

모든 페이지는 네이티브 앱 WebView를 통해서만 접근해야 합니다.  
`proxy.ts`가 서버단에서 이를 강제합니다(클라이언트 가드와 달리 SSR 셸도 노출되지 않음).

### 정책

| 환경 | 일반 페이지 | `/dev/*` |
|---|---|---|
| dev (`NODE_ENV=development`, `next dev`) | 전면 개방(게이트 없음) | 접근 가능 |
| staging·prod (`NODE_ENV=production`, `next build`) | **네이티브(WebView)만 허용**, 그 외 `/blocked` | 차단(`/404` rewrite) |

### 식별 방식 — User-Agent 마커

네이티브 WebView가 User-Agent에 `WEBVIEW_UA_MARKER`(현재 `'HPointApp'`)를 포함시킵니다.  
middleware는 비-dev에서 이 토큰이 없는 요청을 모두 `/blocked`로 rewrite합니다.

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

`proxy.ts`는 게이트 통과 후 모든 응답에 보안 헤더(CSP, X-Frame-Options, HSTS 등)도 함께 적용합니다.  
CSP `connect-src`에는 `NEXT_PUBLIC_DPOP_MODE`와 무관하게 항상 API 오리진이 포함됩니다 — 2-Lite는 webview·native 두 모드 모두 웹이 서버로 직접 연결하기 때문입니다(`32-auth-dpop-internals.md` 7장).

### 연관

- `/blocked` 안내 페이지: `app/blocked/page.tsx` (라우트 그룹 밖, 게이트 예외).
- `(protected)/layout.tsx`: 미인증 시 로그인 화면으로 **리다이렉트하지 않습니다.** 대신 webview-code SSO를 자동 수행합니다(`requestAuthCode` → `initAuthFromCode` → `setAuth`, dev·prod 공통 적용, 2장). 브라우저(`window.bridge` 없음)에서는 스킵됩니다. native 모드에서는 이 부트스트랩 자체를 건너뜁니다(인증 상태는 `32-auth-dpop-internals.md` 7장의 `authState` 수신으로 채워짐). 화면 단위 접근 제어는 각 페이지가 `isAuthenticated`를 읽어 개별 처리합니다(예: `app/(protected)/main/page.tsx`의 메뉴 항목별 `requiresAuth` 블록).
- `/api/*`는 `proxy.ts`의 `config.matcher`에서 제외되어 이 게이트의 대상이 아니며, DPoP 토큰(네이티브 전용)으로 별도 보호됩니다.

### 한계 / 주의

- User-Agent는 위조 가능한 소프트 게이트입니다. 단 `(protected)` 실데이터는 네이티브 전용 DPoP 액세스 토큰이 필요해 별도로 보호됩니다.
- 향후 앱 링크용 `/.well-known/assetlinks.json`·`apple-app-site-association`을 추가하면 OS가 WebView UA 없이 가져가므로 `proxy.ts`에서 해당 경로를 **예외 처리**해야 합니다.
- 로컬에서 prod 빌드(`next start`)로 테스트하면 `NODE_ENV=production`이라 게이트가 켜져 막힙니다 — UA 마커를 포함한 요청으로 테스트하세요.
