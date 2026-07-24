# 개발 시작 가이드 (Step-by-Step)

> 대상: hmmbl-web에 새로 합류하는 개발자  
> 목적: 로컬 환경 설정부터 첫 화면(기능) 개발·PR 제출까지 전체 흐름을 순서대로 안내합니다.  
> 이 문서는 기존 `docs/` 문서들의 진입점(entry point) 역할을 합니다.  
> 각 단계 끝에 더 깊은 내용을 다루는 문서를 링크해 두었으니, 필요할 때 펼쳐서 참고하세요.

---

## 0. 시작 전에 — 이 프로젝트는 무엇인가

- Next.js 14 (App Router) 기반 **모바일 웹뷰 전용** 앱입니다. 네이티브 앱(iOS/Android)이 WebView로 이 앱을 감싸서 서비스합니다.
- 화면 작업은 **Page(개발자) / View(퍼블리셔)** 두 레이어로 분리되어 있습니다. 이 문서는 개발자 관점에서 작성되었습니다. 퍼블리셔 관점은 [13-page-view-pattern.md](./13-page-view-pattern.md)를 참고하세요.
- 인증은 네이티브 앱이 담당하고, 웹은 DPoP(RFC 9449) 기반으로 API를 호출합니다. 처음에는 "왜 로그인 리다이렉트가 없지?" 하고 헷갈릴 수 있는데, Step 7에서 다룹니다.

### 사전 준비물

| 항목 | 비고 |
|---|---|
| Node.js 18 이상 | `node -v`로 확인 |
| npm 9 이상 | `npm -v`로 확인 |
| mkcert (또는 동급 도구) | **선택** — 실기기/LAN 테스트 등 HTTPS가 필요할 때만 (Step 2) |
| 로컬/dev API 서버 정보 | 팀에서 제공하는 dev API 주소, 또는 로컬 `:8000` 서버 |
| 에디터 | VS Code 권장 (ESLint, Prettier 확장 설치 권장) |

---

## Step 1. 저장소 클론 & 의존성 설치

```bash
git clone <repo-url> hmmbl-web
cd hmmbl-web
```

폐쇄망 환경에서는 npm 레지스트리에 접근할 수 없으므로 `npm install` 대신 파일 서버(`10.109.198.29`, `Z:\00. 공지사항\001. 설치파일\개발툴\React`)에 미리 빌드된 `node_modules`를 복사해서 사용합니다.

> 자세한 절차(OS별 복사 명령): [02-environment-setup.md](./02-environment-setup.md) 1장

---

## Step 2. 로컬 HTTPS 인증서 준비 (선택 — 필요할 때만)

`npm run dev`는 기본적으로 **HTTP(포트 3000)** 로 동작하므로 이 단계는 건너뛰고 바로 Step 3으로 가도 됩니다.  
아래 경우에만 HTTPS(포트 3001)가 필요하며, 이때만 mkcert 인증서를 준비하면 됩니다.

- 같은 Wi-Fi의 **실기기(LAN IP)** 로 접속해서 테스트할 때 (LAN IP는 브라우저가 보안 컨텍스트로 인정하지 않아 WebCrypto/DPoP 키 생성이 동작하지 않음)
- DPoP·인증 관련 기능을 정밀하게 개발/디버깅할 때

인증서 경로는 `next.config.mjs`가 아니라 **`package.json`의 `dev:https` 스크립트**에 지정되어 있고, **프로젝트 루트의 `keyfile/` 폴더**를 바라봅니다(`.gitignore` 대상이라 저장소에 포함되지 않으므로 각자 준비해야 합니다).

```bash
# package.json dev:https 스크립트 발췌
# next dev --experimental-https
#   --experimental-https-key ./keyfile/local-key.pem
#   --experimental-https-cert ./keyfile/local-cert.pem
#   --port 3001 --hostname 0.0.0.0
```

개발자는 모두 Windows(폐쇄망) 환경에서 개발합니다.  
mkcert 설치 파일은 파일 서버(`10.109.198.29`, `Z:\00. 공지사항\001. 설치파일\개발툴\React`)에서 받아 사용합니다.

