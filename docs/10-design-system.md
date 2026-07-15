# 디자인 시스템 가이드

> 대상: 개발자  
> 기준: `styles/globals.css` · `tailwind.config.ts`

---

## 1. 개요

이 프로젝트의 디자인 시스템은 **CSS 변수(토큰) + Tailwind CSS** 조합으로 구성됩니다.

- 모든 색상·크기·그림자 값은 `styles/globals.css`의 CSS 변수(`:root`)로 정의됩니다.
- Tailwind는 이 CSS 변수를 참조하도록 `tailwind.config.ts`에 연결되어 있습니다.
- 퍼블리셔는 **하드코딩된 색상값(`#3B82F6`, `gray-500` 등)을 직접 쓰지 않고** 토큰 기반 Tailwind 클래스를 사용합니다.

---

## 2. 색상 토큰

### 브랜드 색상

| Tailwind 클래스 | CSS 변수 | 값 | 용도 |
|---|---|---|---|
| `bg-primary` / `text-primary` | `--color-primary` | `#3B82F6` | 주요 액션, 버튼, 링크 |
| `bg-primary-hover` | `--color-primary-hover` | `#2563EB` | primary hover 상태 |
| `bg-primary-light` | `--color-primary-light` | `#EFF6FF` | primary 배경 강조 영역 |
| `bg-secondary` / `text-secondary` | `--color-secondary` | `#6B7280` | 보조 버튼, 비활성 텍스트 |
| `bg-secondary-hover` | `--color-secondary-hover` | `#4B5563` | secondary hover 상태 |

### 포커스 링

| CSS 변수 | 값 | 용도 |
|---|---|---|
| `--color-ring-focus` | `#93C5FD` | 포커스 링(정상) |
| `--color-ring-error` | `#FCA5A5` | 포커스 링(에러 필드) |

### 상태 색상

| Tailwind 클래스 | CSS 변수 | 값 | 용도 |
|---|---|---|---|
| `bg-success` | `--color-success` | `#10B981` | 성공, 완료 |
| `bg-success-hover` | `--color-success-hover` | `#059669` | success hover 상태 |
| `bg-success-light` | `--color-success-light` | `#D1FAE5` | 성공 배경 |
| `text-success-text` | `--color-success-text` | `#065F46` | 성공 텍스트 |
| `bg-warning` | `--color-warning` | `#F59E0B` | 경고 |
| `bg-warning-hover` | `--color-warning-hover` | `#D97706` | warning hover 상태 |
| `bg-warning-light` | `--color-warning-light` | `#FEF3C7` | 경고 배경 |
| `text-warning-text` | `--color-warning-text` | `#B45309` | 경고 텍스트 |
| `bg-error` | `--color-error` | `#EF4444` | 에러, 삭제 |
| `bg-error-hover` | `--color-error-hover` | `#DC2626` | error hover 상태 |
| `bg-error-light` | `--color-error-light` | `#FEE2E2` | 에러 배경 |
| `text-error-text` | `--color-error-text` | `#B91C1C` | 에러 텍스트 |
| `bg-info` | `--color-info` | `#3B82F6` | 정보 안내 |
| `bg-info-light` | `--color-info-light` | `#DBEAFE` | 정보 배경 |
| `text-info-text` | `--color-info-text` | `#1D4ED8` | 정보 텍스트 |

### 배경 색상

| Tailwind 클래스 | CSS 변수 | 값 | 용도 |
|---|---|---|---|
| `bg-bg-primary` | `--color-bg-primary` | `#FFFFFF` | 기본 페이지 배경 |
| `bg-bg-secondary` | `--color-bg-secondary` | `#F9FAFB` | 섹션 배경, 카드 배경 |
| `bg-bg-tertiary` | `--color-bg-tertiary` | `#F3F4F6` | 입력 필드 배경, 태그 배경 |
| `bg-bg-hover` | `--color-bg-hover` | `#E5E7EB` | hover 상태 배경 |

### 텍스트 색상

| Tailwind 클래스 | CSS 변수 | 용도 |
|---|---|---|
| `text-text-primary` | `--color-text-primary` | 본문, 제목 등 기본 텍스트 |
| `text-text-secondary` | `--color-text-secondary` | 부제목, 설명 텍스트 |
| `text-text-disabled` | `--color-text-disabled` | 비활성 텍스트 |
| `text-text-inverse` | `--color-text-inverse` | 어두운 배경 위 흰색 텍스트 |
| `text-text-placeholder` | `--color-text-placeholder` | 입력 필드 placeholder |

### 테두리 색상

| Tailwind 클래스 | CSS 변수 | 용도 |
|---|---|---|
| `border-border-default` | `--color-border-default` | 기본 구분선, 카드 테두리 |
| `border-border-focus` | `--color-border-focus` | 포커스 상태 |
| `border-border-error` | `--color-border-error` | 에러 상태 |
| `border-border-muted` | `--color-border-muted` | 약한 구분선 |
| `border-border-hover` | `--color-border-hover` | hover 상태 테두리 |
| `border-border-subtle` | `--color-border-subtle` | 매우 약한 구분선 |

---

