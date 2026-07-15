# Page / View 패턴 가이드

> 대상: 개발자  
> 템플릿 위치: `features/_templates/`  
> 레퍼런스 확인: `http://localhost:3000/dev/ref/publisher`

---

## 1. 핵심 개념

이 프로젝트는 화면을 **Page**와 **View** 두 레이어로 분리합니다.

| 레이어 | 파일명 | 작성자 | 역할 |
|---|---|---|---|
| `Page` | `*Page.tsx` | 개발자 | 데이터 페칭, 라우팅, 상태 관리 |
| `View` | `*View.tsx` | **퍼블리셔** | UI 렌더링 (순수 표현층) |

```
app/(protected)/earn/coupon/[id]/page.tsx   ← Next.js 라우트 (개발자)
  └── features/earn/coupon/CouponDetailPage.tsx  ← 데이터 컨테이너 (개발자)
        └── features/earn/coupon/CouponDetailView.tsx  ← UI (퍼블리셔)
```

---

## 2. View 작성 규칙

퍼블리셔는 `*View.tsx` 파일만 작성합니다.

### 허용 사항 ✅

- Tailwind 유틸리티 클래스로 스타일링
- `next/image` 사용 (`<img>` 태그 직접 사용 금지)
- props를 통해서만 데이터 수신
- 콜백 props는 `optional(?)`로 선언 (목업 단독 렌더 가능하도록)
- 공통 컴포넌트(`components/common/ui/`) import

### 금지 사항 ❌

- `useState` / `useEffect` 사용 금지
- `fetch` / `apiClient` / React Query 직접 호출 금지
- `useRouter` / `useParams` 사용 금지 (Page 담당)
- 하드코딩 색상값 사용 금지 (CSS 변수 토큰 사용)

---

## 3. 템플릿 파일

`features/_templates/ExampleView.tsx`를 복사해서 새 View 작업을 시작합니다.

```tsx
// features/_templates/ExampleView.tsx 구조 요약

// 1. 타입 정의 — View가 받을 데이터 구조
interface ExampleItem { id: string; title: string; ... }

// 2. Props 인터페이스 — 모든 prop은 optional 권장
interface ExampleViewProps {
  items?: ExampleItem[];
  isLoading?: boolean;
  errorMessage?: string;
  onItemClick?: (id: string) => void;   // 콜백은 반드시 optional
}

// 3. 메인 컴포넌트 — 로딩 / 에러 / 빈 / 정상 4가지 상태 처리
export function ExampleView({ items = [], isLoading = false, ... }: ExampleViewProps) {
  if (isLoading) return <로딩 스켈레톤 />;
  if (errorMessage) return <에러 UI />;
  if (items.length === 0) return <빈 상태 UI />;
  return <정상 렌더 />;
}
```

실제 코드는 `http://localhost:3000/dev/ref/publisher`에서 확인합니다.

---

## 4. 필수 구현 상태 3종

모든 View는 아래 세 가지 상태를 반드시 구현합니다.

### 로딩 상태 (`isLoading`)

```tsx
if (isLoading) {
  return (
    <div className="flex flex-col gap-4 p-4 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 rounded-xl bg-bg-tertiary" />
      ))}
    </div>
  );
}
```

또는 `Skeleton` 공통 컴포넌트를 사용합니다.

```tsx
import { Skeleton } from '@/components/common/ui/display/Skeleton';

<Skeleton className="h-4 w-full mb-2" />
```

### 에러 상태 (`errorMessage`)

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

### 빈 상태 (데이터 0개)

```tsx
import { EmptyState } from '@/components/common/ui/display/EmptyState';

if (items.length === 0) {
  return <EmptyState title="항목이 없습니다" description="조건을 변경해 다시 시도해 보세요" />;
}
```

---

## 5. 신규 화면 추가 절차

새 화면을 추가할 때의 순서입니다.

1. **개발자와 협의** — 화면 번호(IA), 라우트 경로, Props 인터페이스를 확인합니다.
2. **View 파일 생성** — `features/_templates/ExampleView.tsx`를 복사해 해당 feature 폴더에 생성합니다.
   ```
   features/earn/coupon/components/CouponDetailView/
     └── CouponDetailView.tsx
   ```
3. **목업 데이터로 작업** — Props를 optional로 선언하면 Page 없이 단독으로 렌더링할 수 있습니다.
4. **dev/pub에 등록** — 작업 중인 화면을 퍼블리셔 미리보기(`/dev/pub`)에 등록해 확인합니다. ([14-ui-catalog-contribution.md](./14-ui-catalog-contribution.md) 참고)
5. **개발자에게 전달** — PR을 올리고 개발자가 Page 파일과 연결합니다.

---

## 6. Props 협의 방법

View 작업 전 개발자와 Props 인터페이스를 협의합니다.

**퍼블리셔가 먼저 작성하는 경우 (목업 선행)**
- 기획서를 보고 필요한 데이터를 추정해 임시 Props를 작성합니다.
- PR에 "Props 확정 필요" 라벨을 달고 개발자에게 리뷰를 요청합니다.

**개발자가 먼저 API를 확정한 경우**
- 개발자가 Props 인터페이스 파일을 미리 작성해 공유합니다.
- 퍼블리셔는 해당 인터페이스에 맞춰 View를 작성합니다.

