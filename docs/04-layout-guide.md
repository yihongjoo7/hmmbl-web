# 레이아웃 가이드

> 대상: 퍼블리셔  
> 관련 파일: `components/layout/`, `app/(protected)/layout.tsx`, `app/(public)/layout.tsx`, `app/layout.tsx`  
> ⚠️ 현행화 안내: GNB/FNB는 라우트 그룹 `layout.tsx`가 아니라 **각 화면(`page.tsx`)이 필요할 때 직접 렌더링**합니다(§2~§3, §5). `app/(protected)/layout.tsx`는 인증 리다이렉트를 하지 않습니다(§5). 상세 배경은 `13-auth-system.md` §10, `12-routing-architecture.md` §4 참고.

---

## 1. 전체 레이아웃 구조

```
app/layout.tsx              ← 루트 레이아웃 (전역 Provider, 웹뷰 초기화)
  ├── app/(protected)/layout.tsx   ← 로그인 필요 화면 (GNB + FNB 포함)
  └── app/(public)/layout.tsx      ← 비로그인 화면 (GNB 없거나 간소화)
```

---

## 2. GNB (Global Navigation Bar) — 상단 바

**파일:** `components/layout/GNB.tsx`

상단 고정 네비게이션 바입니다. `fixed top-0`으로 고정되어 있으며, 페이지 콘텐츠는 GNB 높이만큼 `pt-*`를 적용해야 합니다.

⚠️ `layout.tsx`가 자동으로 씌워주지 않습니다. **GNB가 필요한 각 라우트의 `page.tsx`에서 직접 import해 렌더링**합니다(예: `app/(protected)/main/page.tsx`가 `<GNB />`와 `<FNB />`를 함께 렌더링).

```tsx
import { GNB } from '@/components/layout/GNB';

<GNB title="페이지 제목" />
```

| Prop | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `title` | `string` | `'H.Point'` | 상단 바 제목 |

**스타일 특징:**
- `fixed top-0 left-0 right-0 z-40` — 화면 최상단 고정
- `bg-bg-primary border-b border-border-default` — 배경·구분선 토큰 사용
- 높이: `px-6 py-4` 기준 약 56px

**퍼블리셔 주의사항:**
- GNB 높이를 보완하기 위해 페이지 콘텐츠 최상단에 `pt-14` (56px) 정도를 적용합니다.
- GNB는 `View.tsx`가 아니라 라우트 `page.tsx`(또는 `*Page.tsx`)에서 렌더링합니다.

---

## 3. FNB (Footer Navigation Bar) — 하단 탭 바

**파일:** `components/layout/FNB.tsx`

하단 고정 탭 바입니다. `fixed bottom-0`으로 고정됩니다.

```tsx
import { FNB } from '@/components/layout/FNB';

<FNB />
```

**스타일 특징:**
- `fixed bottom-0 left-0 right-0 z-40` — 화면 최하단 고정
- `bg-bg-primary border-t border-border-default` — 배경·구분선 토큰 사용
- 현재 경로와 일치하는 탭은 `text-primary`로 강조됩니다.

⚠️ **현재 구현은 탭 1개(`/home`, 🏠 홈)만 하드코딩된 placeholder 상태**입니다(`FNB_ITEMS` 배열). 실제 서비스의 메인/적립/사용/결제/마이 5탭 구성은 아직 반영되어 있지 않습니다. 탭 구성이 필요하면 개발자에게 확인하세요.

**퍼블리셔 주의사항:**
- FNB 높이만큼 페이지 콘텐츠 하단에 `pb-16` 이상을 확보합니다.
- iOS safe-area(홈 인디케이터)가 있는 환경에서는 `pb-safe`를 추가합니다.

```tsx
// View 파일 최하단 여백 처리 예시
<div className="flex flex-col min-h-screen pb-16 pb-safe">
  {/* 콘텐츠 */}
</div>
```

---

## 4. WebviewLayout — 웹뷰 래퍼

**파일:** `app/WebviewLayoutClient.tsx`