```powershell
# 프로젝트 루트에 keyfile/ 폴더를 만들고 인증서 발급
cd hmmbl-web
mkdir keyfile
mkcert -install
mkcert -key-file keyfile/local-key.pem -cert-file keyfile/local-cert.pem localhost 127.0.0.1
```

발급 후에는 `npm run dev:https`로 HTTPS 모드를 실행합니다.  
`localhost`(loopback)는 HTTP에서도 보안 컨텍스트로 취급되므로, 일반 화면 개발은 인증서 없이 기본값인 `npm run dev`(HTTP)로 충분합니다.

> mkcert 설치 파일 확보 절차: [02-environment-setup.md](./02-environment-setup.md) 1장, [21-dev-tools.md](./21-dev-tools.md) 7장

---

## Step 3. 환경변수 설정 (`.env.local`)

프로젝트 루트에 `.env.local`을 만듭니다.  
`.gitignore` 대상이며 **절대 커밋하지 않습니다.**  
`.env.local.example`을 복사해서 시작하면 됩니다.

```bash
cp .env.local.example .env.local
```

| 변수 | 필수 여부 | 설명 |
|---|---|---|
| `NEXT_PUBLIC_APP_ENV` | 선택 (기본 `dev`) | `dev` \| `staging` \| `prod` |
| `NEXT_PUBLIC_API_BASE_URL` | dev에서는 선택 | 미설정 시 브라우저에서 `현재호스트:8000`으로 자동 추정(`lib/config/config.ts`). 로컬 API 서버가 8000 포트가 아니거나 원격 dev 서버를 쓴다면 명시적으로 설정. **staging/prod 빌드에서는 필수**(미설정 시 빌드 즉시 에러) |
| `NEXT_PUBLIC_APP_URL` | staging/prod 필수 | `/api/translate` Origin 허용에 사용 |
| `ALLOWED_DEV_ORIGINS` | 선택 (실기기 테스트 시) | 개발 PC의 로컬 IP. 콤마로 복수 지정 가능 |

> `NEXT_PUBLIC_` 접두어가 붙은 변수만 클라이언트 번들에 노출됩니다.  
> 시크릿 값에는 이 접두어를 쓰지 않습니다.
> 자세한 내용: [02-environment-setup.md](./02-environment-setup.md) 2장~3장

---

## Step 4. 개발 서버 실행

```bash
npm run dev         # HTTP(기본), http://localhost:3000
npm run dev:https   # HTTPS(선택 — Step 2 인증서 필요), https://localhost:3001
```

`https://localhost:3001` 접속 시 "연결이 안전하지 않습니다" 경고가 뜨면 로컬 인증서이므로 "고급 → 계속 진행"을 선택합니다.

이 앱은 **모바일 전용**이므로 브라우저 DevTools의 모바일 뷰(Device Toolbar, `Cmd+Shift+M`)로 iPhone 14 Pro(390×844) 등 모바일 해상도에서 확인하는 것을 기본으로 합니다.

다음을 수정하면 개발 서버를 재시작(`Ctrl+C` → `npm run dev`)해야 반영됩니다: `next.config.mjs`, `.env.local`, `tailwind.config.ts`, `instrumentation.ts`.

---

## Step 5. `/dev` 개발 도구로 프로젝트 감 잡기

`http://localhost:3000/dev`에 접속하면 개발 전용 도구 허브가 있습니다(프로덕션 빌드에서는 자동 차단됨).  
`dev:https`로 실행 중이라면 `https://localhost:3001/dev`로 접속합니다.  
처음 합류했다면 아래 순서로 5~10분 정도 둘러보는 것을 권장합니다.

| 경로 | 도구 | 이번 단계에서 할 일 |
|---|---|---|
| `/dev/ia` | IA 네비게이터 | 섹션(적립/사용/결제/마이 등)을 펼쳐보며 앱 전체 화면 구조 파악 |
| `/dev/ref/developer` | 코드 레퍼런스 | `ExamplePage.tsx` 작성 패턴(주석 포함) 확인 — Step 8에서 그대로 활용 |
| `/dev/ref/publisher` | 코드 레퍼런스 | `ExampleView.tsx` 작성 패턴 확인 (퍼블리셔가 만드는 파일이지만 Props 계약을 이해해두면 협업이 쉬움) |
| `/dev/ui` | UI 컴포넌트 카탈로그 | 이미 존재하는 공통 컴포넌트 확인 (새로 만들기 전에 여기부터 확인) |
| `/dev/auth` | 인증 디버그 | 로그인 상태·토큰·사용자 정보 확인, 토큰 refresh 테스트 |
| `/dev/bridge` | Bridge 테스트 | 네이티브 앱 없이 GPS/카메라/인증 등 브릿지 이벤트 시뮬레이션 |
| `/dev/pub` | 퍼블리셔 미리보기 | 목업 데이터로 렌더링된 View 목록 |

