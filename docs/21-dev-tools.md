# 개발 도구 가이드 (`app/dev/`)

> 대상: 개발자  
> `app/dev/` 라우트 구조, 각 도구의 역할, IA 데이터 관리, 로컬 환경 설정을 다룹니다.

---

## 1. 개발 도구 허브 (`/dev`)

`http://localhost:3000/dev`(기본, HTTP)에 접속하면 개발 도구 허브를 볼 수 있습니다.  
`npm run dev:https`로 실행 중이라면 `https://localhost:3001/dev`로 접속합니다.  
개발 환경 전용이며 프로덕션에서는 접근을 차단해야 합니다.

| 경로 | 도구 | 설명 |
|---|---|---|
| `/dev/ia` | IA 네비게이터 | 섹션→1depth→2depth 계층으로 모든 화면 탐색 |
| `/dev/pub` | 퍼블리셔 화면 | 목업 데이터로 View 컴포넌트 미리보기 |
| `/dev/ui` | UI 컴포넌트 카탈로그 | 공통 컴포넌트·디자인 토큰 확인 |
| `/dev/ref` | 코드 레퍼런스 | Page·View 작성 패턴·주석 가이드 |
| `/dev/bridge` | Bridge 테스트 | 웹↔네이티브 이벤트 시나리오 테스트 |
| `/dev/auth` | 인증 디버그 | 토큰 상태, 사용자 정보, AuthStore 확인(4장) |
| `/dev/member-list` | 멤버목록 테스트 | `features/_templates/member/MemberListPage.tsx` re-export |
| `/dev/campaign-test` | 캠페인 테스트(주문 목록 조회) | `features/_templates/campaign-test/CampaignTestPage.tsx` re-export |

---

## 2. IA 네비게이터 (`/dev/ia`)

### 데이터 파일 (`app/dev/ia/_data/ia.ts`)

IA 구조가 정의된 중앙 데이터 파일입니다.  
`_data/` 폴더는 Next.js 라우팅에서 제외됩니다.

```ts
export interface IAItem {
  id:       string;
  label:    string;
  path?:    string;     // 실제 앱 경로 (링크 활성화)
  pattern?: string;     // 동적 라우트 패턴 표시 전용 (비링크)
  children: IAItem[];
}

export const IA_DATA: IAItem[] = [
  {
    id: 'earn',
    label: '적립',
    children: [
      { id: 'mission-list', label: '미션 목록', path: '/earn/mission', children: [] },
      { id: 'mission-detail', label: '미션 상세', pattern: '/earn/mission/[id]', children: [] },
    ],
  },
];
```

### 신규 화면 추가

`page.tsx` 생성과 함께 IA 데이터에 항목을 추가합니다.

```ts
// 정적 경로
{ id: 'new-screen', label: '새 화면', path: '/earn/new-screen', children: [] }

// 동적 경로 (실제 ID 필요)
{ id: 'new-detail', label: '새 화면 상세', pattern: '/earn/new-screen/[id]', children: [] }
```

### 탐색 구조

```
/dev/ia                       ← 섹션 목록 (공통, 메인, 적립, ...)
  └── /dev/ia/[section]       ← 섹션 내 1depth 화면 목록
        └── /dev/ia/[section]/[depth1]  ← 하위 화면 + 실제 경로 이동
```

---

## 3. Bridge 테스트 도구 (`/dev/bridge`)

네이티브 앱 없이 Bridge 이벤트를 시뮬레이션합니다.

```
/dev/bridge
  ├── web-to-native/    ← window.bridge 메서드 직접 호출 테스트 (단일 페이지)
  ├── native-to-web/    ← window.onBridgeEvent 이벤트 수동 발행 테스트 (단일 페이지)
  ├── scenario/         ← 시나리오별 이벤트 시퀀스 실행 (native-to-web의 하위가 아니라 별도 최상위 경로)
  │   ├── auth/, bio-auth/, pin-auth/, key-rotation/, token-storage/
  │   ├── gps/, image-upload/, video-handoff/, video-tracking/
  │   ├── back-event/, locale-change/
  ├── file-upload-test/ ← 파일 업로드 단독 테스트
  └── full-test/        ← 통합 테스트
```

개발 서버에서 `window.onBridgeEvent`를 콘솔에서 직접 호출해 이벤트를 시뮬레이션할 수도 있습니다.

```js
// 브라우저 콘솔에서 GPS 이벤트 시뮬레이션
window.onBridgeEvent('gpsResult', { latitude: 37.5665, longitude: 126.9780, accuracy: 10 });

// 인증 코드 이벤트 시뮬레이션
window.onBridgeEvent('appAuthCode', { code: 'test-auth-code-12345' });
```

---

## 4. 인증 디버그 도구 (`/dev/auth`)

로그인 없이 개발할 때 또는 인증 흐름을 디버깅할 때 사용합니다.  
마운트 시 `appAuthCode` 이벤트를 구독하고 `window.bridge?.requestAuthCode()`를 호출해 자동으로 인증을 시도합니다.

