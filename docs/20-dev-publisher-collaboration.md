# 개발자 ↔ 퍼블리셔 협업 가이드 (개발자 시점)

> 대상: 개발자  
> Page 작성 절차, Props 인터페이스 공유, PR 리뷰 체크리스트, antd-mobile 업그레이드를 다룹니다.

---

## 1. 역할 분담

| 영역 | 개발자 | 퍼블리셔 |
|---|---|---|
| `*Page.tsx` | ✅ 작성 | — |
| `app/**/page.tsx` | ✅ 생성 | — |
| `*View.tsx` | 리뷰 | ✅ 작성 |
| `components/common/ui/` | 리뷰 | ✅ 주도 |
| `features/shared/components/` | ✅ 작성 | 리뷰 |
| `features/*/services/` | ✅ 작성 | — |
| `features/*/types/` | ✅ 확정 | 초안 작성 |
| `styles/globals.css` | 협의 | 협의 |
| `tailwind.config.ts` | ✅ 리뷰 필수 | 협의 |
| `lib/`, `hooks/` | ✅ 전담 | — |

---

## 2. Page 파일 작성 절차

### 새 화면 추가 시

1. 퍼블리셔로부터 View PR을 받아 Props 인터페이스를 확정합니다.
2. `app/(protected)/[domain]/[screen]/page.tsx` 라우트 파일 생성합니다.
3. `features/[domain]/[screen]/[ScreenName]Page.tsx` 작성합니다.
4. React Query로 데이터를 페칭하고 View에 props를 전달합니다.
5. `app/dev/ia/_data/ia.ts`에 IA 항목을 추가합니다.

```tsx
// features/earn/mission/MissionPage.tsx
'use client';
import { useQuery } from '@tanstack/react-query';
import { MissionView }  from './MissionView';
import { missionApi }   from './services/missionApi';

export function MissionPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['earn', 'missions'],
    queryFn:  () => missionApi.getList(),
  });

  return (
    <MissionView
      items={data?.data ?? []}
      isLoading={isLoading}
      errorMessage={error ? '미션 목록을 불러오지 못했습니다.' : undefined}
      onItemClick={(id) => router.push(`/earn/mission/${id}`)}
    />
  );
}
```

---

## 3. Props 인터페이스 공유

퍼블리셔가 먼저 작업하는 경우와 개발자가 먼저 API를 확정하는 경우 모두 있습니다.

### 개발자가 API를 먼저 확정할 때 (권장)

`features/[domain]/types/index.ts`에 타입을 작성하고 퍼블리셔와 공유합니다.

```ts
// features/earn/mission/types/index.ts
export interface MissionItem {
  id:          string;
  title:       string;
  description: string;
  point:       number;
  badge?:      'NEW' | 'HOT';
  isCompleted: boolean;
}

export interface MissionFilter {
  id:    string;
  label: string;
}

// View Props는 개발자가 확정 후 공유
export interface MissionViewProps {
  items:          MissionItem[];
  filters:        MissionFilter[];
  selectedFilter: string;
  isLoading:      boolean;
  errorMessage?:  string;
  onItemClick?:   (id: string) => void;
  onFilterChange?: (filterId: string) => void;
}
```

퍼블리셔는 이 타입을 import해 View를 작성합니다.

```ts
import type { MissionViewProps } from '@/features/earn/mission/types';
```

### 퍼블리셔가 먼저 작업할 때

퍼블리셔 PR의 "개발자 확인 필요" 항목을 확인하고, 코드 리뷰에서 Props를 확정하거나 수정 요청합니다.

---

## 4. 퍼블리셔 PR 리뷰 체크리스트

퍼블리셔 PR을 리뷰할 때 아래 항목을 확인합니다.

### 레이어 위반 여부

```ts
// ❌ View에서 직접 API 호출 금지
import { apiClient } from '@/lib/api/apiClient';
const data = await apiClient.get('/earn/missions');

// ❌ View에서 useRouter, useParams 사용 금지
const router = useRouter();

// ❌ View에서 useState로 비즈니스 상태 관리 금지
const [missions, setMissions] = useState([]);

// ✅ View는 props만 받아야 함
export function MissionView({ items, isLoading, onItemClick }: MissionViewProps) { ... }
```