> 자세한 내용: [21-dev-tools.md](./21-dev-tools.md), [24-dev-preview-guide.md](./24-dev-preview-guide.md), [23-ia-navigator.md](./23-ia-navigator.md)

---

## Step 6. 아키텍처 규칙 이해하기 (코드 작성 전 필독)

### 6-1. 4개 레이어, 단방향 의존

```
app/  (Next.js 라우트 · Provider)
  └─ features/  (도메인 로직 · Page · View)
       └─ components/common/ui/  (순수 UI 컴포넌트)
            └─ lib/  (순수 인프라 · 유틸리티, React/Zustand/bridge 비의존)
```

`lib/`는 Zustand·bridge·React에 의존하지 않습니다.  
외부 동작이 필요하면 **콜백 DI(Dependency Injection)** 로 주입받습니다(`configureApiClient({ getToken, onUnauthorized, ... })`가 대표 예시).  
`lib/`에서 `useAuthStore`를 직접 import하는 코드는 리뷰에서 반려 대상입니다.

### 6-2. Page / View 분리

| 파일 | 작성자 | 역할 |
|---|---|---|
| `app/**/page.tsx` | 개발자 | Next.js 라우트 진입점. 최대한 얇게, `*Page.tsx`를 렌더링만 |
| `features/[domain]/[screen]/[Screen]Page.tsx` | **개발자** | React Query로 데이터 페칭, 라우팅, 이벤트 핸들러, View에 props 전달 |
| `features/[domain]/[screen]/[Screen]View.tsx` | 퍼블리셔 | props만 받아 렌더링. `useState`/`useEffect`/API 호출/`useRouter` 사용 금지 |

개발자는 `*Page.tsx`, `lib/`, `hooks/`(전역 Zustand store), `features/*/services/`, `proxy.ts`, `next.config.mjs`, `package.json`을 담당합니다.  
역할 경계 전체 표는 [26-roles-and-responsibilities.md](./26-roles-and-responsibilities.md)에 정리되어 있습니다.

### 6-3. features 도메인 구조

```
features/[domain]/
├── [screen]/
│   ├── [Screen]Page.tsx
│   ├── [Screen]View.tsx
│   └── components/
├── services/[domain]Api.ts     # apiClient 래퍼
├── hooks/use[Screen].ts
└── types/index.ts
```

도메인 간 직접 import는 금지입니다(`features/earn`이 `features/my`를 import하지 않음).  
공유가 필요하면 `features/shared/`를 사용합니다.

> 자세한 내용: [03-project-overview.md](./03-project-overview.md), [20-features-module-guide.md](./20-features-module-guide.md)

---

## Step 7. 인증 흐름 개요 (배경지식)

브라우저에서 `(protected)` 그룹 화면(`/earn`, `/my`, `/pay` 등)에 접속했는데 데이터가 비어 보이거나 API가 401을 반환하는 경우가 있습니다.  
버그가 아니라 의도된 동작이니 당황하지 마세요.

### `window.bridge`란?

네이티브 앱(iOS/Android)이 **자기 앱 안의 웹뷰에서 페이지를 열 때만** 주입해주는 객체입니다.  
일반 데스크톱/모바일 브라우저로 같은 URL에 접속하면 이 객체는 아예 존재하지 않습니다(`undefined`).  
그래서 코드는 `window.bridge`가 있는지 확인하는 것만으로 "지금 이 페이지가 네이티브 앱의 웹뷰 안에서 열려 있는가"를 판별합니다.

### webview-code SSO란?

