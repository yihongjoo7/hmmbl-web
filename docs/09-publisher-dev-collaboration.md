# 퍼블리셔 ↔ 개발자 협업 가이드

> 대상: 퍼블리셔  
> 목적: 퍼블리셔와 개발자 간 역할 경계, 파일 전달 규칙, 소통 방법 정리

---

## 1. 역할 경계

| 파일 / 영역 | 담당 | 설명 |
|---|---|---|
| `*View.tsx` | **퍼블리셔** | UI 렌더링, 스타일링, 상태 3종(로딩·에러·빈) |
| `*Page.tsx` | 개발자 | 데이터 페칭, 라우팅, 비즈니스 로직 |
| `app/**/page.tsx` | 개발자 | Next.js 라우트 파일 |
| `components/common/ui/` | **퍼블리셔 주도** | 공통 UI 컴포넌트 (개발자 리뷰 필수) |
| `styles/globals.css` | **공동** | 디자인 토큰 정의 (수정 전 협의) |
| `tailwind.config.ts` | **공동** | Tailwind 설정 (수정 전 협의) |
| `lib/`, `hooks/` | 개발자 | 인프라·비즈니스 훅 |
| `features/*/services/` | 개발자 | API 호출 서비스 |
| `features/*/types/` | 공동 | 타입 정의 (퍼블리셔 작성 → 개발자 확정) |

---

## 2. 브랜치 전략

```
main            ← 배포 브랜치 (직접 push 금지)
  └── develop   ← 통합 브랜치
        ├── feature/pub/earn-mission-list   ← 퍼블리셔 작업 브랜치
        └── feature/dev/earn-mission-api    ← 개발자 작업 브랜치
```

**브랜치 네이밍 규칙**

```
feature/pub/[섹션]-[화면명]   ← 퍼블리셔
feature/dev/[섹션]-[기능명]   ← 개발자

예시:
feature/pub/earn-mission-list
feature/pub/my-coupon-view
feature/dev/earn-mission-api
```

**작업 흐름**

1. `develop`에서 새 브랜치를 만들어 작업합니다.
2. 작업 완료 후 `develop`으로 PR을 올립니다.
3. 개발자 리뷰 후 머지합니다.
4. `develop` → `main` 머지는 개발자가 담당합니다.

---

## 3. 파일 전달 규칙

### 퍼블리셔 → 개발자 전달 대상

PR에 포함되어야 하는 파일:

- `features/[섹션]/[화면]/components/[화면명]View.tsx` — 작업한 View 파일
- `app/dev/pub/[섹션]/[화면명]/page.tsx` — 목업 미리보기 페이지
- `app/dev/pub/page.tsx` — 목록 등록 (수정된 경우)
- `app/dev/ui/page.tsx` — 공통 컴포넌트 카탈로그 (수정된 경우)
- 신규 공통 컴포넌트 파일 (`components/common/ui/` 하위)

### 전달하지 않아야 하는 파일

- `.env.local` (절대 커밋 금지 — `.gitignore`에 포함됨)
- `node_modules/`
- `.next/`

---

## 4. PR(Pull Request) 작성 방법

### PR 제목 형식

```
[pub] earn: 미션 목록 View 작업
[pub] my: 쿠폰 View 수정 — 탭 필터 추가
[pub] common: RatingStars 공통 컴포넌트 추가
```

### PR 본문에 포함할 내용

```markdown
## 작업 내용
- MissionListView 신규 작성
- 필터 탭, 아이템 카드, 로딩/빈/에러 상태 구현

## 확인 방법
- `/dev/pub/earn/mission-list` 에서 목업 UI 확인 가능

## 개발자 확인 필요
- [ ] Props 인터페이스 확정 (items의 `badge` 필드 optional 여부)
- [ ] 이미지 도메인 `next.config.mjs`에 등록 필요 (이미지 URL: api.example.com)

## 스크린샷
<!-- 브라우저 캡처 첨부 -->
```

### PR 리뷰 요청 방법

- GitHub에서 개발자를 `Reviewers`로 지정합니다.
- 긴급 확인이 필요한 경우 팀 채팅(Slack 등)에서 PR 링크를 공유하고 멘션합니다.

---

## 5. Props 인터페이스 협의

### 퍼블리셔가 먼저 작업할 때 (목업 선행)

1. 기획서를 보고 임시 Props를 작성합니다.
2. PR 본문의 "개발자 확인 필요" 항목에 확정이 필요한 Props를 명시합니다.
3. 개발자가 리뷰에서 Props를 확정하거나 수정 요청합니다.

