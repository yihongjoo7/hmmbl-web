# 개발 표준 정의서

> 대상: 개발자  
> 프로젝트: hmfrnt-web  
> 문서 버전: 1.0  
> 작성일: 2026-07-08

---

## 0. 사전 지식

본 문서를 이해하려면 아래 언어·기술에 대한 기본 지식이 필요하다.  
각 항목의 상세 적용 규칙은 본문 각 장에서 다룬다.

| 구분 | 항목 | 필요한 이유 |
|---|---|---|
| 언어 | JavaScript(ES6+) | 프로젝트 전체 코드의 기반 문법(화살표 함수, 구조 분해, 모듈, async/await 등) |
| 언어 | TypeScript | 타입 시스템(interface, generic, union 등)을 이해해야 5장 코딩 표준과 도메인 타입 정의를 읽을 수 있음 |
| 라이브러리 | React 19 (함수형 컴포넌트, Hooks) | `useState`/`useEffect`/`useCallback`/`useRef`/`forwardRef` 등 7장 React 기능 사용 가이드 전체의 전제 지식 |
| 프레임워크 | Next.js App Router | 라우트 그룹, `page.tsx`/`layout.tsx` 파일 규칙, 서버·클라이언트 컴포넌트 개념(3장, 7-1절~7-3절) |
| 라이브러리 | TanStack Query(React Query) | `useQuery`/`useMutation`, 캐싱·무효화 개념(8-1절) |
| 라이브러리 | Zustand | 경량 전역 상태 관리 패턴, selector 구독 방식(8-2절) |
| 라이브러리 | next-intl | 다국어 메시지 Provider 개념(10장) |
| 라이브러리 | pino | 구조화 로깅(JSON 로그, 로그 레벨) 개념(11장) |
| 스타일링 | Tailwind CSS | 디자인 토큰(CSS 변수) 개념 — 개발자는 `tailwind.config.ts` 리뷰 책임이 있음(6장). 클래스 작성 상세 규칙은 부록 A(퍼블리셔 영역, 참고용) |
| 도구 | ESLint / eslint-plugin-react-hooks | `exhaustive-deps` 등 정적 분석 규칙 이해(7-4절, 12-1절) |
| 도구 | Git / Conventional Commits | 커밋 메시지 컨벤션(12-2절) |

---

## 1. 문서 개요

본 문서는 `package.json`에 정의된 기술 스택을 기준으로 프로젝트의 개발 표준을 정의한다.  
코드 일관성 확보, 신규 인력 온보딩, 코드 리뷰 기준 통일을 목적으로 한다.

본 문서는 **개발자 표준 문서**이며, 1장~14장 본문은 개발자가 전담·확정 책임을 지는 영역(Page.tsx, `lib/`, 상태 관리, API, i18n·로깅 인프라, 빌드·배포 등)만 다룬다.  
`*View.tsx`, `components/common/ui/` 작성, Tailwind 스타일링 등 퍼블리셔가 주도하는 작업 규칙은 개발자가 인터페이스 경계를 이해하고 PR을 리뷰할 수 있도록 **부록 A(참고용)**에 별도 번호 체계로 분리해 수록했다.  
퍼블리셔용 상세 가이드의 원본은 `docs/15`~`docs/22`, `docs/26-roles-and-responsibilities.md`를 참고한다.

본 프로젝트는 **순수 웹 서비스**다(브라우저로 URL에 직접 접근).  
카메라·GPS 등 디바이스 기능은 표준 웹 API(`<input type=file>`, `navigator.geolocation` 등)로 구현하며, 지원하지 않는 브라우저에서는 해당 기능만 제한된다.

### 1-1. 라우트 그룹 구분

| 구분 | `(protected)` | `(public)` |
|---|---|---|
| 인증 요건 | 로그인 필요(미인증 시 `/auth/login`으로 리다이렉트) | 인증 불필요 |
| 인증 방식 | 이메일/비밀번호 로그인 → DPoP 기반 API 인증 | 해당 없음 |
| SEO / 초기 로딩 성능 | 고려 불필요(로그인 필요 화면) | 고려 필요(검색엔진 인덱싱, 초기 렌더 속도) |

