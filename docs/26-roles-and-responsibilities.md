# 퍼블리셔 · 개발자 역할과 책임

> 이 문서는 hmfrnt-web 프로젝트에서 퍼블리셔와 개발자의 역할 경계, 책임 범위, 기대 수준을 명확하게 정의합니다.

---

## 1. 개요

hmfrnt-web은 **Page / View 분리 패턴**을 기반으로 UI 담당(퍼블리셔)과 로직 담당(개발자)을 분리합니다.  
두 역할은 독립적으로 작업하되, PR 리뷰와 Props 인터페이스 협의를 통해 협력합니다.

```
┌──────────────────────────────────────────────────────────┐
│  퍼블리셔 영역               개발자 영역                   │
│                                                          │
│  *View.tsx         ←→      *Page.tsx                    │
│  components/       ←→      features/*/services/          │
│  common/ui/        ←→      lib/                          │
│  styles/           ←→      hooks/  middleware/           │
└──────────────────────────────────────────────────────────┘
            ↕ Props 인터페이스로 연결
```

---

## 2. 퍼블리셔 역할과 책임

### 2-1. 핵심 역할

퍼블리셔는 **UI 표현층(View)**을 전담합니다.  
데이터가 어디서 오는지, 어떻게 저장되는지는 관여하지 않습니다.  
props로 받은 데이터를 화면에 올바르게 렌더링하는 것이 전부입니다.

### 2-2. 담당 파일 및 폴더

| 파일 / 폴더 | 책임 수준 | 설명 |
|---|---|---|
| `features/*/[screen]/*View.tsx` | **전담** | 화면 UI 렌더링 컴포넌트 |
| `components/common/ui/` | **주도** | 재사용 공통 UI 컴포넌트 (개발자 리뷰 필수) |
| `app/dev/pub/` | **전담** | 퍼블리셔 화면 목업 미리보기 페이지 등록 |
| `app/dev/ui/page.tsx` | **전담** | 공통 컴포넌트 카탈로그 등록 |
| `styles/globals.css` | **협의** | 디자인 토큰(CSS 변수) 수정 시 개발자 협의 필수 |
| `tailwind.config.ts` | **협의** | 개발자 리뷰 없이 수정 금지 |
| `features/*/types/` | **초안** | Props 타입 초안 작성 → 개발자 확정 |

### 2-3. View 컴포넌트 작성 책임

퍼블리셔는 모든 View 컴포넌트에 아래 세 가지 상태를 반드시 구현합니다.

**로딩 상태** — 데이터를 기다리는 동안 표시할 스켈레톤 UI

```tsx
if (isLoading) {
  return (
    <div className="flex flex-col gap-4 p-4 animate-pulse">
      {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-bg-tertiary" />)}
    </div>
  );
}
```

**에러 상태** — 데이터 로드 실패 시 표시할 에러 메시지

```tsx
if (errorMessage) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center px-6">
      <div className="text-2xl">⚠️</div>
      <p className="text-sm text-text-secondary">{errorMessage}</p>
    </div>
  );
}
```

**빈 상태** — 데이터가 0개일 때 표시할 안내 UI

```tsx
if (items.length === 0) {
  return <EmptyState title="항목이 없습니다" description="조건을 변경해 다시 시도해 보세요" />;
}
```

### 2-4. View 작성 규칙 (허용 / 금지)

**허용 ✅**

- Tailwind 유틸리티 클래스로 스타일링
- `next/image` 사용 (`<img>` 직접 사용 금지)
- props를 통해서만 데이터 수신
- 콜백 props를 `optional(?)`로 선언
- `components/common/ui/` 공통 컴포넌트 import
- 목업 미리보기 페이지에서만 `useState`로 인터랙션 시뮬레이션

**금지 ❌**

- `useState` / `useEffect` 사용 (View 내부에서 비즈니스 상태 관리 불가)
- `fetch` / `apiClient` / React Query 직접 호출
- `useRouter` / `useParams` 사용 (라우팅은 Page 담당)
- 하드코딩 색상값 사용 (반드시 CSS 변수 토큰 사용)
- Zustand Store 직접 import (`useAuthStore`, `useToastStore` 등)

### 2-5. 공통 컴포넌트 작성 책임

`components/common/ui/`의 컴포넌트는 퍼블리셔가 주도하되 개발자 리뷰를 받습니다.