`(protected)/layout.tsx`는 미인증 상태를 **로그인 화면으로 리다이렉트하지 않습니다.**  
대신 `window.bridge`가 있을 때(=네이티브 웹뷰 환경)만 아래 흐름을 자동으로 실행해, 사용자가 로그인 버튼을 누르지 않아도 네이티브 앱의 로그인 상태를 웹뷰에 그대로 이어받습니다(Single Sign-On).

```
1. window.bridge.requestAuthCode() 호출
     → 네이티브에 "이미 로그인된 세션이 있으면 1회용 코드를 달라"고 요청
2. 네이티브가 appAuthCode 이벤트로 1회용 코드를 응답
3. 그 코드로 POST /auth/token 호출 (initAuthFromCode)
     → 웹뷰 자체의 액세스 토큰 발급 → 이후 apiClient 요청에 자동 첨부
```

- 일반 브라우저에는 `window.bridge`가 없으므로 이 시도 자체가 스킵되고, 실데이터를 요구하는 API는 401을 반환할 수 있습니다.
- 개발 중에는 `/dev/auth`(Step 5)로 인증 상태를 확인하거나, `/dev/bridge`에서 `appAuthCode` 이벤트를 시뮬레이션하거나, `/dev/pub`의 목업 데이터로 UI만 먼저 확인하세요.

로컬 개발 서버(`next dev`, `NODE_ENV=development`)에서는 WebView User-Agent 게이트(`proxy.ts`)가 열려 있어 일반 브라우저로도 페이지 자체는 접근됩니다.  
이 게이트는 staging/prod 빌드에서만 활성화됩니다.

> 자세한 내용: [05-auth-system.md](./05-auth-system.md), [04-routing-architecture.md](./04-routing-architecture.md) 3장

---

## Step 8. 실습 — 신규 화면 하나를 처음부터 끝까지 만들기

아래는 `earn` 도메인에 `example`이라는 새 화면(목록 조회)을 추가하는 예시 흐름입니다.  
실제 작업 시 도메인명·화면명만 바꿔서 그대로 따라 하면 됩니다.

**진행 순서 및 검증 기준**

```
1. [IA에 화면 등록] → 검증: /dev/ia에서 새 항목이 보이는가
2. [도메인/화면 폴더 생성 + 타입 정의] → 검증: tsc 에러 없음
3. [API 서비스 함수 작성] → 검증: apiClient 경유로 호출부 작성 완료
4. [Page 컴포넌트 작성 — React Query 연동] → 검증: 콘솔에 데이터 로그 확인
5. [View 파일 생성 (템플릿 복사)] → 검증: /dev/pub 목업으로 로딩·에러·빈 상태 확인
6. [라우트 파일 생성 + 실제 연결] → 검증: 브라우저에서 /earn/example 접속 시 정상 렌더
7. [lint / type-check / build 통과] → 검증: 세 명령 모두 에러 없이 종료
```

### 8-1. IA에 화면 등록

`app/dev/ia/_data/ia.ts`의 `earn` 섹션에 항목을 추가합니다.

```ts
{ id: 'example-list', label: '예시 목록', path: '/earn/example', children: [] }
```

### 8-2. 타입 정의

```ts
// features/earn/example/types/index.ts
export interface ExampleItem {
  id: string;
  title: string;
}
```

### 8-3. API 서비스 함수

```ts
// features/earn/example/services/exampleApi.ts
import { apiClient } from '@/lib/api/apiClient';
import type { ApiListResponse } from '@/types/api';
import type { ExampleItem } from '../types';

export const exampleApi = {
  getList: () => apiClient.get<ApiListResponse<ExampleItem>>('/earn/examples'),
};
```

### 8-4. Page 컴포넌트

```tsx
// features/earn/example/ExamplePage.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { ExampleView } from './ExampleView';
import { exampleApi } from './services/exampleApi';

export function ExamplePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['earn', 'examples'],
    queryFn: () => exampleApi.getList(),
  });

  return (
    <ExampleView
      items={data?.data ?? []}
      isLoading={isLoading}
      errorMessage={error ? '목록을 불러오지 못했습니다.' : undefined}
    />
  );
}
```

`queryKey`는 `['도메인', '리소스', id?]` 형태로 계층화합니다.  
`staleTime: 0` / `gcTime: 5분` / `retry: 1`이 전역 기본값이며, 500번대 에러는 전역 Toast로, 4xx는 화면별로 처리하는 것이 이 프로젝트의 전략입니다.