네이티브 앱 웹뷰 환경에서 필요한 초기화(인증 인터셉터, 브릿지 토큰·인증상태 수신, DPoP 키 로테이션, 다국어 Provider)를 담당합니다. 개발자 영역이므로 퍼블리셔가 직접 수정하지 않습니다.

⚠️ `components/layout/WebviewLayout/WebviewLayout.tsx`(안전 영역·GNB·FNB 통합 레이아웃을 의도한 컴포넌트)는 위 `app/WebviewLayoutClient.tsx`와 이름은 비슷하지만 별개 파일이며, 현재 빈 스텁(`export {}`)으로 미구현 상태입니다.

---

## 5. 라우트 그룹별 레이아웃 분기

### (protected) — webview SSO 부트스트랩 화면

`app/(protected)/layout.tsx`에서 처리합니다.

- **인증 리다이렉트를 하지 않습니다.** 미인증 상태면 webview-code SSO를 자동 수행해 웹뷰 자체 토큰을 발급받을 뿐, 화면 접근을 막거나 로그인 페이지로 보내지 않습니다(상세: `13-auth-system.md` §8, `12-routing-architecture.md` §4).
- GNB/FNB를 layout이 자동으로 씌워주지 않습니다. 필요한 각 `page.tsx`가 직접 렌더링합니다(§2~§3).
- 퍼블리셔가 작업하는 대부분의 화면이 이 그룹에 속합니다.

```
app/(protected)/
  ├── main/page.tsx     → 메인 홈
  ├── earn/page.tsx     → 적립
  ├── my/page.tsx       → 마이페이지
  └── ...
```

### (public) — webview SSO 부트스트랩이 없는 화면

`app/(public)/layout.tsx`에서 처리합니다. 현재 이 파일은 `children`을 그대로 반환하는 pass-through이며, GNB 관련 로직도 포함하지 않습니다.

- (protected)의 webview-code SSO 부트스트랩을 거치지 않습니다.
- GNB는 (protected)와 마찬가지로 필요한 화면이 직접 렌더링합니다.
- 스플래시, 온보딩, 로그인, 약관, 공개 공지사항 등이 해당됩니다.

```
app/(public)/
  ├── intro/page.tsx    → 스플래시/온보딩
  ├── auth/page.tsx     → 인증
  └── ...
```

---

## 6. 페이지 레이아웃 작성 패턴

View 파일에서 페이지 전체 높이와 스크롤을 처리하는 기본 패턴입니다.

```tsx
// FNB가 있는 화면 — 하단 여백 필수
<div className="flex flex-col min-h-screen pb-16">
  {/* 상단 고정 필터/탭 */}
  <div className="sticky top-14 z-10 bg-bg-primary border-b border-border-default">
    {/* 필터 영역 */}
  </div>

  {/* 스크롤 콘텐츠 */}
  <div className="flex-1 overflow-y-auto px-4 py-4">
    {/* 리스트 등 */}
  </div>
</div>
```

```tsx
// GNB·FNB 없는 전체 화면 (스플래시, 온보딩 등)
<div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary px-6">
  {/* 중앙 정렬 콘텐츠 */}
</div>
```

---

## 7. Safe Area (iOS 홈 인디케이터)

iOS 환경에서는 홈 인디케이터 영역을 피해야 합니다. `pb-safe` 유틸리티 클래스를 사용합니다.

```tsx
// globals.css 또는 tailwind 플러그인에서 정의된 경우
<div className="pb-safe">
  {/* 하단 여백이 safe-area-inset-bottom만큼 확보됨 */}
</div>
```

> `pb-safe`가 적용되지 않는 경우 개발자에게 확인을 요청합니다.

---

## 8. z-index 기준

| 레이어 | 값 | 해당 요소 |
|---|---|---|
| 페이지 콘텐츠 | 기본(`0`) | 본문 |
| sticky 헤더/필터 | `z-10` | 고정 필터 바, 탭 바 |
| GNB / FNB | `z-40` | 상단·하단 네비게이션 |
| 오버레이 | `z-50` 이상 | 모달, 바텀시트, 팝업 |