새 화면을 추가할 때는 위 표를 기준으로 로그인이 필요한지 먼저 판단하고, 그에 맞는 라우트 그룹과 렌더링 전략(7장)을 선택한다.

---

## 2. 기술 스택

### 2-1. 런타임 / 프레임워크

| 패키지 | 버전 | 용도 |
|---|---|---|
| next | ^16.2.10 | App Router 기반 React 프레임워크 |
| react / react-dom | ^19.2.7 | UI 라이브러리 |
| typescript | ^5.7.3 | 정적 타입 언어 |

### 2-2. 상태 / 데이터

| 패키지 | 버전 | 용도 |
|---|---|---|
| @tanstack/react-query | ^5.62.16 | 서버 상태(비동기 데이터) 관리 |
| @tanstack/react-query-devtools | ^5.62.16 | React Query 디버깅 도구 (dev 전용) |
| zustand | ^5.0.3 | 클라이언트 전역 상태 관리 |

### 2-3. 다국어 / 로깅

| 패키지 | 버전 | 용도 |
|---|---|---|
| next-intl | ^4.13.1 | 다국어 메시지 렌더링 (`NextIntlClientProvider`) |
| pino | ^10.3.1 | 서버 사이드 구조화 로깅 |
| pino-pretty | ^13.1.3 | 개발 환경 로그 포맷팅 |

### 2-4. 스타일 / 빌드 도구

