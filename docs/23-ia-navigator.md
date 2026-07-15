# IA 네비게이터 가이드

> 대상: 퍼블리셔  
> IA 데이터: `app/dev/ia/_data/ia.ts`  
> 실제 탐색: `http://localhost:3000/dev/ia` (기본, HTTP)

---

## 1. IA(Information Architecture)란?

IA는 앱의 전체 화면 구조를 정의한 문서입니다.  
이 프로젝트는 IA를 기준으로 라우트 경로와 컴포넌트를 구성합니다.

- 현재 기준: **IA 0.41**
- IA 데이터 파일: `app/dev/ia/_data/ia.ts`
- 개발 도구에서 IA를 브라우저로 탐색하며 각 화면으로 바로 이동할 수 있습니다.

---

## 2. IA 네비게이터 사용법

`http://localhost:3000/dev/ia`에 접속하면 섹션별 화면 목록을 탐색할 수 있습니다.

```
/dev/ia                    ← 섹션 목록
  └── /dev/ia/[section]    ← 섹션 내 1depth 화면 목록
        └── /dev/ia/[section]/[depth1]   ← 라우트 및 하위 화면 목록
```

화면 항목을 클릭하면 실제 앱 경로(`path`)로 이동합니다.

---

## 3. 섹션 구조

IA는 `app/dev/ia/_data/ia.ts`의 `IA_DATA` 배열 순서 기준 아래 9개 섹션으로 구성됩니다.

| 섹션 ID | 섹션명 | 주요 화면 |
|---|---|---|
| `common` | 공통 | 스플래시/온보딩, 간편인증, 본인인증, 약관동의, 회원가입 완료 |
| `main` | 메인 | 메인 홈, 알림, AI 챗봇, 통합검색, 파파고 번역, 다국어 번역 |
| `earn` | 적립 | 적립 서브메인, 쿠폰·플포, 미션, 퀴즈, 설문, 룰렛, 포인트워크, 하이라이트, 이벤트, AI 채팅, 데일리 운세, 게임, 랜덤박스, 스탬프, 쿼카팜, 포인트 모으기 |
| `use` | 사용 | 사용 서브메인, 상품, 선물하기, 제휴처 안내, 기부, 구독쿠폰딜, 컬처, 텍스리펀드, 쇼핑Live, 포인트샵 |
| `pay` | 결제 | 결제 서브메인, 브랜드결제, 충전(서브메인/내역/자동/예약), 전환(서브메인/내역), 전자영수증, 사후 적립, 카드/Pay 관리, 결제 내역, 결제 제휴처 안내 |
| `my` | 마이페이지 | 마이페이지 메인, 이용/구매 내역, 활동/참여 내역, 포인트 현황, 배지함, 쿠폰, 찜 목록, 관심지점, 로그인 이력, 구매 내역, 보유카드, 댓글, 자산, QR·바코드, 기부/이벤트/선물/영수증/구독 내역 |
| `member` | 회원 | 통합 로그인 게이트, 아이디/비밀번호 찾기, 이용제한/탈퇴 안내, 연동서비스관리, 계열사 연결, 클럽, 회원 가입, 프로필 |
| `settings` | 설정 | 설정 메인, 개인정보변경, 생체인증/비밀번호, 알림 설정, 계정 연동/탈퇴, OTP 인증 발급, 현금영수증 발급, 회원 탈퇴 |
| `footer` | 하단 | 이용안내, 고객센터(1:1문의/MY문의내역/FAQ), 공지사항(목록/상세), 약관 및 정책, 앱 버전 정보 |

⚠️ `app/(protected)/menu/`·`app/(public)/menu/` 라우트 폴더(레거시 메뉴 경로)는 실제로 존재하지만 `ia.ts`의 `IA_DATA`에는 별도 섹션으로 등록되어 있지 않습니다.  
IA 네비게이터(`/dev/ia`)에서는 노출되지 않습니다.

---

## 4. 화면 번호와 라우트 경로 매핑

주요 화면의 번호와 라우트 경로 대응표입니다.

> 아래 표는 `app/dev/ia/_data/ia.ts`(IA_DATA) 기준입니다.  
> 신규(2026-06 108 분석 반영) 표시된 화면은 최근 추가분입니다.

### 공통

| 화면명 | 라우트 경로 |
|---|---|
| 스플래시 / 온보딩 | `/intro` |
| 간편인증 | `/auth/simple-auth` |
| 본인인증 | `/auth/identity` |
| 약관동의 | `/auth/terms` |
| 회원가입 완료 | `/member/join/complete` |

### 메인

| 화면명 | 라우트 경로 |
|---|---|
| 메인 홈 | `/main` |
| 알림 | `/main/notification` |
| AI 챗봇 | `/main/chatbot` |
| 통합검색 | `/main/search` |
| 파파고 번역 | `/main/papago` |
| 다국어 번역 | `/main/translate` |

### 적립

| 화면명 | 라우트 경로 |
|---|---|
| 적립 서브메인 | `/earn` |
| 쿠폰·플포 목록/상세 | `/earn/coupon`, `/earn/coupon/[id]` |
| 미션 목록/상세 | `/earn/mission`, `/earn/mission/[id]` |
| 퀴즈 목록/진행 | `/earn/quiz`, `/earn/quiz/[id]` |
| 설문 목록/진행 | `/earn/survey`, `/earn/survey/[id]` |
| 룰렛 | `/earn/roulette` |
| 포인트워크 대시보드/챌린지 상세 | `/earn/point-work`, `/earn/point-work/challenge/[id]` |
| 하이라이트 목록/상세 | `/earn/highlight`, `/earn/highlight/[id]` |
| 이벤트 목록/상세 | `/earn/event`, `/earn/event/[id]` |
| AI 채팅 | `/earn/ai-chat` |
| 데일리 운세 | `/earn/fortune` |
| 게임 | `/earn/game` |
| 랜덤박스 | `/earn/random-box` |
| 스탬프 | `/earn/stamp` |
| 쿼카팜 | `/earn/quokka-farm` |
| 포인트 모으기 | `/earn/point-collect` |