- 비즈니스 로직 없이 props만 받아 렌더링
- 모든 variant, size, 상태(normal·disabled·error·loading)를 Props로 제어 가능하게 설계
- 작성 후 `/dev/ui` 카탈로그에 반드시 등록

### 2-6. 개발 환경 활용 책임

퍼블리셔는 아래 개발 도구를 직접 운영합니다.

| 도구 | 주소 | 책임 |
|---|---|---|
| 퍼블리셔 화면 미리보기 | `/dev/pub` | 신규 View 작업 시 목업 페이지 등록 |
| UI 컴포넌트 카탈로그 | `/dev/ui` | 신규·수정 공통 컴포넌트 카탈로그 등록 |
| IA 네비게이터 | `/dev/ia` | 화면 경로 탐색 (수정은 개발자와 협의) |

### 2-7. 협업 및 PR 책임

- PR 제목 형식: `[pub] [섹션]: [작업 내용]`
- PR 본문에 확인 방법(미리보기 URL)과 "개발자 확인 필요" 항목 명시
- 개발자에게 Reviewers 지정 후 팀 채팅에서 공유
- PR 머지는 개발자 승인 후 진행

---

## 3. 개발자 역할과 책임

### 3-1. 핵심 역할

개발자는 **비즈니스 로직, 데이터 페칭, 인프라, 보안**을 전담합니다.  
View에 올바른 데이터를 전달하고, 앱이 안전하고 안정적으로 동작하도록 보장합니다.

### 3-2. 담당 파일 및 폴더

| 파일 / 폴더 | 책임 수준 | 설명 |
|---|---|---|
| `features/*/[screen]/*Page.tsx` | **전담** | 데이터 페칭·라우팅 컨테이너 |
| `app/**/page.tsx` | **전담** | Next.js 라우트 파일 생성 |
| `lib/` | **전담** | 인프라 레이어 (API 클라이언트, 인증, 유틸) |
| `hooks/` | **전담** | 전역 Zustand Store |
| `proxy.ts` | **전담** | 보안 헤더, CSP, 인증 미들웨어 |
| `next.config.mjs` | **전담** | 빌드 설정, 이미지 도메인, 허용 오리진 |
| `features/*/services/` | **전담** | API 호출 함수 (apiClient 래퍼) |
| `features/*/types/` | **확정** | 퍼블리셔 초안을 검토하고 최종 타입 확정 |
| `features/shared/` | **전담** | 도메인 공통 컴포넌트·훅·서비스 |
| `styles/globals.css` | **협의** | 디자인 토큰 변경 시 최종 승인 |
| `tailwind.config.ts` | **리뷰 필수** | 모든 변경에 개발자 리뷰 필수 |
| `package.json` | **전담** | 의존성 추가·업그레이드 |

### 3-3. Page 컴포넌트 작성 책임

개발자는 React Query로 데이터를 페칭하고 View에 props로 전달합니다.

```tsx
// features/earn/mission/MissionPage.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { MissionView }  from './MissionView';
import { missionApi }   from './services/missionApi';

export function MissionPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['earn', 'mission', id],
    queryFn:  () => missionApi.getDetail(id),
  });

  return (
    <MissionView
      mission={data?.data}
      isLoading={isLoading}
      errorMessage={error ? '미션 정보를 불러오지 못했습니다.' : undefined}
      onBack={() => router.back()}
    />
  );
}
```

### 3-4. 인프라 레이어(`lib/`) 관리 책임

`lib/` 레이어는 Zustand·React에 의존하지 않아야 합니다.  
이 원칙을 유지하는 것은 개발자의 책임입니다.

- `apiClient`: DPoP 인증 헤더 생성, 401 재시도 로직, 콜백 DI 유지
- `fileUploadClient`: 파일 검증, 업로드, 진행률 콜백
- `lib/auth/`: DPoP 키쌍 관리, 토큰 캐시, httpOnly 쿠키 기반 토큰 갱신
- `lib/utils/`: 에러 메시지 상수, 폼 에러 매핑

### 3-5. 보안 책임

| 영역 | 내용 |
|---|---|
| CSP | `proxy.ts`가 프로덕션 CSP용 nonce를 자동 생성(개발자가 직접 다룰 일 없음). 인라인 스크립트·스타일은 원칙적으로 금지되며, nonce 적용은 필수가 아닌 선택 사항(부득이하게 인라인 요소가 필요한 예외 상황에서만 사용, 관리자 문서 `30-security-infrastructure.md` 1장) |
| DPoP | 요청마다 새 Proof JWT 생성. 키쌍은 IndexedDB에만 보관 |
| 이미지 도메인 | `next.config.mjs`의 `remotePatterns`에 명시적으로 등록된 도메인만 허용 |
| 환경변수 | `NEXT_PUBLIC_` 접두어 있는 변수만 클라이언트에 노출. 시크릿 값은 서버 전용 |