| 패키지 | 버전 | 용도 |
|---|---|---|
| tailwindcss | ^3.4.17 | 유틸리티 기반 CSS |
| postcss / autoprefixer | ^8.4.49 / ^10.4.20 | CSS 전처리 |
| eslint / eslint-config-next | ^9.20.0 / ^16.2.10 | 정적 분석 |
| @typescript-eslint/* | ^8.59.2 | TypeScript 린트 규칙 |
| @types/* | 최신 | 타입 정의 |

### 2-5. 버전 관리 원칙

- 모든 의존성은 `^`(caret) 범위로 관리하며, minor/patch 업데이트는 자동 허용하되 major 업데이트는 별도 검증 후 반영한다.
- 신규 패키지 추가 시 devDependencies와 dependencies를 명확히 구분한다. 런타임에 필요 없는 패키지(타입 정의, 린트, 테스트 도구 등)는 반드시 devDependencies에 둔다.

---

## 3. 프로젝트 구조 및 레이어 아키텍처

### 3-1. 디렉토리 구조

```
project-root/
├── app/                # Next.js App Router — 라우팅, Provider
│   ├── (protected)/    # 인증 필요 라우트 그룹
│   ├── (public)/       # 인증 불필요 라우트 그룹
│   ├── api/             # Route Handler
│   └── dev/              # 개발 전용 도구 (프로덕션 접근 차단)
├── features/            # 도메인별 비즈니스 로직 (Page/View/services/hooks/types)
├── components/common/ui/  # 순수 UI 컴포넌트 (비즈니스 로직 없음)
├── hooks/               # 전역 Zustand store
├── lib/                 # 순수 인프라 레이어 (API 클라이언트, i18n, 로깅, 유틸)
├── types/               # 전역 타입 정의
├── styles/              # 전역 CSS / 디자인 토큰
└── messages/            # i18n 번역 리소스
```

### 3-2. 레이어 의존 규칙

```
app/  →  features/  →  components/common/ui/  →  lib/
```

- 의존은 항상 위에서 아래 방향(단방향)으로만 허용한다. 역방향 import는 금지한다.
- `lib/`는 React 훅, Zustand, 외부 상태에 의존하지 않는다. 외부 동작이 필요하면 콜백 주입(DI) 패턴을 사용한다.
- `features/[도메인A]`는 `features/[도메인B]`를 직접 import하지 않는다. 공유가 필요하면 `features/shared/`로 이동한다.

### 3-3. features 도메인 표준 구조

```
features/[domain]/
├── [screen]/
│   ├── [Screen]Page.tsx     # 데이터 페칭·라우팅 담당
│   ├── [Screen]View.tsx     # 순수 UI 렌더링 담당
│   └── components/          # 화면 전용 서브컴포넌트
├── services/[domain]Api.ts  # apiClient 래퍼
├── hooks/use[Feature].ts    # 화면·기능 전용 훅
└── types/index.ts           # 도메인 타입
```

### 3-4. Page / View 책임 경계

`*Page.tsx`(개발자 전담)는 데이터 페칭·라우팅·상태 관리를 담당하고, 결과를 `*View.tsx`에 props로 전달하는 역할까지만 수행한다.  
UI 마크업을 Page에 직접 작성하지 않는다.

| 구분 | 담당 | Page가 지켜야 할 인터페이스 규칙 |
|---|---|---|
| `*Page.tsx` | 개발자(전담) | React Query·Zustand로 얻은 데이터를 `*View.tsx`에 props로 전달, 콜백 props로 이벤트 위임 |
| `*View.tsx` | 퍼블리셔(주도) | props만으로 렌더링 — 작성 규칙·금지 항목은 **부록 A** 참고(참고용) |

View는 로딩 / 에러 / 빈 상태 3가지 UI 상태를 항상 구현해야 하므로, Page는 이 세 상태를 판별할 수 있는 props(`isLoading`, `errorMessage`, 빈 배열 등)를 반드시 내려준다.

---

## 4. 네이밍 컨벤션

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 파일/함수 | PascalCase | `MissionPage.tsx`, `MissionView.tsx` |
| 훅 파일/함수 | camelCase, `use` 접두사 | `useMissionList.ts` |
| 서비스 파일 | camelCase, `Api` 접미사 | `missionApi.ts` |
| Zustand store | camelCase, `use[Name]Store` | `useToastStore` |
| 타입/인터페이스 | PascalCase | `MissionDetail`, `ApiError` |
| 상수 | UPPER_SNAKE_CASE | `MODAL_ID` |
| 폴더 | kebab-case 또는 camelCase(도메인명과 일치) | `earn`, `file-upload-test` |
| 번역 키 | camelCase, 최상위는 도메인명 | `earn.mission.title` |

---

## 5. TypeScript 코딩 표준

- `strict` 모드를 유지하며 `any` 사용을 지양한다. 불가피한 경우 사유를 주석으로 명시한다.
- 컴포넌트 props, API 응답, 도메인 엔티티는 각 도메인의 `types/index.ts`에 정의한다.
- 전역적으로 재사용되는 타입(`ApiResponse`, `ApiError`, `ErrorCode` 등)은 루트 `types/`에 둔다.
- `@typescript-eslint` 규칙을 준수하며, `npm run type-check`(`tsc --noEmit`)를 커밋 전 필수 실행한다.
- import 순서: 외부 라이브러리 → 절대 경로 내부 모듈(`@/...`) → 상대 경로 순으로 정렬한다.

---

## 6. React 컴포넌트 표준

- 클라이언트 상호작용이 필요한 컴포넌트에는 `'use client'`를 명시한다.
- `next/image`를 사용하며 `<img>` 태그 직접 사용을 금지한다.
- 콜백 props는 `optional(?)`로 선언하는 것을 기본으로 한다.
- 공통 UI 컴포넌트는 `components/common/ui/`에 위치하며 비즈니스 로직을 포함하지 않는다(작성은 퍼블리셔 주도, 개발자 리뷰).
- 화면 전용 컴포넌트는 해당 도메인의 `[screen]/components/`에 위치시킨다.
- `tailwind.config.ts` 변경은 모든 PR에서 개발자 리뷰를 필수로 거치고, `styles/globals.css`(디자인 토큰) 변경은 개발자가 최종 승인한다(작성 자체는 퍼블리셔 영역 — 상세 작성 규칙은 부록 A 참고).

---

## 7. React 기능 사용 가이드 (React 19)

1-1절에서 정의한 두 라우트 그룹(`(protected)` / `(public)`)에 따라 렌더링 전략이 달라진다.  
`(protected)` 화면은 SSR 데이터 페칭 없이 클라이언트 중심으로 동작하고, `(public)` 중 검색엔진 노출·초기 로딩 속도가 중요한 화면(랜딩, 소개 등)은 Server Component 기반 SSR을 적극 활용한다.  
아래는 실제 코드베이스에서 사용 중인 React 기능과, 두 그룹에 따라 달라지는 적용 원칙이다.

### 7-1. 'use client' 사용 원칙

- **`(protected)` 화면**: `page.tsx`를 제외한 사실상 모든 컴포넌트는 `'use client'`로 선언한다(현재 275개 파일 적용). `app/**/page.tsx`는 서버 컴포넌트로 얇게 유지하고, 실제 로직·UI는 `'use client'`로 선언된 `features/[domain]/.../[Screen]Page.tsx`에 위임하는 thin wrapper 패턴을 따른다. 이 그룹은 검색엔진 노출 대상이 아니므로 SSR로 얻는 이점이 없어 클라이언트 렌더링을 기본으로 한다.

  ```tsx
  // app/(protected)/earn/mission/page.tsx — 서버 컴포넌트(thin wrapper)
  import { MissionPage } from '@/features/earn/mission/MissionPage';

  export default function Page() {
    return <MissionPage />; // 실제 로직은 클라이언트 컴포넌트에 위임
  }
  ```

- **`(public)` 중 SEO·초기 로딩이 중요한 화면**: 정적/준정적 콘텐츠(랜딩, 소개, 이용약관 등)는 `'use client'` 없이 서버 컴포넌트로 유지해 서버에서 완성된 HTML을 내려준다. 사용자 인터랙션이 필요한 부분만 하위 클라이언트 컴포넌트로 분리한다(Server Component가 Client Component를 감싸는 구조).

### 7-2. Server Components 사용 범위

- **`(protected)` 화면**: 서버 컴포넌트는 `page.tsx` 진입점 용도로만 최소 사용한다. 서버 컴포넌트 내부에서 데이터 fetch·DB 접근을 직접 수행하지 않는다. 데이터 페칭이 필요한 화면은 예외 없이 클라이언트 컴포넌트로 작성하고, `@tanstack/react-query`를 통해 데이터를 가져온다.
- **`(public)` 화면**: SEO에 필요한 메타데이터(`generateMetadata`)나 초기 노출 콘텐츠는 서버 컴포넌트에서 직접 fetch해 SSR로 내려준다. 이후 사용자 인터랙션(좋아요, 폼 제출 등)이 필요한 부분에서만 클라이언트 컴포넌트 + React Query를 사용한다.
- 두 경우 모두 API 호출은 `lib/api/`·`features/[domain]/services/`의 공용 클라이언트를 거치며, 서버 컴포넌트에서 호출하더라도 임의의 `fetch`를 직접 작성하지 않는다.

### 7-3. next/dynamic + ssr:false

- 로케일을 쿠키(`HPOINT_LOCALE`)로 결정하는데, 서버가 첫 렌더 시점에 이 쿠키 상태를 알 수 없어 서버·클라이언트 렌더링 결과가 달라질 수 있다(hydration mismatch). 이를 막기 위해 로케일에 의존하는 Provider를 `next/dynamic({ ssr: false })`로 로드해 클라이언트에서만 렌더링한다.

  ```tsx
  // app/WebviewLayoutClient.tsx
  const LocaleProvider = dynamic(() => import('./LocaleProvider'), { ssr: false });
  ```

- SEO가 중요한 `(public)` 화면에서 URL 세그먼트나 `Accept-Language` 헤더로 로케일을 서버에서 바로 판별하는 경우는 이 워크어라운드가 필요 없다. 그런 화면에 `ssr:false`를 습관적으로 적용하지 않는다 — SSR을 끄면 SEO·초기 로딩 이점이 사라진다.

### 7-4. useEffect

- 용도를 이벤트 구독, `IntersectionObserver` 등 DOM/외부 API 연동처럼 정리(cleanup)가 필요한 부수효과로 한정한다.
- 구독형 effect는 반드시 cleanup 함수를 반환한다. 의존성 배열은 ESLint `exhaustive-deps` 규칙을 따르고 임의로 생략하지 않는다.

  > **`exhaustive-deps`란?**
  > `react-hooks/exhaustive-deps`는 `eslint-plugin-react-hooks`(`eslint-config-next`에 포함되어 프로젝트에 이미 적용됨)가 제공하는 규칙으로, `useEffect`/`useCallback`/`useMemo` 등의 두 번째 인자인 의존성 배열이 콜백 내부에서 실제로 참조하는 값들을 빠짐없이(exhaustive) 포함하는지 검사한다.
  > - 콜백 안에서 사용하는 state·props·함수를 의존성 배열에서 누락하면 **경고**를 발생시킨다.  
  > 누락 시 클로저가 오래된(stale) 값을 참조해 버그로 이어질 수 있다.
  > - 반대로 실제로 쓰지 않는 값이 배열에 들어 있어도 알려준다(불필요한 재실행 방지).
  > - `[]`(빈 배열)로 "마운트 시 1회만 실행"을 의도했지만 내부에서 외부 값을 참조하는 경우도 잡아낸다 — 이 경우 `useRef`로 최신 값을 유지하거나 의존성 배열에 정직하게 추가하는 방식으로 해결한다.
  > - 규칙이 제안하는 자동 수정(quick fix)을 맹목적으로 적용하지 않는다.  
  > 의존성을 추가했을 때 effect가 의도치 않게 자주 재실행되면, 로직 자체를 재검토(예: 함수를 `useCallback`으로 안정화, effect를 분리)한다.
  > - 이 프로젝트에서는 `useEffect`뿐 아니라 7-5절 `useCallback`의 의존성 배열에도 동일하게 적용한다.

  ```ts
  // DOM 이벤트 구독 패턴 예시
  useEffect(() => {
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [handler]);
  ```

### 7-5. useCallback

- 자식 컴포넌트에 전달되는 이벤트 핸들러, 커스텀 훅이 반환하는 함수는 `useCallback`으로 memoization한다.
- 의존성 배열에는 클로저로 참조하는 모든 외부 변수를 명시한다.

  > **memoization이란?**
  > 이전에 계산(또는 생성)한 결과를 캐싱해 두었다가, 입력값(의존성)이 바뀌지 않았다면 재계산 없이 캐시된 값을 그대로 재사용하는 최적화 기법이다.
  > - `useCallback`은 함수 자체를, `useMemo`(7-6절)는 함수의 실행 결과(값)를 memoization한다.
  > - React 컴포넌트는 리렌더될 때마다 내부 함수/객체를 새로 생성한다.  
  > memoization을 적용하지 않으면 매 렌더마다 참조가 달라져, 이를 props로 받는 자식 컴포넌트가 (동일한 값임에도) 불필요하게 리렌더되거나 `useEffect`의 의존성으로 사용될 때 effect가 매번 재실행될 수 있다.
  > - 의존성 배열이 변경되지 않으면 이전에 memoization된 함수/값의 참조를 그대로 반환하고, 변경되면 새로 생성해 캐시를 갱신한다.
  > - memoization 자체에도 비교·캐시 유지 비용이 들기 때문에, 실제로 참조 안정성이 필요한 경우(자식 컴포넌트 props, 훅 반환값, `useEffect` 의존성 등)에만 사용한다.

  ```ts
  const handleCapture = useCallback(async (src: 'camera' | 'gallery') => {
    const file = await capture(src);
    // ...
  }, [capture]);
  ```

### 7-6. useMemo

- 프로젝트 전반에서 사용을 최소화한다(현재 사용 사례 없음). 대량 리스트 가공·정렬처럼 렌더링마다 반복되는 고비용 연산이 실제로 확인될 때만 제한적으로 도입하며, 성능 이슈가 없는 상태에서 선제적으로 남용하지 않는다.

### 7-7. useRef

- DOM 요소 참조(비디오 플레이어, 바텀시트, 무한스크롤 트리거 등)와, 리렌더를 유발하지 않아야 하는 값 저장(마지막으로 기록한 진행률 등)에 사용한다.
- ref 값 변경은 화면에 반영되지 않으므로, 사용자에게 보여줘야 하는 값은 `useState`를 사용한다.

  ```tsx
  // components/common/ui/navigation/InfiniteScrollTrigger.tsx
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !hasMore) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !loading) onTrigger();
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, loading, onTrigger, threshold]);
  ```

### 7-8. forwardRef

- 재사용 가능한 공통 폼 컴포넌트(`Input`, `Select`, `Textarea`, `DatePicker`)는 `forwardRef`로 구현해 상위에서 DOM 요소에 직접 접근할 수 있도록 한다.
- 디버깅을 위해 `displayName`을 반드시 지정한다.

  ```tsx
  // components/common/ui/input/Input.tsx
  export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => (
      <div className="flex flex-col gap-1">
        {label && <label>{label}</label>}
        <input ref={ref} className={/* ... */} {...props} />
        {error && <span>{error}</span>}
      </div>
    )
  );
  Input.displayName = 'Input';
  ```

### 7-9. 원칙적으로 사용하지 않는 기능

| 기능 | 사용 여부 | 대체 수단 / 사유 |
|---|---|---|
| `Suspense`(데이터 페칭용) | 미사용 | React Query의 `isLoading` 상태로 로딩 UI 처리 |
| `useTransition` / `useDeferredValue` | 미사용 | 대량 리스트 필터링·검색처럼 입력 지연이 체감되는 인터랙션이 생기면 도입을 검토하되, 팀 리뷰를 거친다 |
| `useOptimistic` | 미사용 | `useMutation`의 `onMutate`로 낙관적 업데이트 필요 시 대체 |
| `useActionState` / Server Actions | 미사용 | 폼 제출은 `apiClient` + `useMutation` 패턴을 따름 |
| Context API(`createContext`/`useContext`) | 미사용 | 전역 상태는 Zustand로 통일 |
| `React.memo` | 미사용 | 프로파일링으로 렌더 비용이 확인된 경우에만 제한적으로 검토 |

새로운 React 기능 도입이 필요한 경우 팀 리뷰를 거쳐 이 표에 사용 원칙을 추가·갱신한다.

---

## 8. 상태 관리 표준

### 8-1. 서버 상태 — @tanstack/react-query

- `QueryClient` 기본 옵션: `staleTime: 0`, `gcTime: 5분`, `retry: 1`.
- `queryKey`는 배열 형태로 도메인 순서를 따른다. 예: `['earn', 'missions']`.
- 에러 처리는 계층을 분리한다.

  | 에러 종류 | 처리 위치 |
  |---|---|
  | 5xx (서버 에러) | 전역 `QueryCache.onError` → Toast |
  | 4xx (클라이언트 에러) | 각 화면의 `error` 상태로 개별 처리 |

- `useMutation` 성공 시 관련 쿼리는 `invalidateQueries`로 무효화한다.
- devtools(`@tanstack/react-query-devtools`)는 개발 환경에서만 마운트한다.

### 8-2. 클라이언트 상태 — zustand

- 전역 store는 `hooks/` 디렉토리(도메인 종속 store는 `features/[domain]/hooks/`)에 위치시킨다.
- store는 상태와 액션을 인터페이스로 명시한다.
- 컴포넌트 내부에서는 선택자(selector)로 필요한 값만 구독한다: `useToastStore(s => s.addToast)`.
- 이벤트 핸들러/콜백 등 렌더링 외부에서는 `getState()`로 구독 없이 접근한다.
- 빈 스텁이나 미구현 store는 실제 구현 전까지 사용을 금지하고 주석으로 명시한다.
- store 상태는 최소한으로 유지하며, 서버에서 오는 데이터는 store가 아닌 React Query 캐시로 관리한다.

---

## 9. API 통신 & 에러 처리 표준

- 모든 HTTP 요청은 `lib/api/` 하위의 공용 API 클라이언트를 통해서만 수행한다. `fetch`를 화면에서 직접 호출하지 않는다.
- API 클라이언트는 Zustand·인증 모듈에 직접 의존하지 않고, 앱 초기화 시점에 콜백(`getToken`, `onUnauthorized`, `onClearAuth`)을 주입받는 DI 패턴을 따른다.
- 도메인별 API 호출 함수는 `features/[domain]/services/[domain]Api.ts`에 모아 래핑한다. 화면 컴포넌트가 API 클라이언트를 직접 호출하지 않는다.
- 에러 타입은 `ApiError`로 통일하며 `status`, `code`, `detail` 필드를 표준으로 한다.
- 인증 방식은 라우트 그룹에 따라 다르다.

  | 그룹 | 인증 방식 | 401 처리 |
  |---|---|---|
  | `(protected)` | 이메일/비밀번호 로그인 → DPoP 인증 | 자동 갱신(httpOnly refresh 쿠키) 후 1회 재시도, 실패 시 로그아웃 처리 |
  | `(public)` | 인증 불필요 또는 별도 웹 로그인 플로우(도메인별 정의) | 화면 단에서 로그인 유도 UI로 처리 |

---

## 10. 다국어(i18n) 표준

- `next-intl`의 `NextIntlClientProvider`만 사용하며, 빌드 플러그인·URL 기반 라우팅은 사용하지 않는다. 로케일은 `HPOINT_LOCALE` 쿠키와 `LocaleProvider`(7-3절)를 통해서만 전환한다. 화면 단에서 로케일을 임의로 판단하지 않는다.
- SEO가 중요한 `(public)` 화면에서 언어별 페이지를 개별 인덱싱해야 하는 경우, URL 기반 로케일 라우팅(예: `/en/...`, `/ko/...`) 도입을 검토할 수 있다(현재 미도입).
- 번역 리소스는 `messages/*.json`에 도메인별 키로 관리하며, 최상위 키는 도메인명, 하위 키는 camelCase를 따른다.
- 정적 지원 언어(`ko` 기본)의 키 구조는 서로 동일하게 유지한다.
- 신규 화면 추가 시 번역 키를 반드시 함께 등록하며, 하드코딩 문자열을 UI에 직접 작성하지 않는다.

---

## 11. 로깅 표준 (pino)

- 서버 사이드(Route Handler, `instrumentation.ts` 등) 로깅은 `pino`를 사용하며, 콘솔 `console.log` 직접 사용을 지양한다.
- 개발 환경에서는 `pino-pretty`로 가독성 있게 출력하고, 운영 환경에서는 JSON 구조화 로그를 그대로 사용한다.
- 로그 레벨은 `error > warn > info > debug` 기준으로 상황에 맞게 선택한다.
  - `error`: 요청 처리 실패, 예외
  - `warn`: 폴백 처리, 설정 누락 등 잠재적 이슈
  - `info`: 주요 이벤트(요청 시작/종료 등)
  - `debug`: 개발 중 상세 추적
- 민감 정보(토큰, 개인정보)는 로그에 남기지 않는다.

---

## 12. Lint / Type Check / Git 컨벤션

### 12-1. 정적 분석

| 명령어 | 용도 |
|---|---|
| `npm run lint` | ESLint 검사 (`eslint-config-next`, `@typescript-eslint`) |
| `npm run type-check` | TypeScript 타입 검사 (`tsc --noEmit`) |

커밋 전 두 명령어를 모두 통과해야 한다.

### 12-2. 커밋 메시지 컨벤션 (Conventional Commits)

`type(scope?): subject` 형식을 따른다.

| type | 의미 |
|---|---|
| feat | 새로운 기능 |
| fix | 버그 수정 |
| docs | 문서 수정 |
| style | 코드 포맷 변경 (기능 변경 없음) |
| refactor | 리팩토링 |
| test | 테스트 추가/수정 |
| chore | 빌드 설정, 패키지 관리 등 |
| perf | 성능 개선 |
| ci | CI/CD 설정 변경 |
| revert | 커밋 되돌리기 |

- subject는 최대 100자, 빈 값 불가, type은 소문자로 작성한다.

---

## 13. 빌드 / 배포 표준

| 명령어 | 용도 |
|---|---|
| `npm run dev` | 로컬 개발 서버 (HTTP, 기본, 포트 3000) |
| `npm run dev:http` | `npm run dev`와 동일 (명시적 별칭) |
| `npm run dev:https` | 로컬 개발 서버 (HTTPS, 포트 3001) — 실기기/LAN 테스트, DPoP WebCrypto 확인 등 필요할 때만 |
| `npm run build` | 프로덕션 빌드 |
| `npm run build:staging` | 스테이징 환경 빌드 |
| `npm run build:prod` | 프로덕션 환경 빌드 |
| `npm run start` | 프로덕션 서버 실행 |

환경변수는 `NODE_ENV`, `NEXT_PUBLIC_APP_ENV`로 스테이징/프로덕션을 구분한다.

---

## 14. 부록 — package.json 요약

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.62.16",
    "next": "^16.2.10",
    "next-intl": "^4.13.1",
    "pino": "^10.3.1",
    "pino-pretty": "^13.1.3",
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@tanstack/react-query-devtools": "^5.62.16",
    "@types/node": "^22.10.7",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@typescript-eslint/eslint-plugin": "^8.59.2",
    "@typescript-eslint/parser": "^8.59.2",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.20.0",
    "eslint-config-next": "^16.2.10",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.3"
  }
}
```

---

# 부록 A — 퍼블리셔 영역 참고 자료 (참고용, 개발자 표준 아님)

> 이 부록은 1장~14장과 별도의 번호 체계(A-1, A-2, ...)를 사용한다.  
> 아래 내용은 퍼블리셔가 작성·소유하는 영역으로, 개발자의 준수 의무 대상이 아니라 **PR 리뷰·Props 인터페이스 협의를 위한 참고 자료**다.  
> 실제 최신 작성 규칙은 `docs/10-design-system.md`, `docs/11-component-catalog.md`, `docs/12-layout-guide.md`, `docs/26-roles-and-responsibilities.md`에서 퍼블리셔용 문서로 별도 관리한다.

## A-1. View.tsx 작성 규칙

| 구분 | 담당 | 허용 | 금지 |
|---|---|---|---|
| `*View.tsx` | 퍼블리셔(전담) | props 기반 렌더링, Tailwind 스타일링, `next/image` 사용, `components/common/ui/` import, 목업 미리보기 페이지에서만 `useState`로 인터랙션 시뮬레이션 | `useState`/`useEffect`, `fetch`/`apiClient`/React Query 직접 호출, `useRouter`/`useParams`, 하드코딩 색상값, Zustand Store 직접 import |

- View는 로딩 / 에러 / 빈 상태 3가지 UI 상태를 항상 구현한다.
- 콜백 props는 `optional(?)`로 선언한다.

## A-2. 공통 UI 컴포넌트(`components/common/ui/`) 작성 책임

- 퍼블리셔가 주도하되 개발자 리뷰를 받는다.
- 비즈니스 로직 없이 props만 받아 렌더링한다.
- 모든 variant, size, 상태(normal·disabled·error·loading)를 Props로 제어 가능하게 설계한다.
- 작성 후 `/dev/ui` 카탈로그에 반드시 등록한다.

## A-3. 스타일링 표준 (Tailwind CSS)

- 색상, 간격 등은 하드코딩 값이 아닌 `tailwind.config.ts`에 정의된 디자인 토큰(CSS 변수)을 사용한다.
- `tailwind.config.ts`와 `styles/globals.css`(디자인 토큰) 변경은 반드시 개발자 리뷰·승인을 거친다(6장).
- 클래스명은 레이아웃 → 박스모델 → 타이포그래피 → 색상 순으로 작성하는 것을 권장한다.
- 반응형/상태 변형(`hover:`, `disabled:`, `sm:` 등)은 Tailwind 기본 유틸리티만 사용하고 임의 값(`[..]`) 사용은 최소화한다.

## A-4. 개발 도구 활용

| 도구 | 주소 | 책임 |
|---|---|---|
| 퍼블리셔 화면 미리보기 | `/dev/pub` | 신규 View 작업 시 목업 페이지 등록 |
| UI 컴포넌트 카탈로그 | `/dev/ui` | 신규·수정 공통 컴포넌트 카탈로그 등록 |
| IA 네비게이터 | `/dev/ia` | 화면 경로 탐색(수정은 개발자와 협의) |

## A-5. 협업 및 PR 규칙

- PR 제목 형식: `[pub] [섹션]: [작업 내용]`
- PR 본문에 확인 방법(미리보기 URL)과 "개발자 확인 필요" 항목을 명시한다.
- 개발자에게 Reviewers를 지정하고 팀 채팅에서 공유한다.
- PR 머지는 개발자 승인 후 진행한다.
