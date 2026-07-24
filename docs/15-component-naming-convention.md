# 공통 UI 컴포넌트 명명규칙

> 대상: 퍼블리셔(작성), 개발자(리뷰)
> 경로: `components/common/ui/`, `features/[domain]/**/components/`
> 관련 문서: [00-development-standards.md](./00-development-standards.md) 4장(네이밍 컨벤션)·7-8절(forwardRef), [11-component-catalog.md](./11-component-catalog.md), [14-ui-catalog-contribution.md](./14-ui-catalog-contribution.md), [20-features-module-guide.md](./20-features-module-guide.md)

---

## 1. 개요

`docs/00` 4장의 전역 네이밍 표(컴포넌트: PascalCase 등)를 공통 UI 컴포넌트 영역에 맞춰 구체화한 문서입니다. `components/common/ui/`의 실제 관례를 표준으로 정리하고, `features/**/components/`의 서브 컴포넌트 명명 방식도 함께 다룹니다.

이 문서가 다루는 범위:
- `components/common/ui/` — 비즈니스 로직 없는 순수 공통 UI 컴포넌트
- `features/[domain]/**/components/` — 특정 화면 전용 서브 컴포넌트
- `features/shared/components/` — 여러 도메인이 공유하는 비즈니스 컴포넌트

다루지 않는 범위: `*Page.tsx`/`*View.tsx` 자체의 작성 규칙([13-page-view-pattern.md](./13-page-view-pattern.md) 참고), `app/dev/**` 카탈로그·목업 페이지.

---

## 2. `components/common/ui/` — 카테고리 구조

컴포넌트는 역할별 카테고리 폴더 아래 평면적으로 위치합니다. 폴더 자체가 이미 역할을 나타내므로 파일명에 별도 접두사를 붙이지 않습니다.

| 카테고리 | 용도 | 현재 컴포넌트 |
|---|---|---|
| `action/` | 클릭·선택 트리거 | `Button`, `FilterChip`, `BubbleButton` |
| `input/` | 폼 입력 | `Input`, `Textarea`, `Select`, `Toggle`, `SearchBar`, `DatePicker`, `ImageUploader`, `Checkbox`, `Radio` |
| `display/` | 정적 정보 표시 | `Badge`, `Card`, `Spinner`, `Skeleton`, `EmptyState`, `Header`, `TabBar`, `Table` |
| `overlay/` | 화면 위에 뜨는 레이어 | `Modal`, `ConfirmDialog`, `BottomSheet`, `Toast`, `Tooltip` |
| `navigation/` | 이동·단계 표시 | `Pagination`, `Breadcrumb`, `Stepper`, `InfiniteScrollTrigger` |
| `feedback/` | 상태·진행 피드백 | `ErrorBoundary`, `UploadProgressBar` |

```
components/common/ui/
├── action/
│   ├── Button.tsx
│   └── index.ts        # export * from './Button'; ...
├── input/
│   ├── Input.tsx
│   └── index.ts
└── ...
```

새 컴포넌트를 추가할 때는 위 6개 카테고리 중 하나에 배치합니다. 어느 카테고리에도 맞지 않는 경우 팀 논의를 거쳐 새 카테고리를 만듭니다.

## 3. 파일 명명

- **PascalCase.tsx** 고정: `Button.tsx`, `SearchBar.tsx`, `ConfirmDialog.tsx`
- 파일명 = export 되는 컴포넌트명과 동일하게 유지 (`Button.tsx` → `export function Button`)
- 접두사(`Custom`, `Common`, `Base` 등)를 붙이지 않습니다. 카테고리 폴더가 이미 그룹을 구분하므로 파일명은 컴포넌트의 일반명만 사용합니다 (`Button`, `Modal`, `Card` 등).

## 4. Export 규칙

**named export로 통일**, default export는 사용하지 않습니다 (`app/**/page.tsx`, `layout.tsx` 등 Next.js 라우트 파일 제외).

```tsx
// components/common/ui/display/Card.tsx
export function Card({ className, children, ...props }: CardProps) {
  return <div className={...}>{children}</div>;
}
```

`docs/00` 7-8절 규칙에 따라, **재사용 가능한 공통 폼 컴포넌트(`Input`, `Select`, `Textarea`, `DatePicker`)는 `forwardRef`로 구현하고 `displayName`을 반드시 지정**합니다. 그 외 컴포넌트(`Button`, `Card`, `EmptyState` 등)는 forwardRef 없이 일반 함수 컴포넌트로 작성합니다.

```tsx
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => (...)
);
Input.displayName = 'Input';
```

## 5. Props 타입 명명

**`[ComponentName]Props` interface, `I` 접두사 사용하지 않습니다.**

```tsx
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

interface CardProps extends HTMLAttributes<HTMLDivElement> { ... }
```

variant·size 등 옵션 값은 문자열 리터럴 유니온으로 정의하고, `docs/11`의 Props 표에 맞춰 문서화합니다.

## 6. 스타일링 규칙

- **Tailwind CSS + 디자인 토큰(CSS 변수)** 사용을 원칙으로 합니다. 색상·간격은 `tailwind.config.ts`에 정의된 토큰 클래스(`bg-primary`, `text-text-secondary` 등)만 사용하고 하드코딩 값(`#3B82F6`, `style={{}}`)은 금지합니다 ([10-design-system.md](./10-design-system.md) 참고).
- CSS Modules(`*.module.css`)는 Tailwind로 표현하기 어려운 예외적 케이스에만 최소한으로 허용합니다.
- 별도 `.styles.ts` 파일 분리(class-variance-authority 등)는 사용하지 않습니다 — 신규 컴포넌트는 컴포넌트 파일 내부에 Tailwind 클래스를 직접 작성합니다.

