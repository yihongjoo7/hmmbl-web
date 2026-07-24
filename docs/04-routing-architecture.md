# 라우팅 아키텍처 및 보안 미들웨어

> 대상: 개발자  
> Next.js 14 App Router 구조, 라우트 그룹, 라우트 보호 개요를 다룹니다.  
> ⚠️ 보안/인증 미들웨어 파일명은 `middleware.ts`가 아니라 `proxy.ts`(export 함수명 `proxy`)입니다.  
> WebView UA 게이트, `proxy.ts`의 CSP·보안 헤더·nonce·SSO 부트스트랩 구현 상세는 관리자 문서 [31-security-infrastructure.md](./31-security-infrastructure.md)를 참고하세요.

---

## 1. App Router 라우트 그룹

이 프로젝트는 Next.js App Router의 **라우트 그룹**으로 인증 필요 여부를 분리합니다.

```
app/
├── (protected)/          # webview SSO 부트스트랩 라우트 (3장)
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
├── dev/                  # 개발 도구 (빌드에서 제외 권장, 3장 /dev/* 프로덕션 차단)
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
├── WebviewLayoutClient.tsx  # 인증 인터셉터·키 로테이션·토큰 수신 훅 마운트 (32-auth-dpop-internals.md 5장)
├── LocaleProvider.tsx    # i18n 로케일 provider
└── global-error.tsx      # 루트 레이아웃을 포함한 전역 에러
```

라우트 그룹 `(protected)`, `(public)`은 URL 경로에 포함되지 않습니다.  
`/earn/mission`은 `app/(protected)/earn/mission/page.tsx`에서 처리됩니다.

⚠️ `use`·`menu`라는 이름의 폴더가 `(protected)`와 `(public)` 양쪽에 각각 하나씩 존재합니다.  
도메인 이름은 같지만 그 안에 들어있는 화면은 서로 다르며, 화면 하나하나의 인증 요건에 따라 어느 그룹에 속할지가 갈립니다.

- `(protected)/use/`: 로그인(webview SSO)이 필요한 "사용" 화면들
- `(public)/use/`: `shop`, `coupon-deal` 등 로그인 없이도 볼 수 있는 일부 "사용" 화면
- `(protected)/menu/`: 로그인이 필요한 메뉴 화면들
- `(public)/menu/`: `settings`, `cs` 등 로그인 없이 접근 가능한 레거시 메뉴 경로

즉 `use`·`menu` 폴더 자체가 인증 여부를 결정하지 않습니다.  
새 화면을 추가할 때는 "폴더 이름"이 아니라 "이 화면이 로그인이 필요한가"를 먼저 판단해야 합니다.  
판단 기준은 해당 화면이 webview SSO 부트스트랩(3장) — 네이티브 앱이 이미 로그인된 사용자 세션을 웹뷰에 자동으로 넘겨주는 절차 — 을 필요로 하는지입니다.  
필요하면 `(protected)`에, 필요 없으면(비로그인 상태에서도 접근 가능해야 하면) `(public)`에 화면을 추가하세요.

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

## 3. 라우트 보호 개요

모든 요청은 `proxy.ts`를 통과하며, 보안 헤더 적용과 인증 체크를 담당합니다. 개발자가 알아야 할 핵심은 다음과 같습니다.

- `(protected)/layout.tsx`는 미인증 상태를 로그인 화면으로 **리다이렉트하지 않습니다.** 대신 webview-code SSO를 자동 수행해 웹뷰 자체 토큰을 발급받습니다(네이티브 로그인 세션과 웹뷰 세션은 별개이므로). 새 화면을 만들 때 별도의 로그인 리다이렉트 로직을 추가할 필요가 없습니다.
- 실제 접근 제어는 두 곳에서 이뤄집니다: ① `proxy.ts`의 WebView UA 게이트 — 일반 브라우저는 `/blocked`로 차단, ② 백엔드 API가 DPoP 액세스 토큰을 요구 — 미인증 상태로는 실데이터 API 호출이 실패합니다.
- 화면 자체는 라우트 레벨에서 강제 리다이렉트되지 않으며, 필요 시 각 페이지가 `isAuthenticated`를 읽어 개별적으로 UI를 제한합니다(예: `app/(protected)/main/page.tsx`).

`proxy.ts`의 CSP·보안 헤더·nonce·`(protected)/layout.tsx` SSO 부트스트랩 실제 구현은 관리자 문서 참고: [31-security-infrastructure.md](./31-security-infrastructure.md)

> 자세한 인증 흐름: `05-auth-system.md` 1장

---

## 4. WebviewLayout

웹뷰 전용 레이아웃 컴포넌트(`WebviewLayoutClient.tsx`)는 GNB·FNB 등 네이티브 앱 UI를 고려한 padding과 safe-area를 적용합니다.  
레이아웃 관련 상세 내용은 `12-layout-guide.md`를 참고하세요.

---

## 5. 신규 라우트 추가 절차

1. `app/(protected)` 또는 `app/(public)` 아래 경로에 `page.tsx` 생성
2. `features/[domain]/[screen]/` 아래 `*Page.tsx` 생성 (개발자)
3. 퍼블리셔에게 `*View.tsx` 작업 요청
4. `app/dev/ia/_data/ia.ts`에 IA 항목 추가

```ts
// ia.ts 항목 추가 예시
{ id: 'new-screen', label: '새 화면', path: '/earn/new-screen', children: [] }
```
