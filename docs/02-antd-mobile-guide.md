# antd-mobile 사용 가이드

> 대상: 퍼블리셔  
> 라이브러리: [Ant Design Mobile](https://mobile.ant.design/) (antd-mobile)

---

## 1. 설치

> ⚠️ 현재 `package.json`에 antd-mobile이 등록되어 있지 않습니다. 사용 전 개발자와 협의 후 설치합니다.

```bash
npm install antd-mobile
```

설치 후 개발자에게 알려 `package.json` 변경사항을 커밋에 포함시킵니다.

### 버전 정책

- **버전은 반드시 고정**합니다(`^` 없이 `"antd-mobile": "5.x.x"` 형태).
- patch 업데이트도 UI가 변경될 수 있으므로, 업그레이드 시 개발자와 사전 협의합니다.
- 현재 사용 버전은 `package.json`의 `dependencies`에서 확인합니다.

---

## 2. import 방법

antd-mobile은 컴포넌트별로 import합니다.

```tsx
// ✅ 올바른 import
import { Button, Toast, Popup } from 'antd-mobile';

// ❌ 전체 import 금지 (번들 크기 증가)
import AntdMobile from 'antd-mobile';
```

---

## 3. `'use client'` 선언 필수

antd-mobile 컴포넌트는 브라우저 환경(CSR)에서만 동작합니다. 사용하는 파일 최상단에 반드시 `'use client'`를 선언합니다.

```tsx
'use client';

import { Popup } from 'antd-mobile';

export function MyView() {
  return <Popup visible>내용</Popup>;
}
```

> `'use client'`가 없으면 서버 사이드 렌더링(SSR) 단계에서 에러가 발생합니다.

---

## 4. 테마 커스터마이징 (CSS 변수 오버라이드)

antd-mobile은 CSS 변수로 테마를 제어합니다. 프로젝트 디자인 토큰과 맞추려면 `styles/globals.css`에 오버라이드를 추가합니다.

```css
/* styles/globals.css */
:root {
  /* antd-mobile 기본 변수를 프로젝트 토큰으로 덮어씁니다 */
  --adm-color-primary: var(--color-primary);           /* #3B82F6 */
  --adm-color-success: var(--color-success);           /* #10B981 */
  --adm-color-warning: var(--color-warning);           /* #F59E0B */
  --adm-color-danger:  var(--color-error);             /* #EF4444 */
  --adm-color-weak:    var(--color-text-secondary);    /* #6B7280 */
  --adm-border-color:  var(--color-border-default);    /* #E5E7EB */
  --adm-font-size-main: var(--font-size-sm);           /* 14px */
  --adm-radius-s: var(--radius-sm);                   /* 4px */
  --adm-radius-m: var(--radius-md);                   /* 8px */
  --adm-radius-l: var(--radius-lg);                   /* 12px */
}
```

> CSS 변수 전체 목록은 [antd-mobile 공식 문서 - 主题定制](https://mobile.ant.design/zh/guide/theming)에서 확인할 수 있습니다.

---

## 5. 자체 컴포넌트 vs antd-mobile 역할 구분

이 프로젝트는 자체 공통 컴포넌트(`components/common/ui/`)와 antd-mobile 컴포넌트를 함께 사용합니다.

| 상황 | 사용할 컴포넌트 |
|---|---|
| 버튼, 입력 필드, 뱃지, 카드 등 프로젝트 전반에서 일관되게 쓰이는 UI | **자체 컴포넌트** (`components/common/ui/`) |
| 날짜 선택기(DatePickerView), 스와이프(SwipeAction), 무한스크롤(InfiniteScroll) 등 구현 비용이 높은 복잡한 UI | **antd-mobile** |
| 자체 컴포넌트로 이미 구현된 기능 | **자체 컴포넌트 우선** (antd-mobile 중복 사용 금지) |

자체 컴포넌트 목록은 [03-component-catalog.md](./03-component-catalog.md)를 참고하세요.

---

## 6. 주요 사용 컴포넌트 예시

### Popup (바텀시트 대체 불가 팝업)

```tsx
'use client';
import { Popup } from 'antd-mobile';

<Popup visible={open} onMaskClick={() => setOpen(false)} bodyStyle={{ borderRadius: '16px 16px 0 0' }}>
  <div className="p-4">팝업 내용</div>
</Popup>
```

### SwipeAction (스와이프 삭제)

```tsx
'use client';
import { SwipeAction } from 'antd-mobile';

<SwipeAction rightActions={[{ key: 'delete', text: '삭제', color: 'danger' }]}>
  <div className="p-4">스와이프 대상 아이템</div>
</SwipeAction>
```

### InfiniteScroll (무한 스크롤)

```tsx
'use client';
import { InfiniteScroll } from 'antd-mobile';

<InfiniteScroll loadMore={fetchMore} hasMore={hasMore} />
```

### PullToRefresh (당겨서 새로고침)

```tsx
'use client';
import { PullToRefresh } from 'antd-mobile';

<PullToRefresh onRefresh={async () => { await refetch(); }}>
  <div>새로고침 가능한 콘텐츠</div>
</PullToRefresh>
```

---

## 7. 주의사항

- antd-mobile 컴포넌트를 **`View.tsx` 파일 내에서만 사용**합니다. `Page.tsx`에는 넣지 않습니다.
- antd-mobile의 `Button`, `Input` 등을 자체 컴포넌트 대신 사용하지 않습니다 (스타일 충돌 방지).
- antd-mobile의 기본 스타일을 `!important`로 무력화하는 대신, CSS 변수 오버라이드로 해결합니다.
- 버전 업그레이드는 반드시 개발자와 협의 후 진행합니다. ([09-publisher-dev-collaboration.md](./09-publisher-dev-collaboration.md) 참고)