### 8-4-1. (선택) 백엔드 API 준비 전 임시 데이터로 테스트하기

`/earn/examples` 엔드포인트가 아직 없거나 백엔드 작업이 끝나지 않았을 때, `exampleApi.getList()`를 임시로 목업 함수로 바꿔치기해서 Page → View 전체 흐름(로딩·에러·빈 상태 포함)을 미리 확인할 수 있습니다.  
**핵심은 실제 API와 반환 타입(`ApiListResponse<ExampleItem>`)을 동일하게 맞추는 것**입니다 — 그래야 나중에 실제 API로 교체할 때 `ExamplePage`나 `ExampleView` 코드를 한 줄도 건드릴 필요가 없습니다.

```tsx
// features/earn/example/services/exampleApi.ts
import { apiClient } from '@/lib/api/apiClient';
import type { ApiListResponse } from '@/types/api';
import type { ExampleItem } from '../types';

// TODO(백엔드 준비되면 삭제): /earn/examples 목업 응답
// 실제 apiClient.get() 대신 Promise.resolve()로 동일한 응답 형태를 흉내낸다.
function mockGetList(): Promise<ApiListResponse<ExampleItem>> {
  return Promise.resolve({
    data: [
      { id: '1', title: '목업 아이템 1' },
      { id: '2', title: '목업 아이템 2' },
      { id: '3', title: '목업 아이템 3' },
    ],
    total: 3,
    page: 1,
    size: 20,
  });
}

export const exampleApi = {
  // TODO(백엔드 준비되면 원복): apiClient.get(...) 호출로 되돌리기
  getList: () => mockGetList(),
  // getList: () => apiClient.get<ApiListResponse<ExampleItem>>('/earn/examples'),
};
```

`ExamplePage.tsx`는 **전혀 수정하지 않습니다.**  
`useQuery`가 어차피 `exampleApi.getList()`를 호출할 뿐이라, 안쪽 구현이 실제 fetch든 목업이든 Page·View 입장에서는 차이가 없습니다.  
네트워크 지연이나 에러 상태까지 확인하고 싶다면 아래처럼 임의로 흉내낼 수 있습니다.

```tsx
// 로딩 상태 확인용 — 인위적 지연
function mockGetList(): Promise<ApiListResponse<ExampleItem>> {
  return new Promise((resolve) =>
    setTimeout(() => resolve({ data: [/* ... */], total: 0, page: 1, size: 20 }), 1500),
  );
}

// 에러 상태 확인용 — reject
function mockGetList(): Promise<ApiListResponse<ExampleItem>> {
  return Promise.reject(new Error('mock error'));
}

// 빈 상태 확인용 — 빈 배열
function mockGetList(): Promise<ApiListResponse<ExampleItem>> {
  return Promise.resolve({ data: [], total: 0, page: 1, size: 20 });
}
```

**주의사항**

- 목업 코드는 반드시 `TODO` 주석과 함께 남겨서, 실제 API 연결을 잊지 않도록 합니다. PR을 올리기 전(Step 9) 목업이 남아있지 않은지 반드시 확인하세요 — `grep -rn "TODO(백엔드 준비되면" features/` 로 검색해 확인하는 습관을 들이면 좋습니다.
- 이 방법은 **Page 레이어(React Query 연동)까지 포함해서** 테스트하고 싶을 때 사용합니다. View 컴포넌트만 독립적으로, 퍼블리셔 관점에서 빠르게 확인하고 싶다면 Step 8-5에서 설명하는 `/dev/pub` 목업 등록 방식을 사용하세요 — 이쪽은 `exampleApi`/React Query를 아예 거치지 않고 View에 목업 데이터를 직접 props로 주입합니다.
- 서비스 함수 자체를 바꾸는 대신, `useQuery`의 [`initialData`](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery) 옵션으로 초기 목업 데이터만 넣어두는 방법도 있습니다. 다만 이 경우 `queryFn`이 여전히 실제 API를 호출하므로, 엔드포인트가 아직 없다면 위 방식(서비스 함수 교체)이 더 안전합니다.

### 8-5. View 파일 (템플릿 활용)