### 3-6. React Query 전략 책임

- `staleTime: 0` — 항상 서버에서 최신 데이터 조회
- `gcTime: 5분` — 5분 후 캐시 제거
- `retry: 1` — 실패 시 1회 재시도
- 500+ 에러: `QueryCache.onError`에서 전역 Toast 표시
- 4xx 에러: 각 화면에서 `error` 상태로 처리 (전역 Toast 없음)
- `queryKey` 설계: `['도메인', '리소스', id?]` 형태로 계층화

### 3-7. 에러 코드 관리 책임

신규 API 비즈니스 에러 코드는 `types/errors.ts`의 `ErrorCode`에 추가합니다.

```ts
export const ErrorCode = {
  UNAUTHORIZED:               'UNAUTHORIZED',
  MEMBER_NOT_FOUND:           'MEMBER_NOT_FOUND',
  APPROVAL_ALREADY_PROCESSED: 'APPROVAL_ALREADY_PROCESSED',
  // 신규 에러 코드 추가
  NEW_FEATURE_ERROR:          'NEW_FEATURE_ERROR',
} as const;
```

### 3-8. 퍼블리셔 PR 리뷰 책임

개발자는 퍼블리셔 PR에서 아래 항목을 반드시 확인합니다.

- View에서 `apiClient` / `useRouter` / `useState`(비즈니스용) 사용 여부
- 콜백 props의 `optional(?)` 선언 여부
- 신규 이미지 도메인 요청 시 `next.config.mjs` 업데이트

### 3-9. 배포 책임

- 배포 전 `npm run lint` + `npm run build` 에러 없음을 확인

---

## 4. 공동 책임 영역

### Props 인터페이스 협의

View와 Page를 연결하는 Props는 두 역할이 함께 설계합니다.

| 상황 | 절차 |
|---|---|
| 개발자가 API 먼저 확정 | `features/*/types/`에 타입 작성 후 퍼블리셔에게 공유 |
| 퍼블리셔가 목업 먼저 작성 | PR 본문에 임시 Props 명시 → 개발자가 리뷰에서 확정 |

### 디자인 토큰 변경

`styles/globals.css`의 CSS 변수 값을 변경할 때는 사전 협의 후 진행합니다.  
색상 토큰 변경은 모든 화면에 영향을 주므로 두 역할 모두의 검토가 필요합니다.

### IA 데이터 (`app/dev/ia/_data/ia.ts`)

화면 추가 시 두 역할 모두 수정할 수 있습니다.  
실제 라우트 파일(`app/**/page.tsx`) 생성은 개발자가 담당합니다.

---

## 5. 역할별 금지 사항 요약

| | 퍼블리셔 | 개발자 |
|---|---|---|
| `lib/`에서 Zustand import | — | 금지 (콜백 DI 사용) |
| View에서 API 호출 | 금지 | — |
| View에서 useRouter 사용 | 금지 | — |
| `package.json` 직접 수정 | 금지 (개발자에게 요청) | — |
| `proxy.ts` 수정 | 금지 | — |
| `.env.local` 커밋 | **양쪽 모두 금지** | **양쪽 모두 금지** |

---

## 6. 한눈에 보는 책임 매트릭스

| 작업 | 퍼블리셔 | 개발자 |
|---|---|---|
| 화면 UI 구현 | ✅ 전담 | — |
| 데이터 페칭 | — | ✅ 전담 |
| API 서비스 함수 작성 | — | ✅ 전담 |
| 인증·보안 인프라 | — | ✅ 전담 |
| 공통 UI 컴포넌트 | ✅ 주도 | 리뷰 |
| Props 인터페이스 확정 | 초안 | ✅ 최종 확정 |
| 로딩·에러·빈 상태 구현 | ✅ 전담 | — |
| `/dev/pub` 등록 | ✅ 전담 | — |
| `/dev/ui` 등록 | ✅ 전담 | — |
| PR 리뷰 | 요청 | ✅ 승인 |
| 의존성 관리 (`package.json`) | — | ✅ 전담 |
| 디자인 토큰 변경 | 협의 | 협의·최종 승인 |
