# 공통 컴포넌트 카탈로그

> 대상: 개발자  
> 경로: `components/common/ui/`  
> 실제 동작 확인: `http://localhost:3000/dev/ui` (기본, HTTP)

---

## 1. 개요

자체 공통 컴포넌트는 `components/common/ui/` 하위에 카테고리별로 구성됩니다.  
화면에 필요한 UI는 **자체 컴포넌트를 우선 사용**합니다.

모든 컴포넌트는 `/dev/ui` 카탈로그 페이지에서 실제 렌더링을 확인할 수 있습니다.

---

## 2. 액션 (action/)

### Button

범용 버튼 컴포넌트입니다.

```tsx
import { Button } from '@/components/common/ui/action/Button';

<Button variant="primary" size="md" onClick={handleClick}>저장</Button>
<Button variant="danger" isLoading>삭제 중</Button>
<Button variant="outline" fullWidth leftIcon={<IconPlus />}>추가</Button>
```

| Prop | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'ghost' \| 'outline'` | `'primary'` | 버튼 스타일 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 버튼 크기 |
| `isLoading` | `boolean` | `false` | 로딩 스피너 표시 |
| `disabled` | `boolean` | `false` | 비활성 상태 |
| `fullWidth` | `boolean` | `false` | 100% 너비 |
| `leftIcon` | `ReactNode` | — | 좌측 아이콘 |
| `rightIcon` | `ReactNode` | — | 우측 아이콘 |

### FilterChip

필터 탭/태그 선택 컴포넌트입니다.

```tsx
import { FilterChip } from '@/components/common/ui/action/FilterChip';

<FilterChip label="전체" selected={true} onToggle={(selected) => handleToggle(selected)} />
```

### BubbleButton

말풍선 모양의 버튼입니다.  
툴팁형 안내 UI에 사용합니다.

```tsx
import { BubbleButton } from '@/components/common/ui/action/BubbleButton';

<BubbleButton tailPosition="bottom" variant="primary">포인트 적립</BubbleButton>
```

| Prop | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `tailPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | 말풍선 꼬리 방향 |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'danger'` | `'primary'` | 스타일 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 크기 |

---

## 3. 입력 (input/)

### Input

텍스트 입력 필드입니다.

```tsx
import { Input } from '@/components/common/ui/input/Input';

<Input label="이름" value={name} onChange={e => setName(e.target.value)} placeholder="입력하세요" />
<Input label="비밀번호" type="password" value={pw} onChange={e => setPw(e.target.value)} />
<Input label="에러 상태" value={val} onChange={handleChange} error="올바르지 않은 형식입니다" />
<Input label="비활성" value="" onChange={() => {}} disabled />
```

| Prop | 타입 | 설명 |
|---|---|---|
| `label` | `string` | 입력 필드 레이블 |
| `error` | `string` | 에러 메시지 (있으면 에러 스타일 적용) |
| `disabled` | `boolean` | 비활성 상태 |

### Textarea

여러 줄 텍스트 입력입니다.

```tsx
import { Textarea } from '@/components/common/ui/input/Textarea';

<Textarea label="메모" value={text} onChange={e => setText(e.target.value)} rows={3} />
```

### Select

드롭다운 선택 필드입니다.

```tsx
import { Select } from '@/components/common/ui/input/Select';

<Select
  label="역할"
  value={role}
  onChange={e => setRole(e.target.value)}
  options={[
    { value: '', label: '선택하세요' },
    { value: 'admin', label: '관리자' },
    { value: 'user', label: '일반 사용자' },
  ]}
/>
```

### Toggle

온/오프 토글 스위치입니다.

```tsx
import { Toggle } from '@/components/common/ui/input/Toggle';

<Toggle checked={enabled} onChange={setEnabled} />
```

### SearchBar

검색 입력 바입니다.

```tsx
import { SearchBar } from '@/components/common/ui/input/SearchBar';

<SearchBar value={query} onChange={setQuery} placeholder="검색어를 입력하세요" />
```

### DatePicker

날짜/시간 선택 필드입니다.

```tsx
import { DatePicker } from '@/components/common/ui/input/DatePicker';

