# 상태 관리 (Zustand 5.0)

> 대상: 개발자  
> 전역 Zustand Store 목록, 인터페이스, DI 패턴을 다룹니다.

---

## 1. 전역 Store 목록

`hooks/` 디렉토리에 전역 Store가 위치합니다.

| 파일 | Store | 역할 |
|---|---|---|
| `features/auth/hooks/useAuthStore.ts` | `useAuthStore` | 인증 상태 (사용자 정보·`isAuthenticated`). 토큰은 모듈 변수로 별도 관리(`13-auth-system.md` §6) |
| `hooks/useToastStore.ts` | `useToastStore` | Toast 메시지 큐 |
| `hooks/useModalStore.ts` | `useModalStore` | 모달 열림/닫힘 상태 |
| `hooks/useSystemAlert.ts` | `useSystemAlert` | 시스템 알림 다이얼로그 |

⚠️ `hooks/useAuthStore.ts`(루트)는 빈 스텁이며 미사용입니다 — 실제 인증 스토어는 `features/auth/hooks/useAuthStore.ts`입니다.
⚠️ `hooks/useBottomSheetStore.ts`는 빈 스텁(`export {}`)으로 미구현 상태이며 어디서도 import되지 않습니다. 현재 바텀시트는 전역 store 없이 `components/common/ui/overlay/BottomSheet.tsx` 컴포넌트가 로컬 props로 열림/닫힘을 제어합니다.

---

## 2. useToastStore

Toast 메시지를 전역 큐로 관리합니다.

```ts
interface Toast {
  id:        string;
  message:   string;
  type:      'success' | 'error' | 'info' | 'warning';
  duration?: number;   // 기본 3000ms
}

interface ToastState {
  toasts:      Toast[];
  addToast:    (message: string, type: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
}
```

### 사용법

```ts
import { useToastStore } from '@/hooks/useToastStore';

// 컴포넌트 내 (구독)
const addToast = useToastStore(s => s.addToast);
addToast('저장되었습니다.', 'success');
addToast('오류가 발생했습니다.', 'error');
addToast('확인해 주세요.', 'info', 5000);

// 이벤트 핸들러 / 콜백 내 (구독 없이)
useToastStore.getState().addToast('서버 오류입니다.', 'error');
```

`app/providers.tsx`의 `QueryCache.onError`에서 500+ 에러 시 `useToastStore.getState().addToast()`를 호출합니다.

---

## 3. useModalStore

여러 모달이 독립적으로 열리고 닫힐 수 있도록 ID 기반으로 관리합니다.

```ts
interface ModalState {
  openIds: string[];
  open:    (id: string) => void;
  close:   (id: string) => void;
  isOpen:  (id: string) => boolean;
}
```

### 사용법

```ts
import { useModalStore } from '@/hooks/useModalStore';

// 모달 열기
const open = useModalStore(s => s.open);
open('report-modal');

// 모달 닫기
const close = useModalStore(s => s.close);
close('report-modal');

// 열림 여부 확인
const isOpen = useModalStore(s => s.isOpen);
const reportModalOpen = isOpen('report-modal');

// 이벤트 핸들러 내
useModalStore.getState().open('confirm-delete');
```

### Modal 컴포넌트와 연동

```tsx
// ReportModal.tsx
import { useModalStore } from '@/hooks/useModalStore';

const MODAL_ID = 'report-modal';

export function ReportModal() {
  const isOpen = useModalStore(s => s.isOpen(MODAL_ID));
  const close  = useModalStore(s => s.close);

  if (!isOpen) return null;

  return (
    <Modal onClose={() => close(MODAL_ID)}>
      {/* ... */}
    </Modal>
  );
}

// 열기 버튼
export function ReportButton() {
  const open = useModalStore(s => s.open);
  return <button onClick={() => open(MODAL_ID)}>신고</button>;
}
```

---

## 4. useSystemAlert

`alert`(확인만)와 `confirm`(확인/취소)을 전역으로 관리합니다.

```ts
interface SystemAlertOptions {
  type:          'alert' | 'confirm';
  title?:        string;
  message?:      string;
  icon?:         string;
  confirmLabel?: string;
  cancelLabel?:  string;
  onConfirm?:    () => void;
  onCancel?:     () => void;
}
```

### 사용법

```ts
import { useSystemAlert } from '@/hooks/useSystemAlert';

// alert (확인 버튼만)
const alert = useSystemAlert(s => s.alert);
alert({
  title:   '저장 완료',
  message: '변경사항이 저장되었습니다.',
  icon:    '✅',
});

// confirm (확인/취소)
const confirm = useSystemAlert(s => s.confirm);
confirm({
  title:        '삭제 확인',
  message:      '정말 삭제하시겠습니까?',
  confirmLabel: '삭제',
  cancelLabel:  '취소',
  onConfirm:    () => handleDelete(),
  onCancel:     () => console.log('취소'),
});

// 닫기
useSystemAlert.getState().close();

// 이벤트 핸들러 내
useSystemAlert.getState().alert({ title: '오류', message: err.message });
```

---

## 5. Zustand 사용 패턴

### 컴포넌트 구독 (렌더 최적화)

전체 Store를 구독하면 불필요한 리렌더가 발생합니다. 필요한 상태만 선택자로 구독합니다.

```ts
// ✅ 필요한 상태만 선택
const addToast = useToastStore(s => s.addToast);
const toasts   = useToastStore(s => s.toasts);

// ⚠️ 객체 반환 시 매 렌더마다 새 참조 생성 → 불필요한 리렌더
const { addToast, toasts } = useToastStore(s => ({ addToast: s.addToast, toasts: s.toasts }));
// 이 경우 shallow 비교 또는 개별 선택자 사용
```

### 이벤트 핸들러 / 콜백에서 직접 접근

```ts
// 비동기 함수, useEffect, 콜백 등에서 구독 없이 접근
const state  = useToastStore.getState();
const action = useToastStore.getState().addToast;
```

---

## 6. `lib/`에서 Zustand 사용 금지

`lib/` 레이어에서 Zustand Store를 직접 import하면 레이어 의존성 규칙을 위반합니다.

```ts
// ❌ 금지 — lib에서 Zustand 직접 import
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
export function myLibFunction() {
  const token = useAuthStore.getState().user; // 레이어 위반
}

// ✅ 올바른 패턴 — 콜백으로 주입
export function configureMyLib(cfg: { getToken: () => string | null }) {
  _getToken = cfg.getToken;
}
// 호출부(features/)에서 주입 — getAccessToken은 모듈 변수 getter(동기, 리렌더 없음)
configureMyLib({ getToken: getAccessToken });
```

이 패턴은 `apiClient`, `fileUploadClient`, `tokenRefresh`, `interceptor` 등에서 공통으로 사용됩니다. 상세: `13-auth-system.md` §6~§7.

---

## 7. Store 확장 가이드

새 전역 상태가 필요한 경우:

1. `hooks/use[Name]Store.ts` 파일 생성
2. Zustand `create<State>()` 패턴 사용
3. Store 상태는 가능한 단순하게 유지 (계산값은 선택자로)
4. 특정 도메인에만 필요한 상태라면 전역 Store 대신 `features/[domain]/` 내 Context나 로컬 상태 사용 검토

```ts
// hooks/useNewStore.ts 예시
import { create } from 'zustand';

interface NewState {
  value: string;
  setValue: (value: string) => void;
}

export const useNewStore = create<NewState>((set) => ({
  value: '',
  setValue: (value) => set({ value }),
}));
```
