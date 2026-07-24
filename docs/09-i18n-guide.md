# 다국어(i18n) 처리 가이드

> 대상: 개발자  
> `HPOINT_LOCALE` 쿠키 기반 로케일 관리, `next-intl` 클라이언트 Provider, 정적 번역 메시지를 다룹니다.

---

## 1. 개요

이 프로젝트는 `next-intl` **패키지의 `NextIntlClientProvider`는 사용하지만, `next-intl`의 Next.js 빌드 플러그인·미들웨어·URL 라우팅은 사용하지 않습니다**(`next.config.mjs`에 플러그인 wrap 없음).  
대신 **쿠키(`HPOINT_LOCALE`)** 기반으로 클라이언트에서 로케일을 결정합니다. 언어 전환 UI는 현재 없으며, 쿠키가 없으면 기본 로케일(`ko`)을 사용합니다.

지원 로케일은 `lib/i18n/config.ts`의 `supportedLocales`에 정의되어 있습니다.

| 로케일 | 번역 소스 |
|---|---|
| `ko`(기본) · `en` · `zh` | `messages/*.json` 번들 (빌드에 포함) |
| `ja` · `th` · `vi` · `ms` | `/api/messages?locale=xx` (서버 Azure 번역 + 캐시, 동적) |

---

## 2. 로케일 흐름

```
HPOINT_LOCALE 쿠키 조회 (path=/, Secure, SameSite=Strict, 1년)
      │  쿠키 없음/미지원 값 → defaultLocale('ko')로 폴백
      ▼
app/LocaleProvider.tsx 가 첫 렌더 전 useState lazy initializer로 동기 결정
  - 정적 로케일(ko/en/zh): 번들 메시지를 즉시 동기 선택
  - 동적 로케일(ja/th/vi/ms): /api/messages fetch (초기 렌더는 en 폴백)
      │
      ▼
NextIntlClientProvider locale·messages 로 하위 트리 렌더
```

---

## 3. `app/LocaleProvider.tsx` — 실제 마운트되는 Provider

앱 전역에서 실제로 로케일·메시지를 관리하는 곳은 **`app/LocaleProvider.tsx`**입니다.  
`app/WebviewLayoutClient.tsx`에서 `next/dynamic`으로 `{ ssr: false }` 로드됩니다(서버 렌더링을 꺼서 서버 기본 로케일과 클라이언트 쿠키 로케일 간 hydration 불일치를 원천 차단).

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
- 동적 로케일(`ja`/`th`/`vi`/`ms`)은 마운트 시 `/api/messages`를 fetch합니다(로딩 중 스피너 표시).
- 최종적으로 `<NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Seoul">`로 하위 트리를 감쌉니다. `timeZone`은 서버·클라이언트 날짜 포맷 불일치 방지를 위해 `Asia/Seoul`로 고정되어 있습니다(앱 기본 로케일이 `ko`이므로).
- `<HtmlLang locale={locale} />`로 `<html lang>` 속성도 동기화합니다.

새 정적 로케일을 추가하려면 `LocaleProvider.tsx`의 `STATIC_MESSAGES` 맵에 등록해야 합니다(파일 상단 주석에 명시).

---

## 4. 번역 파일 구조 (`messages/`)

```
messages/
├── ko.json   ← 한국어 (기본, 정적)
├── en.json   ← 영어 (정적)
└── zh.json   ← 중국어 (정적)
```

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
- 정적 파일(`ko`/`en`/`zh`) 세 개의 키 구조는 동일하게 유지합니다.

---

## 5. 클라이언트 컴포넌트에서 번역 사용

`next-intl`의 표준 훅을 그대로 사용합니다(프로젝트 자체 `useTranslations` 래퍼는 없습니다).

```tsx
'use client';
import { useTranslations } from 'next-intl';

function MissionCard() {
  const t = useTranslations('earn');
  return <h2>{t('mission')}</h2>;
}
```

`Intl` API 기반 포매터(`lib/i18n/helpers.ts`)도 함께 제공됩니다.

```ts
import { formatCurrency, formatDate, formatNumber } from '@/lib/i18n/helpers';

formatCurrency(15000, 'ko', 'KRW'); // "₩15,000"
formatDate(new Date(), 'ko');       // "2026년 7월 2일"
```

---

## 6. 신규 번역 키 추가 절차

1. `messages/ko.json`에 키 추가 (한국어 기준, 최상위 도메인 키 아래).
2. `messages/en.json`, `messages/zh.json`에 동일 키 추가.

```json
// en.json
{
  "earn": {
    "mission": "Mission"
  }
}
```

---

## 7. 로케일 관련 주의사항

- 언어 전환 UI가 추가되면 `HPOINT_LOCALE` 쿠키를 설정한 뒤 새로고침하는 방식으로 연결합니다. 현재는 쿠키를 설정하는 진입점이 없어 항상 기본 로케일을 사용합니다.
- 지원하지 않는 로케일 값이 쿠키에 있으면 기본값 `'ko'`로 폴백됩니다(`lib/i18n/config.ts`의 `defaultLocale`).
- SSR이 비활성화된 컴포넌트이므로(`ssr:false`) 서버 사이드 쿠키 접근 이슈 자체가 없습니다 — 대신 첫 렌더가 항상 클라이언트에서 일어나는 트레이드오프가 있습니다.