### `'use client'` 누락

antd-mobile 컴포넌트를 사용한 파일에 `'use client'` 선언이 없으면 서버 사이드에서 에러가 발생합니다.

```ts
// ✅ antd-mobile 사용 시 필수
'use client';
import { Swiper } from 'antd-mobile';
```

### 번들 크기 영향

새로 도입한 antd-mobile 컴포넌트가 있으면 빌드 후 번들 크기를 확인합니다.

```bash
npm run build
# .next/analyze/ 에서 번들 분석 확인 (bundle-analyzer 설정 시)
```

### 이미지 도메인 신규 등록 필요 여부

퍼블리셔 PR 본문에 "이미지 도메인 등록 필요" 항목이 있으면 `next.config.mjs`에 추가합니다.

```js
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '**.hpoint.com' },
    { protocol: 'https', hostname: 'cdn.partner.com' },  // 신규 추가
  ],
},
```

### 공통 체크리스트

- [ ] View에서 `useState` / `useEffect` / `apiClient` 사용이 없는가?
- [ ] 콜백 props가 모두 optional(`?`)인가?
- [ ] 로딩 / 에러 / 빈 상태 3종이 구현되어 있는가?
- [ ] antd-mobile 컴포넌트 사용 파일에 `'use client'`가 있는가?
- [ ] 하드코딩 색상값 없이 Tailwind 토큰을 사용했는가?
- [ ] `<img>` 대신 `next/image`를 사용했는가?
- [ ] `/dev/pub`에 목업 미리보기가 등록되어 있는가?

---

## 5. antd-mobile 설치 및 업그레이드

antd-mobile은 개발자가 `package.json`을 관리합니다.

### 최초 설치

```bash
npm install antd-mobile
```

설치 후 `02-antd-mobile-guide.md`에 따라 CSS import와 Tailwind 호환 설정을 확인합니다.

### 버전 업그레이드

```bash
# 현재 버전 확인
npm list antd-mobile

# 업그레이드
npm install antd-mobile@latest

# 변경 로그 확인 (breaking change 여부)
# https://github.com/ant-design/ant-design-mobile/releases
```

업그레이드 전 퍼블리셔와 함께 영향도를 검토합니다:
1. 팀 채팅에서 업그레이드 필요성과 대상 버전 공유
2. 개발 브랜치에서 업그레이드 후 퍼블리셔와 함께 UI 검증
3. 이상 없으면 `develop`에 머지

### 신규 antd-mobile 컴포넌트 도입

퍼블리셔가 처음 사용하는 antd-mobile 컴포넌트를 PR에 포함시켰을 때:

1. `'use client'` 선언 확인
2. CSS 변수 오버라이드 필요 여부 확인 (`02-antd-mobile-guide.md` 참고)
3. 번들 크기 영향 확인

---

## 6. 브랜치 전략

```
main            ← 배포 브랜치 (직접 push 금지)
  └── develop   ← 통합 브랜치
        ├── feature/pub/earn-mission-list   ← 퍼블리셔 작업
        └── feature/dev/earn-mission-api    ← 개발자 작업
```

**개발자 브랜치 네이밍**

```
feature/dev/[섹션]-[기능명]

예시:
feature/dev/earn-mission-api
feature/dev/auth-dpop-refresh
feature/dev/bridge-step-count
```

`develop` → `main` 머지는 개발자가 담당합니다.

---

## 7. 개발자 PR 체크리스트

- [ ] `lib/` 레이어에 bridge·Zustand 직접 import가 없는가?
- [ ] 콜백 DI 패턴을 올바르게 사용했는가?
- [ ] 신규 Bridge 이벤트를 `ALLOWED_EVENTS`와 `bridgeProtocol.ts`에 등록했는가?
- [ ] 신규 API 엔드포인트의 에러 코드를 `types/errors.ts`에 추가했는가?
- [ ] React Query `queryKey`가 유니크하고 무효화(invalidate) 범위가 적절한가?
- [ ] 신규 이미지 도메인을 `next.config.mjs`에 추가했는가?
- [ ] `npm run build` 에러 없이 통과하는가?
- [ ] `npm run lint` 에러 없이 통과하는가?