## 3. 모서리 반경 (Border Radius)

| Tailwind 클래스 | CSS 변수 | 값 | 용도 |
|---|---|---|---|
| `rounded-sm` | `--radius-sm` | `4px` | 태그, 뱃지 |
| `rounded-md` | `--radius-md` | `8px` | 버튼, 입력 필드 |
| `rounded-lg` | `--radius-lg` | `12px` | 카드 |
| `rounded-xl` | `--radius-xl` | `16px` | 모달, 바텀시트 |
| `rounded-full` | `--radius-full` | `9999px` | 알약형 버튼, 아바타 |

> `rounded-none`(`0px`)·`rounded-2xl`(`24px`)은 `tailwind.config.ts`에 커스텀 매핑되어 있지 않아 Tailwind 기본값을 사용합니다.  
> CSS 변수 `--radius-none`·`--radius-2xl`은 `globals.css`에 정의만 되어 있고 아직 Tailwind 클래스에 연결되지 않았습니다.

---

## 4. 그림자 (Shadow)

| Tailwind 클래스 | CSS 변수 | 용도 |
|---|---|---|
| `shadow-sm` | `--shadow-sm` | 카드, 입력 필드 미세 그림자 |
| `shadow-md` | `--shadow-md` | 드롭다운, 팝오버 |
| `shadow-lg` | `--shadow-lg` | 모달, 바텀시트 |

> `shadow-none`·`shadow-xl`·`shadow-inner`은 `tailwind.config.ts`에 커스텀 매핑되어 있지 않아 Tailwind 기본값을 사용합니다(`shadow-inner`는 우연히 CSS 변수 값과 동일).  
> CSS 변수 `--shadow-none`·`--shadow-xl`·`--shadow-inner`는 `globals.css`에 정의만 되어 있습니다.

---

## 5. 간격 (Spacing)

프로젝트는 **4px 기반 간격 스케일**을 사용합니다.  
CSS 변수로 정의되어 있으나, 간격에는 Tailwind 기본 유틸리티(`p-4`, `gap-2` 등)를 사용합니다.

| CSS 변수 | 값 | Tailwind 대응 |
|---|---|---|
| `--spacing-1` | `4px` | `p-1`, `m-1`, `gap-1` |
| `--spacing-2` | `8px` | `p-2`, `m-2`, `gap-2` |
| `--spacing-3` | `12px` | `p-3`, `m-3`, `gap-3` |
| `--spacing-4` | `16px` | `p-4`, `m-4`, `gap-4` |
| `--spacing-6` | `24px` | `p-6`, `m-6`, `gap-6` |
| `--spacing-8` | `32px` | `p-8`, `m-8`, `gap-8` |
| `--spacing-12` | `48px` | `p-12`, `m-12` |
| `--spacing-16` | `64px` | `p-16`, `m-16` |

---

## 6. 타이포그래피

| CSS 변수 | 값 | Tailwind 대응 |
|---|---|---|
| `--font-size-xs` | `12px` | `text-xs` |
| `--font-size-sm` | `14px` | `text-sm` |
| `--font-size-base` | `16px` | `text-base` |
| `--font-size-lg` | `18px` | `text-lg` |
| `--font-size-xl` | `20px` | `text-xl` |
| `--font-size-2xl` | `24px` | `text-2xl` |
| `--font-size-3xl` | `30px` | `text-3xl` |

| CSS 변수 | 값 | Tailwind 대응 |
|---|---|---|
| `--font-weight-regular` | `400` | `font-normal` |
| `--font-weight-medium` | `500` | `font-medium` |
| `--font-weight-semibold` | `600` | `font-semibold` |
| `--font-weight-bold` | `700` | `font-bold` |

| CSS 변수 | 값 | Tailwind 대응 |
|---|---|---|
| `--line-height-tight` | `1.25` | `leading-tight` |
| `--line-height-normal` | `1.5` | `leading-normal` |
| `--line-height-relaxed` | `1.75` | `leading-relaxed` |

---

## 7. 사용 예시

```tsx
// ✅ 올바른 사용 — 토큰 기반 Tailwind 클래스
<div className="bg-bg-secondary rounded-lg shadow-sm p-4">
  <p className="text-text-primary text-sm font-medium">제목</p>
  <p className="text-text-secondary text-xs mt-1">설명</p>
</div>

// ❌ 잘못된 사용 — 하드코딩
<div style={{ backgroundColor: '#F9FAFB', borderRadius: '12px' }}>
  <p style={{ color: '#111827' }}>제목</p>
</div>
```

---

## 8. 토큰 값 수정이 필요한 경우

CSS 변수 값을 수정해야 할 때는 `styles/globals.css`의 `:root` 블록만 수정합니다.  
Tailwind 클래스명은 그대로 유지되므로 마크업을 바꿀 필요가 없습니다.

> ⚠️ `styles/globals.css`는 퍼블리셔와 개발자가 함께 사용하는 파일입니다.  
> 수정 전 개발자에게 공유하세요.  
> 자세한 협업 절차는 [25-publisher-dev-collaboration.md](./25-publisher-dev-collaboration.md)를 참고하세요.