<DatePicker label="날짜" mode="date" value={date} onChange={e => setDate(e.target.value)} />
<DatePicker label="년월" mode="month" value={month} onChange={e => setMonth(e.target.value)} />
```

| `mode` 값 | 설명 |
|---|---|
| `'date'` | 연-월-일 |
| `'datetime-local'` | 연-월-일-시-분 |
| `'year'` | 연도만 |
| `'month'` | 연-월 |

### ImageUploader

이미지 선택/업로드 트리거 컴포넌트입니다.

```tsx
import { ImageUploader } from '@/components/common/ui/input/ImageUploader';

<ImageUploader onSelect={(file) => handleUpload(file)} />
```

> ⚠️ `input/Checkbox.tsx`(복수 선택·약관 다중 동의)와 `input/Radio.tsx`(단일 선택·본인인증 수단)는 파일만 존재하고 아직 구현되지 않은 빈 스텁입니다(`export {}`).  
> 사용이 필요하면 개발자에게 구현을 요청하세요.

---

## 4. 표시 (display/)

### Badge

상태 뱃지입니다.

```tsx
import { Badge } from '@/components/common/ui/display/Badge';

<Badge>기본</Badge>
<Badge variant="success">완료</Badge>
<Badge variant="warning">대기</Badge>
<Badge variant="error">오류</Badge>
<Badge variant="info">정보</Badge>
```

### Card

카드 컨테이너입니다.

```tsx
import { Card } from '@/components/common/ui/display/Card';

<Card className="p-4">카드 내용</Card>
<Card className="p-4" onClick={handleClick}>클릭 가능한 카드</Card>
```

### Spinner

로딩 스피너입니다.

```tsx
import { Spinner } from '@/components/common/ui/display/Spinner';

<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
```

### Skeleton

콘텐츠 로딩 중 자리 표시자입니다.

```tsx
import { Skeleton } from '@/components/common/ui/display/Skeleton';

// shimmer 효과 (기본)
<Skeleton className="h-4 w-full mb-2" />

// pulse 효과 (깜빡임)
<Skeleton className="h-4 w-3/4" variant="pulse" />
```

### EmptyState

데이터 없음 상태 UI입니다.

```tsx
import { EmptyState } from '@/components/common/ui/display/EmptyState';

<EmptyState title="데이터 없음" description="표시할 항목이 없습니다." />
```

### Header

페이지 상단 헤더입니다.

```tsx
import { Header } from '@/components/common/ui/display/Header';

<Header
  title="페이지 제목"
  left={<button onClick={goBack}>← 뒤로</button>}
  right={<Button size="sm">저장</Button>}
/>
```

### TabBar

탭 전환 바입니다.

```tsx
import { TabBar } from '@/components/common/ui/display/TabBar';

<TabBar
  tabs={[
    { id: 'all', label: '전체' },
    { id: 'active', label: '진행중' },
    { id: 'done', label: '완료' },
  ]}
  activeTab={activeTab}
  onTabChange={setActiveTab}
/>
```

### Table

데이터 테이블입니다.

```tsx
import { Table } from '@/components/common/ui/display/Table';

<Table
  columns={[
    { key: 'name', header: '이름', align: 'left' },
    { key: 'status', header: '상태', width: '80px', align: 'center' },
  ]}
  data={rows}
  rowKey="id"
  onRowClick={(row) => handleRowClick(row)}
/>
```

---

## 5. 오버레이 (overlay/)

### Modal

```tsx
import { Modal } from '@/components/common/ui/overlay/Modal';
import { useModalStore } from '@/hooks/useModalStore';

const { open, close } = useModalStore();

// 열기
<Button onClick={() => open('my-modal')}>열기</Button>

// 모달 정의
<Modal id="my-modal" title="제목">
  <p>내용</p>
  <Button onClick={() => close('my-modal')}>닫기</Button>