`features/_templates/ExampleView.tsx`를 복사해 시작합니다.  
실제 작성은 퍼블리셔가 담당하지만, 개발자도 Props 계약과 로딩/에러/빈 상태 3종 구현 규칙은 알아두어야 합니다(자세한 규칙: [13-page-view-pattern.md](./13-page-view-pattern.md)).

```tsx
// features/earn/example/ExampleView.tsx
interface ExampleViewProps {
  items?: { id: string; title: string }[];
  isLoading?: boolean;
  errorMessage?: string;
  onItemClick?: (id: string) => void;
}

export function ExampleView({
  items = [],
  isLoading = false,
  errorMessage,
  onItemClick,
}: ExampleViewProps) {
  if (isLoading) return <div className="animate-pulse p-4">로딩 중...</div>;
  if (errorMessage) return <div className="p-4 text-text-secondary">{errorMessage}</div>;
  if (items.length === 0) return <div className="p-4">항목이 없습니다</div>;

  return (
    <div className="flex flex-col gap-2 p-4">
      {items.map((item) => (
        <button key={item.id} onClick={() => onItemClick?.(item.id)}>
          {item.title}
        </button>
      ))}
    </div>
  );
}
```

목업 데이터로 먼저 확인하고 싶다면 `app/dev/pub/earn/example-list/page.tsx`를 만들어 `/dev/pub`에 등록합니다([14-ui-catalog-contribution.md](./14-ui-catalog-contribution.md) 3장 참고).

### 8-6. 라우트 파일 생성

```tsx
// app/(protected)/earn/example/page.tsx
import { ExamplePage } from '@/features/earn/example/ExamplePage';

export default function Page() {
  return <ExamplePage />;
}
```

`(protected)`/`(public)` 중 어느 그룹에 넣을지는 해당 화면이 webview SSO 부트스트랩(Step 7)이 필요한지로 판단합니다.

### 8-7. 확인

`http://localhost:3000/earn/example`로 접속해 렌더링을 확인합니다.  
`/dev/ia`에서도 새 항목이 보이는지 확인합니다.

> 신규 도메인(폴더) 자체를 새로 만드는 경우의 전체 절차: [20-features-module-guide.md](./20-features-module-guide.md) 7장  
> 신규 라우트 추가 절차: [04-routing-architecture.md](./04-routing-architecture.md) 5장

---

## Step 9. 커밋 전 코드 품질 체크

```bash
npm run lint            # ESLint 검사
npm run lint -- --fix   # 자동 수정 가능한 항목 수정
npm run type-check      # tsc --noEmit
npm run build            # 프로덕션 빌드 (PR 머지 전 필수)
```

주요 ESLint 규칙: `any` 사용(warn), 미사용 변수(warn, `_` 접두어는 예외), `console.log`(warn — `console.warn`/`console.error`는 허용), `prefer-const`/`no-var`/`eqeqeq`(error).  
Import는 상대경로 대신 `@/` alias를 사용합니다(`tsconfig.json`의 `paths` 설정).

### 커밋 메시지 규칙

`commitlint.config.js`에 `<type>(<scope>): <subject>` 형식이 정의되어 있습니다(`feat`/`fix`/`docs`/`style`/`refactor`/`test`/`chore`/`perf`/`ci`/`revert`).  
다만 현재 저장소에는 **husky commit-msg 훅이 설치되어 있지 않아** 커밋 시 자동 강제되지는 않습니다 — 컨벤션은 수동으로 지켜야 합니다.  
훅을 직접 설치하려면 파일 상단 주석의 안내를 따르세요.

```bash
feat(earn): add example list screen
fix(auth): resolve token cache expiry edge case
```

> 자세한 내용: [02-environment-setup.md](./02-environment-setup.md) 4장~6장

---

## Step 10. 자주 겪는 문제

