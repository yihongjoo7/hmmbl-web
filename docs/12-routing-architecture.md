# 라우팅 아키텍처 및 보안 미들웨어

> 대상: 개발자  
> Next.js 14 App Router 구조, 라우트 그룹, proxy.ts 보안 헤더 설정을 다룹니다.  
> ⚠️ 보안/인증 미들웨어 파일명은 `middleware.ts`가 아니라 `proxy.ts`(export 함수명 `proxy`)입니다. WebView UA 게이트 상세는 `13-auth-system.md` §10을 참고하세요.

---

## 1. App Router 라우트 그룹

이 프로젝트는 Next.js App Router의 **라우트 그룹**으로 인증 필요 여부를 분리합니다.

```
app/
├── (protected)/          # webview SSO 부트스트랩 라우트 (§4)
│   ├── layout.tsx
│   ├── earn/ use/ pay/ my/ main/ settings/ footer/
│   └── member/ menu/ search/ terms/ file-upload-test/
│
├── (public)/             # 부트스트랩 없는 라우트
│   ├── layout.tsx
│   ├── intro/            # 온보딩
│   ├── auth/             # 인증 플로우
│   ├── member/           # 회원가입
│   ├── use/              # shop, coupon-deal (일부 화면은 비인증 접근)
│   └── menu/             # settings, cs (레거시 메뉴 경로)
│
├── dev/                  # 개발 도구 (빌드에서 제외 권장, §3 /dev/* 프로덕션 차단)
│   ├── ia/               # IA 네비게이터
│   ├── pub/              # 퍼블리셔 화면 미리보기
│   ├── ui/                # UI 컴포넌트 카탈로그
│   ├── ref/               # 코드 레퍼런스
│   ├── auth/, bridge/, member-list/, campaign-test/, _components/
│
├── blocked/              # WebView UA 게이트 차단 안내 (라우트 그룹 밖, 게이트 예외)
├── api/                  # Route Handler (/api/messages, /api/translate 등)
├── layout.tsx            # 루트 레이아웃 (Providers 포함)
├── providers.tsx         # QueryClient, Toast 등 전역 Provider
├── WebviewLayoutClient.tsx  # 인증 인터셉터·키 로테이션·토큰 수신 훅 마운트 (13-auth-system.md §7)
├── LocaleProvider.tsx    # i18n 로케일 provider
└── global-error.tsx      # 루트 레이아웃을 포함한 전역 에러
```

라우트 그룹 `(protected)`, `(public)`은 URL 경로에 포함되지 않습니다. `/earn/mission`은 `app/(protected)/earn/mission/page.tsx`에서 처리됩니다.

⚠️ `use`·`menu`는 `(protected)`와 `(public)` 양쪽에 모두 존재합니다(도메인은 같지만 인증 요건이 화면별로 다름). 새 화면을 추가할 때는 해당 화면이 webview SSO 부트스트랩(§4)이 필요한지 먼저 확인하고 그룹을 선택하세요.

---

## 2. 파일 컨벤션

| 파일 | 역할 |
|---|---|
| `page.tsx` | 라우트 진입점. Next.js가 인식하는 유일한 라우트 파일 |
| `layout.tsx` | 라우트 그룹 또는 하위 경로에 적용되는 레이아웃 |
| `loading.tsx` | Suspense 기반 로딩 UI (스켈레톤 등) |
| `error.tsx` | 라우트 에러 바운더리 |
| `not-found.tsx` | 404 처리 |
| `global-error.tsx` | 루트 레이아웃을 포함한 전역 에러 |

### page.tsx 작성 패턴

`page.tsx`는 가능한 얇게 유지하고, 실제 로직은 `*Page.tsx` 컴포넌트에 위임합니다.

```tsx
// app/(protected)/earn/mission/page.tsx
import { MissionPage } from '@/features/earn/mission/MissionPage';

export default function Page() {
  return <MissionPage />;
}
```

### 동적 라우트

```
app/(protected)/earn/mission/[id]/page.tsx   → /earn/mission/123
app/(protected)/earn/quiz/[id]/page.tsx      → /earn/quiz/abc
```

동적 파라미터는 Page 컴포넌트에서 `useParams()`로 접근합니다.

```tsx
// features/earn/mission/MissionDetailPage.tsx
'use client';
import { useParams } from 'next/navigation';

export function MissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  // ...
}
```

---

## 3. proxy.ts — 보안 헤더 및 인증 미들웨어

모든 요청은 `proxy.ts`를 통과합니다. 보안 헤더 적용과 인증 체크를 담당합니다.

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

nonce 기반 CSP를 사용합니다. 요청마다 새 nonce를 생성하고, `x-nonce` 응답 헤더로 전달합니다.

- `img-src`/`media-src`는 카메라·갤러리 결과(`data:`/`blob:`)와 업로드·백엔드 이미지(`https:`)를 허용합니다. `default-src 'self'`만으로는 카메라 결과물이 렌더링되지 않습니다.
- `frame-src`는 GPS 결과 지도(OpenStreetMap embed)용입니다.
- `NEXT_PUBLIC_DPOP_MODE=native`일 때는 `connect-src`에서 `NEXT_PUBLIC_API_BASE_URL`이 빠집니다(웹이 API를 직접 호출하지 않으므로). 상세는 `13-auth-system.md` §9.

### nonce 사용법

인라인 스크립트·스타일에 nonce를 적용해야 하는 경우:

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

## 4. 라우트별 보호 처리

`(protected)/layout.tsx`는 미인증 상태를 로그인 화면으로 **리다이렉트하지 않습니다.** 대신 webview-code SSO를 자동 수행해 웹뷰 자체 토큰을 발급받습니다(네이티브 로그인 세션과 웹뷰 세션은 별개이므로).

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

실제 접근 제어는 두 곳에서 이뤄집니다: ① `proxy.ts`의 WebView UA 게이트(§3, `13-auth-system.md` §10) — 일반 브라우저는 `/blocked`로 차단, ② 백엔드 API가 DPoP 액세스 토큰을 요구 — 미인증 상태로는 실데이터 API 호출이 실패합니다. 화면 자체는 라우트 레벨에서 강제 리다이렉트되지 않으며, 필요 시 각 페이지가 `isAuthenticated`를 읽어 개별적으로 UI를 제한합니다(예: `app/(protected)/main/page.tsx`).

---

## 5. WebviewLayout

웹뷰 전용 레이아웃 컴포넌트(`WebviewLayoutClient.tsx`)는 GNB·FNB 등 네이티브 앱 UI를 고려한 padding과 safe-area를 적용합니다. 레이아웃 관련 상세 내용은 `04-layout-guide.md`를 참고하세요.

---

## 6. 신규 라우트 추가 절차

1. `app/(protected)` 또는 `app/(public)` 아래 경로에 `page.tsx` 생성
2. `features/[domain]/[screen]/` 아래 `*Page.tsx` 생성 (개발자)
3. 퍼블리셔에게 `*View.tsx` 작업 요청
4. `app/dev/ia/_data/ia.ts`에 IA 항목 추가

```ts
// ia.ts 항목 추가 예시
{ id: 'new-screen', label: '새 화면', path: '/earn/new-screen', children: [] }
```