### 개발자가 먼저 API를 확정할 때

1. 개발자가 `features/[섹션]/types/` 에 타입 파일을 작성하고 공유합니다.
2. 퍼블리셔는 해당 타입을 import해 View에 적용합니다.

---

## 6. 공동 편집 파일 충돌 방지

`styles/globals.css`와 `tailwind.config.ts`는 퍼블리셔와 개발자가 함께 수정하는 파일입니다.

### 충돌 방지 규칙

- 수정 전 팀 채팅에 "globals.css 수정 예정"을 알립니다.
- 디자인 토큰(CSS 변수 값)을 변경할 때는 개발자와 사전 협의합니다.
- `tailwind.config.ts`는 개발자 리뷰 없이 수정하지 않습니다.

### 충돌 발생 시

```bash
# develop 브랜치 최신 상태로 동기화
git fetch origin
git rebase origin/develop

# 충돌 파일을 열어 수동 병합 후
git add styles/globals.css
git rebase --continue
```

해결이 어려우면 개발자에게 도움을 요청합니다.

---

## 7. antd-mobile 관련 협의

### 버전 업그레이드 시

antd-mobile 버전을 올려야 할 경우:

1. 팀 채팅에서 필요한 이유와 변경 버전을 공유합니다.
2. 개발자가 변경 영향도를 검토합니다.
3. 합의 후 개발자가 `package.json`을 수정하고 퍼블리셔와 함께 UI를 검증합니다.

### 신규 antd-mobile 컴포넌트 사용 시

아직 사용하지 않은 antd-mobile 컴포넌트를 처음 도입할 때:

1. 팀 채팅에 사용 계획을 공유합니다 (어떤 컴포넌트를 어느 화면에 쓸지).
2. CSS 변수 오버라이드가 필요한지 검토합니다. ([02-antd-mobile-guide.md](./02-antd-mobile-guide.md) 참고)
3. PR에서 개발자가 `'use client'` 처리와 번들 크기 영향을 함께 검토합니다.

---

## 8. 용어 통일

디자인 명칭과 코드 명칭이 다를 수 있습니다. 아래 표를 기준으로 통일합니다.

| 기획/디자인 용어 | 코드 용어 | 파일명 패턴 |
|---|---|---|
| 서브메인 | SubMain / [섹션]Main | `EarnPage`, `MyPage` |
| 팝업 | Modal / BottomSheet | `Modal`, `BottomSheet` |
| 토스트 알림 | Toast | `Toast` |
| 탭 | TabBar / FilterChip | `TabBar`, `FilterChip` |
| 적립 내역 | History | `HistoryPage`, `HistoryView` |
| 바코드 | QR / Barcode | `QrPage`, `QrView` |
| 찜하기 | Wishlist | `WishlistPage` |
| 배너 | Banner | `HomeBanner` |

> 용어가 불명확한 경우 기획서의 화면 번호와 IA를 기준으로 개발자와 확인합니다.

---

## 9. 소통 채널

| 상황 | 방법 |
|---|---|
| 일반 업무 소통 | 팀 채팅 (Slack / 카카오워크 등) |
| 코드 리뷰 요청 | GitHub PR + Reviewers 지정 |
| 긴급 확인 필요 | 팀 채팅에서 @멘션 + PR 링크 |
| Props 인터페이스 확정 | PR 코멘트 또는 팀 채팅 |
| 공동 편집 파일 수정 예고 | 팀 채팅에서 사전 공유 |
| antd-mobile 버전·신규 도입 | 팀 채팅 → 개발자 승인 후 진행 |

---

## 10. 퍼블리셔 PR 최종 체크리스트

- [ ] View 파일에 `useState` / `useEffect` / `apiClient` 사용이 없는가?
- [ ] 콜백 props가 모두 optional(`?`)인가?
- [ ] 로딩 / 에러 / 빈 상태 3종이 구현되어 있는가?
- [ ] 하드코딩 색상값 없이 Tailwind 토큰 클래스를 사용했는가?
- [ ] `<img>` 태그 대신 `next/image`를 사용했는가?
- [ ] antd-mobile 컴포넌트 사용 파일에 `'use client'`를 선언했는가?
- [ ] `/dev/pub`에 목업 미리보기를 등록했는가?
- [ ] 신규 공통 컴포넌트라면 `/dev/ui`에 카탈로그를 등록했는가?
- [ ] PR 본문에 확인 방법과 개발자 확인 필요 항목을 작성했는가?
- [ ] `.env.local` 파일이 커밋에 포함되지 않았는가?