| 증상 | 원인 / 해결 |
|---|---|
| `ERR_CERT_AUTHORITY_INVALID` 계속 발생 | 로컬 인증서 미발급/만료 — Step 2 재수행 |
| `(protected)` 화면이 빈 화면 또는 401 | 브라우저에는 `window.bridge`가 없어 인증 부트스트랩이 스킵됨 — Step 7 참고, `/dev/auth`·`/dev/pub` 활용 |
| `next.config.mjs`/`.env.local`/`tailwind.config.ts` 수정했는데 반영 안 됨 | 개발 서버 재시작 필요 |
| 로컬에서 `npm run build && npm start`로 확인했는데 전부 `/blocked`로 이동 | prod 빌드는 `NODE_ENV=production`이라 WebView UA 게이트가 켜짐 — 정상 동작. 게이트 로직 자체를 확인하려면 UA에 `HPointApp` 마커를 포함한 요청으로 테스트 |
| 스타일이 적용되지 않음 | 브라우저 캐시 강력 새로고침(`Cmd+Shift+R`) 후에도 안 되면 서버 재시작 |

> 자세한 내용: [24-dev-preview-guide.md](./24-dev-preview-guide.md) 6장, [31-security-infrastructure.md](./31-security-infrastructure.md) 3장

---

## Step 11. 다음 단계 — 전체 문서 인덱스

이 문서를 완료했다면 아래 문서들로 필요할 때마다 찾아보세요.

**아키텍처 / 개발자 영역**

| 문서 | 내용 |
|---|---|
| [03-project-overview.md](./03-project-overview.md) | 디렉토리 구조, 레이어 아키텍처 |
| [04-routing-architecture.md](./04-routing-architecture.md) | App Router 구조, 라우트 보호 개요 |
| [05-auth-system.md](./05-auth-system.md) | 인증 흐름 개요, Zustand AuthStore, 로그아웃 사용법 |
| [08-bridge-guide.md](./08-bridge-guide.md) | Native Bridge 전체 API |
| [06-api-client.md](./06-api-client.md) | apiClient, React Query, 에러 처리, 파일 업로드 |
| [09-i18n-guide.md](./09-i18n-guide.md) | 다국어 처리 (쿠키 + Bridge 기반) |
| [07-state-management.md](./07-state-management.md) | Zustand 전역 store |
| [20-features-module-guide.md](./20-features-module-guide.md) | features 구조, shared 컴포넌트/훅 전체 목록 |
| [21-dev-tools.md](./21-dev-tools.md) | `/dev` 도구 상세 |

**관리자 영역**

| 문서 | 내용 |
|---|---|
| [30-dpop-mode-switch-proposal.md](./30-dpop-mode-switch-proposal.md) | DPoP native 위임 모드 설계 배경 |
| [31-security-infrastructure.md](./31-security-infrastructure.md) | `proxy.ts` CSP·보안 헤더·nonce·SSO 부트스트랩·WebView 게이트 구현 상세 |
| [32-auth-dpop-internals.md](./32-auth-dpop-internals.md) | DPoP 키·토큰 캐시·갱신·apiClient DI 연결·로그아웃 내부 구현, webview/native 모드 전환 |

**퍼블리싱 / UI**

| 문서 | 내용 |
|---|---|
| [10-design-system.md](./10-design-system.md) | 색상·타이포그래피·spacing 토큰 |
| [11-component-catalog.md](./11-component-catalog.md) | 공통 UI 컴포넌트 카탈로그 |
| [12-layout-guide.md](./12-layout-guide.md) | GNB/FNB, safe-area, z-index |
| [13-page-view-pattern.md](./13-page-view-pattern.md) | Page/View 작성 규칙 상세 |
| [23-ia-navigator.md](./23-ia-navigator.md) | IA 전체 화면 목록 |
| [14-ui-catalog-contribution.md](./14-ui-catalog-contribution.md) | `/dev/ui`, `/dev/pub` 등록 방법 |

**협업 / 프로세스**

| 문서 | 내용 |
|---|---|
| [25-publisher-dev-collaboration.md](./25-publisher-dev-collaboration.md) | 파일 전달 규칙, PR 작성 방법 |
| [22-dev-publisher-collaboration.md](./22-dev-publisher-collaboration.md) | 개발자 관점 협업 가이드 |
| [26-roles-and-responsibilities.md](./26-roles-and-responsibilities.md) | 역할별 책임 매트릭스 |

**작업 이력** (`docs/work/`) — 특정 기능의 설계·구현 배경을 깊이 알고 싶을 때 참고

- `200-apiclient-fix-plan.md`, `201-apiclient-fix-implementation.md`
- `202-DPoP-네이티브-위임-설계서.md`, `203-DPoP-네이티브위임-구현결과보고서.md`