## 7. 배럴 파일(index.ts) 규칙

카테고리 폴더마다 `index.ts`에서 named export만 재수출합니다.

```ts
// components/common/ui/action/index.ts
export * from './Button';
export * from './FilterChip';
export * from './BubbleButton';
```

`export { default as X }` 패턴은 사용하지 않습니다 (모든 컴포넌트가 named export이므로 불필요).

## 8. `features/**/components/` 서브 컴포넌트 명명

특정 화면·도메인 전용 서브 컴포넌트는 [20-features-module-guide.md](./20-features-module-guide.md) 구조를 따릅니다.

```
features/[domain]/[screen]/components/
└── [ComponentName]/
    └── [ComponentName].tsx
```

- 폴더명과 파일명을 동일하게 유지합니다: `MissionCard/MissionCard.tsx`, `PointSummaryCard/PointSummaryCard.tsx`
- 도메인 접두사를 파일명에 통일해서 붙입니다. 같은 도메인 폴더 안의 컴포넌트는 도메인명으로 시작합니다 (예: `features/earn/coupon/` 안의 `CouponListPage`, `CouponListView`, `CouponCard`, `CouponFilter`).
- 역할 접미사는 실제 관례를 따릅니다.

| 접미사 | 의미 | 예 |
|---|---|---|
| `*Card` | 카드형 아이템 | `MissionCard`, `ProductCard`, `EventCard` |
| `*Item` | 리스트의 개별 항목 | `NotificationItem`, `SearchResultItem`, `FaqItem` |
| `*Form` | 입력 폼 | `CardRegisterForm`, `ProfileEditForm` |
| `*Popup` | 팝업(우선 사용) | `AdRewardPopup`, `AffiliatePopup`, `RewardPopup` |
| `*Modal` | 확인·차단성 모달 | `BlockModal`, `ReportModal` |
| `*Bar` | 바 형태 UI | `SearchBar`, `TabBar`, `UploadProgressBar` |

> `Popup`과 `Modal`이 혼용되고 있으나, 신규 작성 시에는 **차단성 확인/취소가 필요하면 `Modal`, 그 외 알림성 오버레이는 `Popup`**으로 구분해 사용합니다.

여러 도메인이 공유하는 비즈니스 컴포넌트는 `features/shared/components/[ComponentName]/[ComponentName].tsx`에 위치시킵니다. `Comment/`, `Report/`처럼 하나의 폴더에 관련 컴포넌트 여러 개(`CommentInput`, `CommentList` 등)를 묶는 것은 예외적으로 허용하되, 이 경우도 폴더명은 그룹을 대표하는 이름으로 정합니다.

## 9. 레거시(`Custom*`) 컴포넌트 처리 방침

`components/common/ui/{button,dialog,modal,checkbox,...}/Custom*.tsx` 및 `*.styles.ts`(cva 기반) 컴포넌트는 이전 세대 구현으로, **신규 작성 시 참고하지 않습니다.**

- 신규 컴포넌트는 반드시 2장의 카테고리 구조(`action/display/input/overlay/navigation/feedback`)와 Tailwind 방식을 따릅니다.
- 기존 `Custom*` 컴포넌트를 사용하는 화면을 수정하게 되면, 가능한 범위에서 신세대 대응 컴포넌트로 교체합니다.
- `Custom` 접두사는 신규 컴포넌트에 사용하지 않습니다.

## 10. 카탈로그 등록

신규·수정된 `components/common/ui/` 컴포넌트는 `/dev/ui` 카탈로그에 반드시 등록합니다. 등록 절차는 [14-ui-catalog-contribution.md](./14-ui-catalog-contribution.md)를 따릅니다.

---

## 체크리스트

**신규 공통 UI 컴포넌트(`components/common/ui/`) 작성 시**

- [ ] 6개 카테고리(`action/display/input/overlay/navigation/feedback`) 중 적절한 곳에 위치했는가?
- [ ] 파일명이 PascalCase.tsx이고 접두사(`Custom` 등)가 없는가?
- [ ] named export로 작성했는가? (default export 금지)
- [ ] `Input`/`Select`/`Textarea`/`DatePicker` 계열이라면 `forwardRef` + `displayName`을 적용했는가?
- [ ] Props 타입이 `ComponentNameProps`인가? (`I` 접두사 금지)
- [ ] Tailwind 디자인 토큰만 사용하고 하드코딩 색상이 없는가?
- [ ] 카테고리 `index.ts`에 named export로 재수출을 추가했는가?
- [ ] `/dev/ui` 카탈로그에 등록했는가?

**신규 화면 전용 서브 컴포넌트(`features/**/components/`) 작성 시**

- [ ] `[ComponentName]/[ComponentName].tsx` 폴더 구조를 따랐는가?
- [ ] 같은 도메인 폴더 내 컴포넌트와 도메인 접두사가 일치하는가?
- [ ] 역할에 맞는 접미사(`*Card`, `*Item`, `*Form`, `*Popup`, `*Modal`, `*Bar`)를 사용했는가?
- [ ] 여러 도메인이 공유하는 컴포넌트라면 `features/shared/components/`에 위치시켰는가?
