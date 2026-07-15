# UI 카탈로그 등록 가이드

> 대상: 개발자  
> 관련 파일: `app/dev/ui/page.tsx`, `app/dev/ui/[컴포넌트]/page.tsx`, `app/dev/pub/page.tsx`

---

## 1. 개요

공통 컴포넌트를 추가하거나 수정했을 때, 또는 새 화면을 작업했을 때 개발 도구(`/dev/`)에 등록합니다.  
이를 통해 팀 전체가 최신 컴포넌트와 화면을 쉽게 확인할 수 있습니다.

등록 대상은 두 곳입니다.

| 등록 위치 | 언제 | 목적 |
|---|---|---|
| `app/dev/ui/page.tsx` | 공통 컴포넌트 추가·수정 시 | 컴포넌트 카탈로그 업데이트 |
| `app/dev/pub/page.tsx` | 화면(View) 작업 시 | 목업 화면 미리보기 등록 |

---

## 2. 공통 컴포넌트 카탈로그 등록 (`/dev/ui`)

### 2-1. 통합 카탈로그 페이지에 추가 (`app/dev/ui/page.tsx`)

`app/dev/ui/page.tsx`는 탭별로 컴포넌트를 구분해 렌더링합니다.  
새 컴포넌트를 추가하면 이 파일을 수정합니다.

**Step 1 — import 추가**

파일 상단의 import 블록에 새 컴포넌트를 추가합니다.  
카테고리에 맞는 위치에 넣습니다.

```tsx
// 예시: 새 컴포넌트 'RatingStars'를 display 카테고리에 추가
import { RatingStars } from '@/components/common/ui/display/RatingStars';
```

**Step 2 — 탭 목록에 추가 (신규 카테고리인 경우만)**

기존 5개 탭(입력, 액션, 표시, 오버레이, 탐색) 외 새 카테고리가 생기면 `TABS` 배열에 추가합니다.  
기존 카테고리에 속하면 이 단계는 생략합니다.

```tsx
const TABS = [
  { id: 0, label: '입력' },
  { id: 1, label: '액션' },
  { id: 2, label: '표시' },
  { id: 3, label: '오버레이' },
  { id: 4, label: '탐색' },
  { id: 5, label: '피드백' },  // 신규 카테고리 추가 예시
] as const;
```

**Step 3 — 해당 탭 섹션에 컴포넌트 렌더링 추가**

컴포넌트가 속하는 탭의 렌더 블록(`{tab === N && (...)}`)을 찾아 `<Section>` 단위로 추가합니다.

```tsx
{/* 예시: 표시 탭(tab === 2)에 RatingStars 추가 */}
{tab === 2 && (
  <div>
    {/* ... 기존 섹션들 ... */}

    <Section title="RatingStars">
      <RatingStars value={3} max={5} />
      <RatingStars value={5} max={5} />
      <RatingStars value={1} max={5} readOnly />
    </Section>
  </div>
)}
```

`Section` 컴포넌트는 `app/dev/ui/page.tsx` 내부에 이미 정의되어 있습니다.

```tsx
// Section 사용법
<Section title="컴포넌트 이름">
  {/* 다양한 variant/size/상태를 보여주는 예시들 */}
</Section>
```

### 2-2. 컴포넌트 전용 페이지 추가 (선택사항)

복잡한 컴포넌트는 별도 페이지(`app/dev/ui/[컴포넌트]/page.tsx`)를 만들어 더 자세히 보여줄 수 있습니다.

기존 예시: `app/dev/ui/button/`, `app/dev/ui/input/`, `app/dev/ui/modal/`, `app/dev/ui/table/`, `app/dev/ui/toast/`, `app/dev/ui/tokens/`(디자인 토큰 전용)

```
app/dev/ui/
  ├── page.tsx              ← 통합 카탈로그 (반드시 등록)
  ├── button/page.tsx       ← Button 전용
  ├── input/page.tsx        ← Input 전용
  ├── modal/page.tsx        ← Modal 전용
  ├── table/page.tsx        ← Table 전용
  ├── toast/page.tsx        ← Toast 전용
  ├── tokens/page.tsx       ← 디자인 토큰 전용
  └── rating-stars/page.tsx ← 새 컴포넌트 전용 (선택, 추가 예시)
```

전용 페이지를 만들었다면 통합 카탈로그에도 반드시 등록합니다.

---

## 3. 퍼블리셔 화면 미리보기 등록 (`/dev/pub`)

화면(View) 작업이 완료되면 `/dev/pub` 목록에 등록해 개발자와 공유합니다.

### 3-1. 미리보기 페이지 파일 생성

`app/dev/pub/[섹션]/[화면명]/page.tsx` 위치에 파일을 만듭니다.

```
app/dev/pub/
  ├── page.tsx                          ← 목록 페이지 (반드시 등록)
  └── earn/
      ├── coupon-list/page.tsx          ← 기존 예시
      └── mission-list/page.tsx         ← 신규 추가 예시
```

미리보기 페이지는 View 컴포넌트에 **목업 데이터를 직접 주입**해 렌더링합니다.

```tsx
// app/dev/pub/earn/mission-list/page.tsx
'use client';
import { MissionListView } from '@/features/earn/mission/components/MissionListView';

const MOCK_MISSIONS = [
  { id: '1', title: '앱 접속 미션', description: '매일 앱에 접속하세요', point: 10, badge: 'NEW' },
  { id: '2', title: '포인트 사용 미션', description: '포인트를 1회 사용하세요', point: 50 },
  { id: '3', title: '설문 참여 미션', description: '설문에 참여하세요', point: 30 },
];

const MOCK_FILTERS = [
  { id: 'all', label: '전체' },
  { id: 'active', label: '진행중' },
  { id: 'done', label: '완료' },
];

export default function MissionListPreviewPage() {
  return (
    <MissionListView
      items={MOCK_MISSIONS}
      filters={MOCK_FILTERS}
      selectedFilter="all"
      isLoading={false}
    />
  );
}
```

### 3-2. 목록 페이지에 화면 등록 (`app/dev/pub/page.tsx`)

`app/dev/pub/page.tsx`의 `PUB_SCREENS` 배열에 새 화면을 추가합니다.

```tsx
const PUB_SCREENS = [
  {
    domain: '적립 (earn)',
    screens: [
      { label: '쿠폰 목록', href: '/dev/pub/earn/coupon-list' },
      { label: '미션 목록', href: '/dev/pub/earn/mission-list' },  // 추가
    ],
  },
  {
    domain: '결제 (pay)',    // 도메인이 없으면 새 그룹 추가
    screens: [
      { label: '충전 내역', href: '/dev/pub/pay/charge-history' },
    ],
  },
];
```

---

## 4. 자주 하는 실수

**import만 추가하고 섹션에 렌더링을 빠뜨리는 경우**
- import 추가 후 반드시 해당 탭 렌더 블록에 `<Section>`을 추가합니다.

**목업 데이터 없이 빈 배열만 전달하는 경우**
- 최소 2~3개 이상의 목업 아이템을 사용해 실제 UI를 확인합니다.

**로딩·빈 상태를 누락하는 경우**
- 목업 페이지에서 `isLoading={true}`, `items={[]}`를 각각 넣어 세 가지 상태를 모두 확인합니다.
