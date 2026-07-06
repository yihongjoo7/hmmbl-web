# 환경 설정 및 코드 컨벤션

> 대상: 개발자  
> 프로젝트 초기 설정, 환경변수, 코드 품질 도구 설정을 다룹니다.

---

## 1. 로컬 개발 환경 설정

### 사전 요구사항

- Node.js 18 이상
- npm 9 이상

### 초기 설치

```bash
cd hpoint-mobile
npm install
```

### 개발 서버 실행

```bash
npm run dev        # HTTPS, 포트 3001
npm run dev:http   # HTTP(인증서 없이), 포트 3000
```

`npm run dev`(HTTPS)는 **포트 3001**에서 실행됩니다: `https://localhost:3001`. 이 프로젝트는 기본적으로 **HTTPS**를 사용합니다. 로컬 인증서 경로는 `package.json`의 `dev` 스크립트에 `../keyfile/local-key.pem`·`../keyfile/local-cert.pem`(프로젝트 루트 기준 상위 `keyfile/` 폴더)로 지정되어 있습니다 — 저장소에는 포함되지 않으므로(gitignore) 별도로 준비해야 합니다. 브라우저 인증서 경고는 "고급 → 계속 진행"으로 무시합니다.

HTTPS 인증서 없이 빠르게 확인하려면 `npm run dev:http`(포트 3000, `http://localhost:3000`)를 사용합니다. 단, 웹뷰 관련 기능(DPoP WebCrypto 등)은 HTTPS(또는 localhost 예외)에서만 정상 동작하므로 인증 관련 작업은 `npm run dev`를 권장합니다.

---

## 2. 환경변수 (.env.local)

`.env.local` 파일을 프로젝트 루트에 생성합니다. 이 파일은 `.gitignore`에 포함되어 있으며 절대 커밋하지 않습니다.

```env
# API 서버 주소 (필수)
NEXT_PUBLIC_API_BASE_URL=https://api-dev.hpoint.com

# 모바일 실기기 접속 허용 IP (선택 — 실기기 테스트 시)
ALLOWED_DEV_ORIGINS=192.168.1.100
```

| 변수 | 필수 | 설명 |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | ✅ | API 서버 주소. apiClient와 DPoP Proof 생성에 사용됨 |
| `ALLOWED_DEV_ORIGINS` | 선택 | 실기기 테스트용 개발 PC IP |

> `NEXT_PUBLIC_` 접두어가 있는 변수는 클라이언트 번들에 포함됩니다. 시크릿 값은 이 접두어를 사용하지 않습니다.

---

## 3. next.config.mjs

```js
// .env.local의 ALLOWED_DEV_ORIGINS(콤마 구분)를 읽어 배열로 변환.
// 미설정 시 ['localhost', '127.0.0.1']로 폴백한다.
const allowedDevOrigins = (process.env.ALLOWED_DEV_ORIGINS ?? '')
  .split(',').map((s) => s.trim()).filter(Boolean);

const nextConfig = {
  allowedDevOrigins: allowedDevOrigins.length ? allowedDevOrigins : ['localhost', '127.0.0.1'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.hpoint.com' },
    ],
  },
};
```

> ⚠️ `next-intl` 플러그인은 연결되어 있지 않습니다(주석: "WebView 전용 — 다국어 불필요"). `next-intl`은 `package.json` 의존성에는 있지만 `next.config.mjs`에서 플러그인으로 wrap하지 않습니다. i18n 상세는 `16-i18n-guide.md` 참고.

### `allowedDevOrigins`

개발 서버에서 CORS를 허용할 오리진 목록입니다. 실기기 테스트 시 `.env.local`의 `ALLOWED_DEV_ORIGINS`를 추가하면 자동으로 이 배열에 반영됩니다.

### `images.remotePatterns`

`next/image`로 외부 이미지를 로드할 수 있는 도메인을 제한합니다. 현재 `**.hpoint.com` (서브도메인 포함)이 허용됩니다. 새 이미지 도메인이 필요하면 이 목록에 추가합니다.

```js
// 예: 파트너사 CDN 도메인 추가
{ protocol: 'https', hostname: 'cdn.partner.com' }
```

> `next.config.mjs` 수정 후에는 개발 서버를 재시작해야 반영됩니다.

---

## 4. commitlint — 커밋 메시지 컨벤션

### 형식

```
<type>(<scope>): <subject>
```

- `type`: 변경 종류 (아래 표 참고)
- `scope`: 변경 영역 (선택, 예: `auth`, `bridge`, `earn`)
- `subject`: 변경 내용 요약 (최대 100자, 소문자 시작 허용)

### 허용 타입

