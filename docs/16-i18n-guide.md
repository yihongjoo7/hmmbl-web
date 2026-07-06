# 다국어(i18n) 처리 가이드

> 대상: 개발자  
> `HPOINT_LOCALE` 쿠키 기반 로케일 관리, `next-intl` 클라이언트 Provider, 정적/동적 번역 메시지, Bridge 연동을 다룹니다.

---

## 1. 개요

이 프로젝트는 `next-intl` **패키지의 `NextIntlClientProvider`는 사용하지만, `next-intl`의 Next.js 빌드 플러그인·미들웨어·URL 라우팅은 사용하지 않습니다**(`next.config.mjs`에 플러그인 wrap 없음 — "WebView 전용, 다국어 라우팅 불필요"). 대신 **쿠키(`HPOINT_LOCALE`) + Bridge 이벤트** 기반으로 클라이언트에서 로케일을 결정합니다. 네이티브 앱이 로케일을 관리하며, Bridge 이벤트로 웹에 전달합니다.

지원 로케일은 `lib/i18n/config.ts`의 `supportedLocales`에 정의되어 있으며, 번역 소스에 따라 두 그룹으로 나뉩니다.

| 그룹 | 로케일 | 번역 소스 |
|---|---|---|
| 정적 | `ko`(기본) · `en` · `zh` | `messages/*.json` 번들 (빌드에 포함) |
| 동적 | `ja` · `th` · `vi` · `ms` | `en.json` → Azure Translator 실시간 번역(`/api/messages`, 서버 캐시) |

---

## 2. 로케일 흐름

```
네이티브 앱 언어 변경
      │
      ▼
Bridge 이벤트 발행
  appLanguage        → 초기 로케일 전달 (즉시 적용, reload 없음)
  appLanguageChanged → 언어 변경 (쿠키 갱신 + 페이지 전체 reload)
      │
      ▼
app/LocaleProvider.tsx 가 구독
  - 정적 로케일(ko/en/zh): 번들 메시지로 즉시 동기 교체
  - 동적 로케일(ja/th/vi/ms): /api/messages?locale=xx 로 fetch (로딩 중 스피너 오버레이)
      │
      ▼
HPOINT_LOCALE 쿠키 갱신 (path=/, Secure, SameSite=Strict, 1년)
      │
      ▼
NextIntlClientProvider locale·messages 갱신 → 하위 컴포넌트 리렌더
```

---

## 3. `app/LocaleProvider.tsx` — 실제 마운트되는 Provider

앱 전역에서 실제로 로케일·메시지를 관리하는 곳은 `features/shared/hooks/useLocaleChange.ts`가 아니라 **`app/LocaleProvider.tsx`**입니다. `app/WebviewLayoutClient.tsx`에서 `next/dynamic`으로 `{ ssr: false }` 로드됩니다(서버 렌더링을 꺼서 서버 기본 로케일과 클라이언트 쿠키 로케일 간 hydration 불일치를 원천 차단).

```tsx
// app/WebviewLayoutClient.tsx (발췌)
const LocaleProvider = dynamic(() => import('./LocaleProvider'), { ssr: false });

export function WebviewLayoutClient({ children }) {
  // ...훅들...
  return <LocaleProvider>{children}</LocaleProvider>;
}
```

`LocaleProvider` 내부 동작 요약:

- 첫 렌더 전 `useState` lazy initializer로 쿠키에서 로케일을 동기 결정 → 플리커 없음.
- 정적 로케일(`ko`/`en`/`zh`)은 `messages/*.json`을 모듈 레벨에서 미리 import해 즉시 교체.
- 동적 로케일(`ja`/`th`/`vi`/`ms`)은 `/api/messages?locale=xx`를 fetch — 완료 전까지는 영어(`en.json`) 메시지로 렌더링되고, 로딩 중에는 전체 화면 스피너 오버레이가 표시됩니다.
- `appLanguage`/`appLanguageChanged` Bridge 이벤트를 직접 구독해 위 로직을 재실행합니다.
- 최종적으로 `<NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Seoul">`로 하위 트리를 감쌉니다. `timeZone`은 서버·클라이언트 날짜 포맷 불일치 방지를 위해 `Asia/Seoul`로 고정되어 있습니다(앱 기본 로케일이 `ko`이므로).
- `<HtmlLang locale={locale} />`로 `<html lang>` 속성도 동기화합니다.