- **로그인 상태 / 사용자 정보**: `useAuthStore`의 `isAuthenticated`·`user`(id/이름/이메일/역할/프로필 이미지) 실시간 확인
- **Access Token**: `getAccessToken()`으로 조회한 현재 토큰 값 표시(토큰 값 자체이며, 만료 시간 표시는 없음)
- **Refresh 버튼**: `POST /auth/refresh`를 DPoP proof와 함께 직접 호출해 토큰을 갱신하고 `setAuth`로 반영
- **Logout 버튼**: `useAuth().logout()` 호출(webview 모드: 서버 로그아웃 + 네이티브 알림 + DPoP 키 삭제 + 상태 초기화)

⚠️ DPoP 키쌍(IndexedDB) 존재 여부·공개키를 직접 보여주는 UI는 없습니다.

---

## 5. UI 컴포넌트 카탈로그 (`/dev/ui`)

공통 컴포넌트의 모든 variant·size·상태를 확인합니다.

```
/dev/ui               ← 통합 카탈로그 (탭별 분류)
  ├── button/         ← Button 전용 상세 페이지
  ├── input/          ← Input 전용
  ├── modal/          ← Modal 전용
  ├── toast/          ← Toast 전용
  ├── table/          ← Table 전용
  └── tokens/         ← 디자인 토큰 (색상, 타이포그래피)
```

새 공통 컴포넌트를 추가할 때 `/dev/ui` 등록 방법은 `14-ui-catalog-contribution.md`를 참고하세요.

---

## 6. 코드 레퍼런스 (`/dev/ref`)

```
/dev/ref
  ├── publisher/     ← ExampleView.tsx 작성 패턴 (퍼블리셔용)
  ├── developer/     ← ExamplePage.tsx 작성 패턴 (개발자용)
  └── preview/       ← 실제 화면 미리보기
```

`features/_templates/`의 템플릿 파일과 연동됩니다.

---

## 7. 로컬 환경 설정

### 기본은 HTTP

`npm run dev`(포트 3000)가 기본값이며 HTTP로 실행됩니다.  
인증서 준비 없이 바로 사용할 수 있어 대부분의 화면 개발은 이 모드로 진행합니다.

### HTTPS 인증서 (선택 — 필요할 때만)

아래 경우에는 `npm run dev:https`(포트 3001, HTTPS)를 사용합니다.

- 같은 Wi-Fi의 **실기기(LAN IP)** 로 접속해 테스트할 때 — LAN IP는 브라우저가 보안 컨텍스트로 인정하지 않아 WebCrypto(DPoP 키 생성)가 동작하지 않습니다.
- DPoP·인증 관련 기능을 정밀하게 개발/디버깅할 때

인증서 경로는 `next.config.mjs`가 아니라 **`package.json`의 `dev:https` 스크립트**에 지정되어 있습니다.

```json
"dev:https": "next dev --experimental-https --experimental-https-key ./keyfile/local-key.pem --experimental-https-cert ./keyfile/local-cert.pem --port 3001 --hostname 0.0.0.0"
```

즉 인증서 파일은 **프로젝트 루트의 `keyfile/` 폴더**(`./keyfile/local-key.pem`, `./keyfile/local-cert.pem`)에 있어야 하며, 저장소에는 포함되지 않습니다(각자 준비).  
인증서가 없거나 만료된 경우 mkcert 등으로 재발급해 해당 경로에 배치합니다.

```powershell
# mkcert 설치 후 (Windows, 파일 서버에서 mkcert.exe 확보 — 02-environment-setup.md 1장 참고)
mkcert -install
mkcert -key-file ./keyfile/local-key.pem -cert-file ./keyfile/local-cert.pem localhost 127.0.0.1
```

### 실기기 테스트

같은 Wi-Fi의 모바일 기기에서 개발 서버에 접속할 수 있습니다.  
실기기 접속은 LAN IP를 사용하므로 **HTTPS(`npm run dev:https`)가 필요**합니다.

```env
# .env.local
ALLOWED_DEV_ORIGINS=192.168.1.100  # 개발 PC IP
```

`next.config.mjs`의 `allowedDevOrigins`도 확인합니다.  
기본값은 `['localhost', '127.0.0.1']`입니다.

모바일 브라우저에서 `https://192.168.1.100:3001`으로 접속합니다(HTTPS, `npm run dev:https` 기준).

---

## 8. 개발 서버 재시작이 필요한 경우

다음 파일을 변경하면 `Ctrl+C` 후 `npm run dev`로 재시작합니다.

- `next.config.mjs`
- `.env.local`
- `tailwind.config.ts`
- `instrumentation.ts`

---

## 9. 프로덕션 빌드 체크

```bash
# 타입 체크
npx tsc --noEmit

# lint 검사
npm run lint

# 프로덕션 빌드
npm run build
```

빌드 에러 없이 통과해야 PR 머지가 가능합니다.