</Modal>
```

### ConfirmDialog

확인/취소 다이얼로그입니다.

```tsx
import { ConfirmDialog } from '@/components/common/ui/overlay/ConfirmDialog';

<ConfirmDialog
  open={open}
  title="정말 삭제하시겠습니까?"
  message="이 작업은 되돌릴 수 없습니다."
  confirmLabel="삭제"
  cancelLabel="취소"
  variant="danger"
  onConfirm={handleConfirm}
  onCancel={() => setOpen(false)}
/>
```

### BottomSheet

```tsx
import { BottomSheet } from '@/components/common/ui/overlay/BottomSheet';

<BottomSheet open={open} onClose={() => setOpen(false)} title="제목">
  <p>내용</p>
</BottomSheet>
```

### Toast

```tsx
import { ToastContainer } from '@/components/common/ui/overlay/Toast';
import { useToastStore } from '@/hooks/useToastStore';

// 레이아웃 최상단에 한 번만 선언
<ToastContainer />

// 사용
const { addToast } = useToastStore();
addToast('저장되었습니다', 'success');
addToast('오류가 발생했습니다', 'error');
addToast('안내 메시지', 'info');
addToast('주의가 필요합니다', 'warning');
```

### Tooltip

```tsx
import { Tooltip } from '@/components/common/ui/overlay/Tooltip';

<Tooltip content="설명 텍스트">
  <Button>호버하세요</Button>
</Tooltip>
```

---

## 6. 탐색 (navigation/)

### Pagination

```tsx
import { Pagination } from '@/components/common/ui/navigation/Pagination';

<Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
```

### Breadcrumb

```tsx
import { Breadcrumb } from '@/components/common/ui/navigation/Breadcrumb';

<Breadcrumb items={[
  { label: '홈', href: '/' },
  { label: '설정', href: '/settings' },
  { label: '프로필' },
]} />
```

### Stepper

단계 진행 표시기입니다.

```tsx
import { Stepper } from '@/components/common/ui/navigation/Stepper';

<Stepper
  steps={[
    { id: 'info', label: '기본 정보' },
    { id: 'auth', label: '인증' },
    { id: 'done', label: '완료' },
  ]}
  currentStep={1}
/>
```

### InfiniteScrollTrigger

무한 스크롤 감지 트리거입니다.

```tsx
import { InfiniteScrollTrigger } from '@/components/common/ui/navigation/InfiniteScrollTrigger';

<InfiniteScrollTrigger hasMore={hasMore} onTrigger={fetchNextPage} />
```

---

## 7. 피드백 (feedback/)

> ⚠️ 이 카테고리는 아직 `/dev/ui` 카탈로그 페이지(`app/dev/ui/page.tsx`)에 등록되어 있지 않습니다(TABS에 "피드백" 탭 없음).  
> 실제 컴포넌트는 존재하며 직접 import해 사용할 수 있습니다.

### ErrorBoundary

렌더링 중 발생한 에러를 잡아 폴백 UI를 표시합니다.

```tsx
import { ErrorBoundary } from '@/components/common/ui/feedback/ErrorBoundary';

<ErrorBoundary fallback={<CustomErrorView />}>
  <MyComponent />
</ErrorBoundary>
```

| Prop | 타입 | 설명 |
|---|---|---|
| `fallback` | `ReactNode` | 에러 시 표시할 UI. 생략 시 기본 "일시적인 오류가 발생했습니다" 화면 + 다시 시도 버튼 |

### UploadProgressBar

파일 업로드 진행률 바입니다.

```tsx
import { UploadProgressBar } from '@/components/common/ui/feedback/UploadProgressBar';

<UploadProgressBar progress={uploadPercent} />
```

| Prop | 타입 | 설명 |
|---|---|---|
| `progress` | `number` | 진행률 0~100 |

---

## 8. 컴포넌트 추가·수정 시

새 공통 컴포넌트를 만들거나 수정했을 때는 `/dev/ui` 카탈로그에 등록해야 합니다.  
등록 절차는 [14-ui-catalog-contribution.md](./14-ui-catalog-contribution.md)를 참고하세요.
