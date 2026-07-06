# 프로젝트 구조 및 레이어 아키텍처

> 대상: 개발자  
> 이 문서는 hpoint-mobile 프로젝트의 전체 디렉토리 구조와 레이어 간 의존성 규칙을 설명합니다.

---

## 1. 디렉토리 구조

```
hpoint-mobile/
├── app/                        # Next.js App Router 라우트
│   ├── (protected)/            # webview SSO 부트스트랩 라우트 그룹 (인증 리다이렉트 없음)
│   ├── (public)/                # 부트스트랩 없는 라우트 그룹
│   ├── api/                    # Route Handler
│   ├── dev/                    # 개발 도구 (ia / pub / ui / ref / auth / bridge 등)
│   ├── blocked/                 # WebView UA 게이트 차단 안내 페이지
│   ├── layout.tsx              # 루트 레이아웃
│   ├── providers.tsx           # QueryClient / Toast 등 전역 Provider
│   ├── WebviewLayoutClient.tsx # 인증 인터셉터·키 로테이션·토큰 수신 훅 마운트
│   ├── LocaleProvider.tsx      # i18n 로케일 provider
│   └── global-error.tsx        # 전역 에러 바운더리
│
├── features/                   # 도메인별 비즈니스 로직
│   ├── _templates/             # Page·View 템플릿 파일
│   ├── shared/                 # 도메인 공통 컴포넌트·훅·서비스
│   ├── auth/                   # 인증 도메인
│   ├── earn/                   # 적립
│   ├── use/                    # 사용
│   ├── pay/                    # 결제
│   ├── my/                     # 마이페이지
│   ├── main/                   # 메인
│   ├── member/                 # 회원
│   ├── settings/               # 설정
│   ├── footer/                 # 하단
│   ├── intro/                  # 온보딩
│   ├── menu/                   # 메뉴
│   └── search/                 # 통합검색
│
├── lib/                        # 순수 인프라 레이어 (의존성 없음)
│   ├── api/                    # HTTP 클라이언트
│   │   ├── apiClient.ts        # DPoP 인증 클라이언트
│   │   └── fileUploadClient.ts # 파일 업로드 클라이언트
│   ├── auth/                   # 인증 인프라
│   │   ├── dpop/               # DPoP 키쌍·Proof 생성 (proofProvider.ts: 모드별 서명 주체 분기)
│   │   ├── token/              # 토큰 캐시·갱신
│   │   └── authService.ts      # Authorization Code 교환
│   ├── bridge/                 # Native Bridge
│   │   ├── bridgeClient.ts     # 이벤트 버스·화이트리스트
│   │   ├── bridgeActions.ts    # 네이티브 기능 래퍼 함수 (requestNativeToken 포함, §13-auth-system.md §9)
│   │   ├── bridgeProtocol.ts   # Bridge 프로토콜 타입
│   │   ├── appVersion.ts       # 앱 버전 캐시·비교
│   │   ├── bridgeEventBus.ts, bridge.ts, bridgeErrorCodes.ts # 하위 호환 re-export
│   │   └── index.ts            # Public API barrel
│   ├── config/                 # 환경변수·설정 접근
│   ├── i18n/                   # next-intl 설정·헬퍼
│   ├── navigation/              # ⚠️ navigation.ts는 빈 스텁, 미구현
│   ├── logger/                 # 서버 로깅
│   └── utils/                  # 순수 유틸리티
│       ├── errorMessages.ts    # 폴백 메시지 상수
│       └── formErrors.ts       # react-hook-form 필드 에러 매핑
│
├── components/
│   └── common/
│       └── ui/                 # 순수 UI 컴포넌트 (비즈니스 로직 없음)
│           ├── action/         # Button, FilterChip, BubbleButton
│           ├── display/        # Badge, Card, Spinner, Skeleton, EmptyState...
│           ├── input/          # Input, Textarea, Select, Toggle, SearchBar...
│           ├── navigation/     # Pagination, Breadcrumb, Stepper...
│           └── overlay/        # Toast, Modal, ConfirmDialog, BottomSheet...
│
├── hooks/                      # 전역 Zustand store 훅
│   ├── useToastStore.ts
│   ├── useModalStore.ts
│   ├── useSystemAlert.ts
│   ├── useAuthStore.ts         # ⚠️ 빈 스텁, 미사용 (실제 인증 스토어는 features/auth/hooks/useAuthStore.ts)
│   └── useBottomSheetStore.ts  # ⚠️ 빈 스텁, 미구현
│
├── types/                      # 전역 타입 정의
│   ├── api.ts                  # ApiResponse, ApiError 등
│   ├── bridge.ts               # NativeBridge 인터페이스
│   └── errors.ts               # ErrorCode 상수
│
├── styles/
│   └── globals.css             # CSS 변수 기반 디자인 토큰
│
├── proxy.ts               # 보안 헤더·인증 미들웨어
├── instrumentation.ts          # 요청 에러 로깅
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── commitlint.config.js
└── .eslintrc.json
```