| 타입 | 용도 |
|---|---|
| `feat` | 새로운 기능 |
| `fix` | 버그 수정 |
| `docs` | 문서 수정 |
| `style` | 코드 포맷 변경 (기능 변경 없음) |
| `refactor` | 리팩토링 |
| `test` | 테스트 추가·수정 |
| `chore` | 빌드 설정, 패키지 관리 등 |
| `perf` | 성능 개선 |
| `ci` | CI/CD 설정 변경 |
| `revert` | 커밋 되돌리기 |

### 예시

```bash
feat(bridge): add requestStepCount action
fix(auth): resolve token cache expiry edge case
docs(api): add applyFieldErrors usage example
chore: upgrade antd-mobile to 5.37.0
refactor(earn): extract MissionCard to shared component
```

### 설정 파일

`commitlint.config.js`에 규칙이 정의되어 있습니다. husky의 `commit-msg` 훅이 커밋 시 자동으로 검사합니다.

husky가 설치되지 않은 경우:

```bash
npm install --save-dev @commitlint/config-conventional @commitlint/cli husky lint-staged
npx husky init
# .husky/commit-msg 파일에 추가:
echo 'npx --no -- commitlint --edit $1' > .husky/commit-msg
```

---

## 5. ESLint — 코드 품질 규칙

### 주요 규칙

| 규칙 | 수준 | 설명 |
|---|---|---|
| `@typescript-eslint/no-explicit-any` | warn | `any` 타입 사용 경고 |
| `@typescript-eslint/no-unused-vars` | warn | 미사용 변수 경고 (`_` 접두어 제외) |
| `@typescript-eslint/consistent-type-imports` | warn | `import type` 사용 권장 |
| `@typescript-eslint/no-non-null-assertion` | warn | `!` non-null assertion 경고 |
| `no-console` | warn | `console.log` 사용 경고 (`console.warn`, `console.error`는 허용) |
| `prefer-const` | **error** | `let` 대신 `const` 강제 |
| `no-var` | **error** | `var` 사용 금지 |
| `eqeqeq` | **error** | `===` 대신 `==` 사용 금지 |

### console 사용 정책

```ts
console.log('debug');   // ❌ ESLint warn — 커밋 전 제거
console.warn('경고');    // ✅ 허용
console.error('에러');   // ✅ 허용
```

프로덕션 로깅은 `lib/logger`의 `logger.error()`를 사용합니다.

### lint 실행

```bash
npm run lint          # 전체 검사
npm run lint -- --fix # 자동 수정 가능한 항목 수정
```

---

## 6. TypeScript 설정

`tsconfig.json`의 주요 설정:

- `strict: true` — 모든 strict 검사 활성화
- `paths: { "@/*": ["./*"] }` — `@/` alias 사용 (상대경로 대신 사용)
- `moduleResolution: "bundler"` — Next.js 14 권장 설정

### import 경로 규칙

```ts
// ✅ @ alias 사용
import { apiClient } from '@/lib/api/apiClient';
import { Button }    from '@/components/common/ui/action/Button';

// ❌ 상대경로 사용 금지 (루트에서 먼 경우)
import { apiClient } from '../../../../lib/api/apiClient';
```

---

## 7. 개발 서버 재시작이 필요한 경우

아래 파일을 수정하면 개발 서버(`Ctrl+C` 후 `npm run dev`)를 재시작해야 합니다.

- `next.config.mjs`
- `.env.local`
- `tailwind.config.ts`
- `instrumentation.ts`

---

## 8. 에디터 설정 (VS Code) — PostCSS/Tailwind 문법 인식

이 프로젝트는 스타일링을 Tailwind CSS(PostCSS 플러그인 기반)로 처리합니다(`postcss.config.js`, `styles/globals.css`의 `@tailwind` 지시어). 확장 없이 VS Code 기본 CSS 언어 서버로 `styles/globals.css`를 열면 `@tailwind`를 "알 수 없는 at-rule"로 인식해 빨간 줄이 표시될 수 있습니다.

### 설치할 확장

| 확장 | ID | 역할 |
|---|---|---|
| Tailwind CSS IntelliSense | `bradlc.vscode-tailwindcss` | `@tailwind`·`@apply`·`@layer`·`theme()` 등 인식, 클래스 자동완성·hover 미리보기 |
| PostCSS Language Support | `csstools.postcss` | PostCSS 문법이 섞인 `.css` 파일의 구문 강조·오탐 경고 방지 |

### 권장 워크스페이스 설정 (`.vscode/settings.json`)

저장소에는 아직 `.vscode/` 설정이 커밋되어 있지 않으므로, 필요하면 개인 환경에 아래 내용을 추가합니다.

```json
{
  "files.associations": {
    "*.css": "postcss"
  },
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false
}
```

`*.css` 파일을 PostCSS 언어로 인식시키고 내장 CSS validator를 꺼서, `@tailwind`/`@apply` 관련 오탐 경고를 없애는 조합입니다. 자동완성까지 활용하려면 Tailwind CSS IntelliSense 설치가 필수입니다.