### 사용

| 화면명 | 라우트 경로 |
|---|---|
| 사용 서브메인 | `/use` |
| 상품 목록/상세 | `/use/product`, `/use/product/[id]` |
| 선물하기 | `/use/gift` |
| 제휴처 안내 | `/use/affiliate-map` |
| 기부 목록/상세 | `/use/donation`, `/use/donation/[id]` |
| 구독쿠폰딜 | `/use/subscription` |
| 컬처 목록/상세 | `/use/culture`, `/use/culture/[id]` |
| 텍스리펀드 | `/use/tax-refund` |
| 쇼핑Live 목록/상세 | `/use/live`, `/use/live/[id]` |
| 포인트샵 | `/use/point-shop` |

### 결제

| 화면명 | 라우트 경로 |
|---|---|
| 결제 서브메인 | `/pay` |
| 브랜드결제 | `/pay/brand-payment` |
| 충전 서브메인 | `/pay/charge` |
| 충전 내역 조회 | `/pay/charge/history` |
| 자동충전 | `/pay/charge/auto` |
| 예약충전 | `/pay/charge/scheduled` |
| 포인트 전환 서브메인 | `/pay/transfer` |
| 전환 내역 조회 | `/pay/transfer/history` |
| 전자영수증 | `/pay/receipt` |
| 사후 적립 | `/pay/direct-earn` |
| 카드/Pay 관리 | `/pay/card` |
| 결제 내역 | `/pay/history` |
| 결제 제휴처 안내 | `/pay/affiliate` |

### 마이페이지

| 화면명 | 라우트 경로 |
|---|---|
| 마이페이지 메인 | `/my` |
| 이용/구매 내역 | `/my/history` |
| 활동/참여 내역 | `/my/activity` |
| 포인트 현황 | `/my/point` |
| 배지함 | `/my/badge` |
| MY 쿠폰 | `/my/coupon` |
| 찜 목록 | `/my/wishlist` |
| 관심지점 | `/my/interest-point` |
| 로그인 이력 | `/my/login-history` |
| 구매 내역 | `/my/purchase` |
| 보유카드 | `/my/card` |
| 댓글 | `/my/comment` |
| 포인트/자산 | `/my/asset` |
| QR·바코드 | `/my/qr` |
| 기부 내역 | `/my/donation` |
| 이벤트 내역 | `/my/event` |
| 선물 내역 | `/my/gift` |
| 영수증 내역 | `/my/receipt` |
| 구독 내역 | `/my/subscription` |

### 회원

| 화면명 | 라우트 경로 |
|---|---|
| 통합 로그인 게이트 | `/member/login` |
| 아이디 찾기 | `/member/find-id` |
| 비밀번호 찾기 | `/member/find-password` |
| 이용제한/탈퇴 안내 | `/member/restricted` |
| 연동서비스관리 | `/member/linked-services` |
| 계열사 연결 | `/member/affiliate` |
| 클럽 서브메인/알림/상세/콘텐츠 상세/가입 | `/member/club`, `/member/club/notification`, `/member/club/[id]`, `/member/club/[id]/content/[contentId]`, `/member/club/join` |
| 회원 가입 폼/완료 | `/member/join`, `/member/join/complete` |
| 프로필 | `/member/profile` |

### 설정

| 화면명 | 라우트 경로 |
|---|---|
| 설정 메인 | `/settings` |
| 개인정보변경 | `/settings/profile` |
| 생체인증/비밀번호 | `/settings/security` |
| 알림 설정 | `/settings/notification` |
| 계정 연동/탈퇴 | `/settings/account` |
| OTP 인증 발급 | `/settings/otp` |
| 현금영수증 발급 | `/settings/cash-receipt` |
| 회원 탈퇴 | `/settings/withdraw` |

### 하단(footer)

| 화면명 | 라우트 경로 |
|---|---|
| 이용안내 | `/footer/guide` |
| 1:1문의 | `/footer/cs` |
| MY 문의내역 | `/footer/cs/my-inquiry` |
| 자주묻는질문 | `/footer/cs/faq` |
| 공지사항 목록 | `/footer/notice` |
| 공지사항 상세 | `/footer/notice/[id]` |
| 약관 및 정책 | `/footer/terms` |
| 앱 버전 정보 | `/footer/app-version` |

---

## 5. 동적 라우트(`[id]`)가 있는 화면

`[id]`가 포함된 경로는 실제 ID가 있어야 접근할 수 있습니다.  
IA 네비게이터에서는 `pattern`으로 표시되며 링크가 활성화되지 않습니다.

개발 중에는 직접 URL에 임시 ID를 입력해 접근합니다.

```
예시: /earn/mission/123
예시: /earn/quiz/test-quiz-id
```

---

## 6. IA 데이터 파일 수정이 필요한 경우

새 화면이 추가되거나 경로가 변경되면 `app/dev/ia/_data/ia.ts`를 함께 업데이트합니다.  
이 파일은 개발자와 퍼블리셔 모두 수정할 수 있지만, 실제 라우트 파일 추가(`app/` 하위 `page.tsx`)는 개발자가 담당합니다.

```ts
// ia.ts 항목 추가 예시
{ id: 'new-screen', label: '새 화면', path: '/earn/new-screen', children: [] }
```