---

## 2. 레이어 아키텍처

프로젝트는 4개 레이어로 구성되며, **단방향 의존만 허용**합니다.

```
┌─────────────────────────────────────────────┐
│  app/  (Next.js 라우트 · Provider)            │
├─────────────────────────────────────────────┤
│  features/  (도메인 로직 · Page · View)       │
├─────────────────────────────────────────────┤
│  components/common/ui/  (순수 UI 컴포넌트)    │
├─────────────────────────────────────────────┤
│  lib/  (순수 인프라 · 유틸리티)                │
└─────────────────────────────────────────────┘

의존 방향: app → features → lib (역방향 금지)
```

### 레이어별 규칙

| 레이어 | 허용 | 금지 |
|---|---|---|
| `lib/` | `types/`, fetch API, WebCrypto, IndexedDB | `features/`, `hooks/`, bridge 직접 import, Zustand |
| `components/common/ui/` | `lib/utils/`, Tailwind, antd-mobile | `features/`, `hooks/`, API 호출 |
| `features/` | `lib/`, `components/`, `hooks/`, `types/` | 다른 feature 직접 import (shared 경유) |
| `app/` | 모든 레이어 | — |

### `lib/` 순수성 규칙 (핵심)

`lib/`는 bridge·Zustand·React에 의존하지 않습니다. 외부 동작이 필요한 경우 **콜백 DI(Dependency Injection)** 패턴으로 주입받습니다.

```ts
// ✅ 올바른 패턴 — 콜백으로 주입 (accessToken은 store state가 아니라 모듈 변수 getter)
configureApiClient({
  getToken:       getAccessToken, // '@/features/auth/hooks/useAuthStore'의 동기 getter
  onUnauthorized: handleUnauthorized,
  onClearAuth:    () => useAuthStore.getState().clearAuth(),
});

// ❌ 금지 패턴 — lib에서 Zustand 직접 import
import { useAuthStore } from '@/features/auth/hooks/useAuthStore'; // lib에서 사용 불가
```

---

## 3. features 도메인 구조

각 도메인은 아래 구조를 따릅니다.

```
features/[domain]/
├── [screen]/
│   ├── [ScreenName]Page.tsx        # 데이터 페칭·라우팅 (개발자)
│   ├── [ScreenName]View.tsx        # UI 렌더링 (퍼블리셔)
│   └── components/                 # 해당 화면 전용 서브컴포넌트
├── services/
│   └── [domain]Api.ts              # API 호출 함수
├── hooks/
│   └── use[ScreenName].ts          # 화면 전용 훅
└── types/
    └── index.ts                    # 도메인 타입 정의
```

도메인 간 공유가 필요한 컴포넌트·훅·서비스는 `features/shared/`에 둡니다.

---

## 4. Page / View 역할 분리

| 파일 | 작성자 | 역할 |
|---|---|---|
| `*Page.tsx` | 개발자 | React Query로 데이터 페칭, 라우팅 처리, View에 props 전달 |
| `*View.tsx` | 퍼블리셔 | props만 받아 UI 렌더링, 로딩·에러·빈 상태 3종 구현 |
| `app/**/page.tsx` | 개발자 | Next.js 라우트 파일, Page 컴포넌트 렌더링 |

```
app/(protected)/earn/mission/page.tsx
  └── features/earn/mission/MissionPage.tsx   ← 개발자
        └── features/earn/mission/MissionView.tsx  ← 퍼블리셔
```

---

## 5. instrumentation.ts — 요청 에러 로깅

`instrumentation.ts`는 Next.js 서버 런타임 초기화 및 요청 에러 캡처에 사용됩니다.

```ts
// instrumentation.ts
import { logger } from '@/lib/logger';

export async function register() {
  // 런타임 초기화 — 필요 시 여기에 추가
}

export async function onRequestError(
  err: { digest?: string } & Error,
  request: { path: string; method: string },
  context: { routerKind: string; routePath: string }
) {
  logger.error({ err, request, context }, 'Request error captured');
}
```

- `register()`: 서버 시작 시 1회 실행 (외부 SDK 초기화 등)
- `onRequestError()`: 처리되지 않은 서버 요청 에러를 `logger.error`로 전송
- 클라이언트 에러는 `app/global-error.tsx`에서 처리

---

## 6. 주요 설정 파일 역할

| 파일 | 역할 |
|---|---|
| `next.config.mjs` | `allowedDevOrigins`, `images.remotePatterns` |
| `proxy.ts` | CSP, X-Frame-Options, HSTS, 인증 체크 |
| `tailwind.config.ts` | CSS 변수 연동 Tailwind 확장 설정 |
| `styles/globals.css` | 디자인 토큰 (CSS 변수) 정의 |
| `commitlint.config.js` | 커밋 메시지 컨벤션 |
| `.eslintrc.json` | TypeScript strict ESLint 규칙 |
