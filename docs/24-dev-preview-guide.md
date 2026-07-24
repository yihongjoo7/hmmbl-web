# 퍼블리싱 결과물 확인 가이드

> 대상: 퍼블리셔  
> 개발 서버 주소: `http://localhost:3000` (기본, HTTP) — 실기기 확인 시에만 `https://localhost:3001`

---

## 1. 로컬 개발 서버 실행

### 사전 준비

Node.js와 npm이 설치되어 있어야 합니다.  
처음 세팅하는 경우 개발자에게 환경 설정 안내를 요청합니다.

### 서버 실행

```bash
# 프로젝트 루트에서 실행
cd hmfrnt-web
# 폐쇄망 환경이므로 npm install 대신 파일 서버의 node_modules를 복사 (02-environment-setup.md 1장 참고)
npm run dev
```

브라우저에서 `http://localhost:3000`에 접속합니다.

> 기본은 **HTTP**입니다.  
> 인증서 없이 바로 확인할 수 있습니다.  
> 같은 Wi-Fi의 실제 모바일 기기로 확인할 때만 HTTPS(`npm run dev:https`, `https://localhost:3001`)가 필요합니다 — 자세한 내용은 아래 "4. 실제 디바이스에서 확인" 참고.

---

## 2. `app/dev/` 개발 도구 활용

`http://localhost:3000/dev`에서 퍼블리싱 작업에 유용한 도구들을 모아볼 수 있습니다.

### 2-1. IA 네비게이터 (`/dev/ia`)

앱의 모든 화면을 섹션 → 1depth → 2depth 계층으로 탐색합니다.

- 실제 구현된 화면으로 바로 이동 가능
- 동적 라우트(`[id]`)는 `pattern`으로 표시 (링크 없음, URL 직접 입력 필요)

```
http://localhost:3000/dev/ia
  → 섹션 선택 (예: 적립)
  → 화면 선택 (예: 미션 목록)
  → 실제 경로 /earn/mission 으로 이동
```

자세한 섹션 구조는 [23-ia-navigator.md](./23-ia-navigator.md)를 참고하세요.

### 2-2. 퍼블리셔 화면 미리보기 (`/dev/pub`)

퍼블리셔가 작업한 화면을 **목업 데이터**로 미리 확인합니다.  
개발자가 Page 파일을 연결하기 전에도 UI를 독립적으로 확인할 수 있습니다.

```
http://localhost:3000/dev/pub
  → 화면 목록에서 선택
  → 목업 데이터로 렌더링된 UI 확인
```

새 화면을 이 목록에 등록하는 방법은 [14-ui-catalog-contribution.md](./14-ui-catalog-contribution.md)를 참고하세요.

### 2-3. UI 컴포넌트 카탈로그 (`/dev/ui`)

공통 UI 컴포넌트의 모든 variant, size, 상태를 확인합니다.

```
http://localhost:3000/dev/ui
  → 탭 선택: 입력 / 액션 / 표시 / 오버레이 / 탐색
  → 컴포넌트 렌더링 확인
```

| 탭 | 포함 컴포넌트 |
|---|---|
| 입력 | Input, Textarea, Select, Toggle, SearchBar, DatePicker, ImageUploader |
| 액션 | Button, FilterChip, BubbleButton |
| 표시 | Badge, Card, Spinner, Skeleton, EmptyState, Header, TabBar, Table |
| 오버레이 | Toast, Modal, ConfirmDialog, Tooltip, BottomSheet |
| 탐색 | Pagination, Breadcrumb, Stepper, InfiniteScrollTrigger |

### 2-4. 코드 레퍼런스 (`/dev/ref`)

퍼블리셔 및 개발자 역할별 파일 작성 패턴을 코드로 확인합니다.

- `/dev/ref/publisher` — ExampleView.tsx 작성 패턴
- `/dev/ref/developer` — ExamplePage.tsx 작성 패턴
- `/dev/ref/preview` — 실제 화면 미리보기

---

## 3. 모바일 화면 시뮬레이션 (브라우저 DevTools)

Chrome 기준으로 모바일 뷰를 시뮬레이션합니다.

1. `F12` 또는 `Cmd+Option+I`로 DevTools 열기
2. 상단 툴바에서 **Toggle Device Toolbar** 아이콘(📱) 클릭 또는 `Cmd+Shift+M`
3. 기기 목록에서 **iPhone 14 Pro** 또는 **Galaxy S20** 선택
4. 화면 크기: 390×844 (iPhone 14 Pro 기준) 권장

> 모바일 앱으로 서비스되므로 반드시 모바일 뷰에서 최종 확인합니다.

---

## 4. 실제 디바이스에서 확인

같은 Wi-Fi 네트워크에 연결된 실제 모바일 기기에서 확인할 수 있습니다.  
**실기기는 개발 PC의 LAN IP로 접속하므로, 이때만 HTTPS(`npm run dev:https`)가 필요합니다** — LAN IP는 브라우저가 보안 컨텍스트로 인정하지 않아 일부 기능(WebCrypto 등)이 HTTP로는 정상 동작하지 않습니다.  
HTTPS 인증서 준비 방법은 [02-environment-setup.md](./02-environment-setup.md) 1장을 참고하세요(개발자에게 요청).

### 설정 방법

`.env.local` 파일에 아래 항목을 추가합니다.

```env
# .env.local
ALLOWED_DEV_ORIGINS=192.168.1.100   # 개발 PC의 로컬 IP 주소
```

> 개발 PC의 IP 주소 확인 방법  
> - `ipconfig` 명령어 실행 → IPv4 주소 확인

### 접속

먼저 `npm run dev:https`로 개발 서버를 실행한 뒤, 모바일 브라우저에서 `https://[개발PC IP]:3001`으로 접속합니다.

```
예: https://192.168.1.100:3001
```

> HTTPS이므로 모바일 브라우저에서도 인증서 경고가 뜰 수 있습니다.  
> "고급 → 계속 진행"을 선택합니다.

---

## 5. 개발 서버 재시작이 필요한 경우

아래 상황에서는 개발 서버를 재시작합니다(`Ctrl+C` 후 `npm run dev`).

- `next.config.mjs` 수정 후
- `.env.local` 값 변경 후
- `tailwind.config.ts` 수정 후

---

## 6. 자주 발생하는 문제

### HTTPS 인증서 오류
브라우저에서 "ERR_CERT_AUTHORITY_INVALID" 경고가 계속 나타나는 경우 개발자에게 로컬 인증서 재발급을 요청합니다.  
인증서 파일 경로는 `package.json`의 `dev:https` 스크립트에 `./keyfile/local-key.pem`·`./keyfile/local-cert.pem`(프로젝트 루트 `keyfile/` 폴더)로 지정되어 있습니다.

### 화면이 빈 상태로 나타나는 경우
- `(protected)` 화면은 미로그인 상태로 접근하면 httpOnly refresh 쿠키로 세션 복구를 조용히 시도하고, 실패하면 `/auth/login`으로 리다이렉트됩니다. 로그인 없이 UI만 먼저 확인하려면 `/dev/pub`의 목업 데이터를 활용하세요(상세: `04-routing-architecture.md` 3장).
- `/dev/pub`를 통해 목업 데이터로 먼저 확인하거나, 개발자에게 테스트 계정을 요청합니다.

### 스타일이 적용되지 않는 경우
- 브라우저 캐시를 초기화합니다 (`Cmd+Shift+R` 또는 `Ctrl+Shift+R`).
- 개발 서버를 재시작합니다.