새 정적 로케일을 추가하려면 `LocaleProvider.tsx`의 `STATIC_MESSAGES` 맵에, 새 동적 로케일을 추가하려면 `DYNAMIC_LOCALES` Set에 함께 등록해야 합니다(파일 상단 주석에 명시).

---

## 4. `useLocaleChange` 훅 (`features/shared/hooks/useLocaleChange.ts`) — 경량 버전, 제한적 사용

```ts
import { useLocaleChange } from '@/features/shared/hooks/useLocaleChange';

const locale = useLocaleChange(); // 'ko' | 'en' | 'ja' | 'zh' (4개만 인식)
```

⚠️ 이 훅은 `ko`/`en`/`ja`/`zh` 4개 로케일만 인식하며(`th`/`vi`/`ms` 미포함), 메시지 로딩은 하지 않고 로케일 문자열만 반환합니다. **현재 실제로 사용하는 곳은 `features/_templates/member/MemberListPage.tsx`(템플릿) 한 곳뿐**이며, 앱 전역 로케일·메시지 관리는 §3의 `LocaleProvider`가 담당합니다. 단순히 현재 로케일 문자열만 필요한 화면에서 참고용으로 사용할 수 있으나, `th`/`vi`/`ms` 지원이 필요하면 `LocaleProvider`의 `supportedLocales` 전체를 인식하도록 확장이 필요합니다.

---

## 5. 번역 파일 구조 (`messages/`)

```
messages/
├── ko.json   ← 한국어 (기본, 정적)
├── en.json   ← 영어 (정적, 동적 로케일의 번역 소스 원문이기도 함)
└── zh.json   ← 중국어 (정적)
```

`ja`/`th`/`vi`/`ms`용 정적 JSON 파일은 없습니다 — Azure Translator가 `en.json`을 실시간 번역합니다(§6).

### 파일 구조 예시 (`messages/ko.json`, 실제 키 기준)

```json
{
  "common": { "confirm": "확인", "cancel": "취소", "loading": "로딩 중...", "..." : "..." },
  "auth":   { "login": "로그인", "biometric": "생체인증", "pattern": "패턴 인증" },
  "main":   { "title": "H.Point" },
  "earn":   { "title": "적립", "coupon": "쿠폰·플포", "mission": "미션", "..." : "..." },
  "use":    { "title": "사용", "product": "상품", "..." : "..." },
  "pay":    { "title": "결제", "brandPayment": "브랜드결제", "..." : "..." },
  "my":     { "title": "마이", "history": "이용내역", "..." : "..." },
  "footer": { "guide": "이용안내", "cs": "고객센터", "..." : "..." },
  "settings": { "title": "설정", "profile": "개인정보변경", "..." : "..." },
  "member": { "list": { "title": "멤버 목록", "..." : "..." }, "..." : "..." }
}
```

### 번역 키 컨벤션

- 최상위 키는 도메인 이름 (`common`, `auth`, `main`, `earn`, `use`, `pay`, `my`, `footer`, `settings`, `member`)
- camelCase 사용
- 정적 파일(`ko`/`en`/`zh`) 세 개의 키 구조는 동일하게 유지 — 동적 로케일은 `en.json` 구조를 그대로 번역해 사용하므로 `en.json`이 사실상 기준 스키마입니다.

---

## 6. 동적 번역 — `/api/messages`, `/api/translate`, `lib/i18n/translate.ts`

### `/api/messages?locale=xx` (`app/api/messages/route.ts`)

`LocaleProvider`가 동적 로케일 메시지 전체 세트를 가져올 때 호출합니다.

- 정적 로케일(`ko`/`en`/`zh`) 요청 시: 해당 `messages/*.json`을 그대로 반환 (CDN 캐시 24h).
- 동적 로케일(`ja`/`th`/`vi`/`ms`) 요청 시: `en.json`의 모든 문자열 값을 재귀 수집 → `translateBatch()`(Azure Translator, 100개 단위 청크 병렬 요청)로 일괄 번역 → 같은 구조로 재조립해 반환 (CDN 캐시 4h, SWR 8h).

### `/api/translate` (`app/api/translate/route.ts`)

임의의 단일 텍스트를 즉석 번역하는 공개 엔드포인트입니다(로그인 불필요 — DPoP/Bearer 토큰 검증 대신 Origin/Referer 화이트리스트 + IP·익명세션 기반 rate limit(분당 30회, 최대 5,000자)으로 보호).

```ts
POST /api/translate
{ "text": "안녕하세요", "targetLocale": "en" }
→ { "translated": "Hello" }
```

### `lib/i18n/translate.ts` — Azure Translator 클라이언트

- `translateText(text, targetLocale, sourceLocale='ko')`: 단건 번역. 인메모리 캐시(최대 1,000건, TTL 24h, LRU 근사) 적용.
- `translateBatch(texts, targetLocale, sourceLocale='en')`: 다건 번역. 캐시 히트는 API 호출 없이 즉시 반환, 미스만 100개 단위로 청크해 병렬 요청.
- `config.azureTranslatorKey`(`lib/config`) 미설정 시 원문을 그대로 반환하고 경고 로그만 남깁니다(번역 실패해도 앱이 깨지지 않도록).

### `features/main/papago/`, `features/main/translate/` — 번역 UI 화면 (IA 131/132)

메인 홈의 "파파고 번역"·"다국어 번역" 화면(`/main/papago`, `/main/translate`)입니다. 현재는 `PapagoPage.tsx`/`TranslatePage.tsx`가 **View만 렌더링하는 placeholder**이며 `/api/translate` 연동은 아직 구현되어 있지 않습니다.

---

## 7. 클라이언트 컴포넌트에서 번역 사용

`next-intl`의 표준 훅을 그대로 사용합니다(프로젝트 자체 `useTranslations` 래퍼는 없습니다).

```tsx
'use client';
import { useTranslations } from 'next-intl';

function MissionCard() {
  const t = useTranslations('earn');
  return <h2>{t('mission')}</h2>;
}
```

⚠️ 이 훅이 동작하려면 상위에 `NextIntlClientProvider`(§3의 `LocaleProvider`)가 마운트되어 있어야 합니다. 이 문서 작성 시점 기준 **실제 feature 코드에서 `useTranslations`를 사용하는 곳은 아직 없습니다**(템플릿 파일에만 예시로 존재) — 화면 텍스트는 대부분 하드코딩되어 있고, 번역 키 인프라만 준비된 상태입니다.

`Intl` API 기반 포매터(`lib/i18n/helpers.ts`)도 함께 제공됩니다.

```ts
import { formatCurrency, formatDate, formatNumber } from '@/lib/i18n/helpers';

formatCurrency(15000, 'ko', 'KRW'); // "₩15,000"
formatDate(new Date(), 'ko');       // "2026년 7월 2일"
```

---

## 8. 신규 번역 키 추가 절차

1. `messages/ko.json`에 키 추가 (한국어 기준, 최상위 도메인 키 아래).
2. `messages/en.json`, `messages/zh.json`에 동일 키 추가.
3. `ja`/`th`/`vi`/`ms`는 파일을 만들지 않습니다 — `en.json`이 갱신되면 `/api/messages`가 자동으로 재번역합니다(CDN 캐시 만료 후 최대 4시간 내 반영).

```json
// en.json
{
  "earn": {
    "mission": "Mission"
  }
}
```

---

## 9. 로케일 관련 주의사항

- `HPOINT_LOCALE` 쿠키는 네이티브 앱이 설정하는 것이 원칙입니다. 웹에서 직접 쿠키를 수정하는 것은 `LocaleProvider` 내부(Bridge 이벤트 수신 시)에서만 허용합니다.
- 지원하지 않는 로케일 값이 쿠키에 있으면 기본값 `'ko'`로 폴백됩니다(`lib/i18n/config.ts`의 `defaultLocale`).
- SSR이 비활성화된 컴포넌트이므로(`ssr:false`) 서버 사이드 쿠키 접근 이슈 자체가 없습니다 — 대신 첫 렌더가 항상 클라이언트에서 일어나는 트레이드오프가 있습니다.
- 동적 로케일은 Azure Translator API 키(`lib/config`의 `azureTranslatorKey`) 설정에 의존합니다. 키가 없으면 원문(영어)이 그대로 노출됩니다.
