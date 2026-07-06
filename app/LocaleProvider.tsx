'use client';

/**
 * app/LocaleProvider.tsx
 *
 * 다국어 Provider (WebView 전용)
 *
 * WebviewLayoutClient에서 dynamic({ ssr:false })로 로드되므로 서버 렌더링이
 * 비활성화된다 → 서버(기본 locale) vs 클라이언트(쿠키 locale) 초기값 불일치로
 * 인한 hydration 에러가 원천 차단된다.
 *
 * locale 메시지 결정:
 *   - 정적(ko·en·zh): messages/*.json 번들을 useState lazy initializer로
 *     첫 렌더 전 동기 선택 → 플리커 없음
 *   - 동적(ja·th·vi·ms): /api/messages?locale=xx (서버 Azure 번역 + 캐시) fetch
 *     → 첫 렌더는 영어 fallback, 완료 후 교체(스피너). 비동기 특성상 의도된 동작.
 *
 * 언어 변경(브리지 이벤트):
 *   - 'appLanguage'(초기 1회) → 즉시 적용
 *   - 'appLanguageChanged'(변경) → 쿠키 갱신 후 전체 새로고침
 *
 * 쿠키: HPOINT_LOCALE (네이티브가 설정, 웹은 폴백/동기화)
 */

import { ReactNode, useEffect, useState } from 'react';
import enMessages from '@/messages/en.json';
import koMessages from '@/messages/ko.json';
import zhMessages from '@/messages/zh.json';
import { NextIntlClientProvider } from 'next-intl';
import { HtmlLang } from '@/components/common/HtmlLang';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';
import { defaultLocale, supportedLocales, type Locale } from '@/lib/i18n/config';

// 정적 JSON이 없는 locale — /api/messages?locale=xx 로 서버 번역본을 가져온다.
// 새 동적 locale 추가 시 이 Set에도 함께 추가해야 한다.
const DYNAMIC_LOCALES = new Set(['ja', 'th', 'vi', 'ms']);

// 번들에 포함된 메시지(모듈 레벨 동기 import) — lazy initializer에서 첫 렌더 전 선택용.
// 새 정적 locale(messages/*.json 추가) 시 이 맵에도 함께 등록해야 한다.
const STATIC_MESSAGES: Record<string, Record<string, unknown>> = {
  en: enMessages,
  ko: koMessages,
  zh: zhMessages,
};

function setLocaleCookie(locale: string): void {
  document.cookie = [
    'HPOINT_LOCALE=' + encodeURIComponent(locale),
    'path=/',
    'Secure',
    'SameSite=Strict',
    'Max-Age=31536000', // 1년
  ].join('; ');
}

function getLocaleCookie(): Locale {
  if (typeof document === 'undefined') return defaultLocale;
  const match = document.cookie.match(/(?:^|;\s*)HPOINT_LOCALE=([^;]+)/);
  const raw   = match ? decodeURIComponent(match[1]) : defaultLocale;
  return (supportedLocales as readonly string[]).includes(raw)
    ? (raw as Locale)
    : defaultLocale;
}

// 네이티브 이벤트 페이로드에서 locale 추출 — { locale } 또는 { language } 또는 문자열.
function extractLocale(payload: unknown): string | null {
  if (typeof payload === 'string') return payload;
  if (typeof payload === 'object' && payload !== null) {
    const p = payload as Record<string, unknown>;
    const loc = p.locale ?? p.language;
    return typeof loc === 'string' ? loc : null;
  }
  return null;
}

function toSafeLocale(loc: string): Locale {
  return (supportedLocales as readonly string[]).includes(loc)
    ? (loc as Locale)
    : defaultLocale;
}

// 언어 변경(applyLocale) 시 메시지 로드. 초기 렌더는 STATIC_MESSAGES로 동기 처리.
async function loadMessages(loc: string): Promise<Record<string, unknown>> {
  if (DYNAMIC_LOCALES.has(loc)) {
    try {
      const res = await fetch(`/api/messages?locale=${encodeURIComponent(loc)}`);
      if (!res.ok) return {};
      return res.json() as Promise<Record<string, unknown>>;
    } catch {
      return {};
    }
  }
  try {
    const mod = await import('@/messages/' + loc + '.json') as { default: Record<string, unknown> };
    return mod.default;
  } catch {
    return {};
  }
}

export default function LocaleProvider({ children }: { children: ReactNode }) {
  // ssr:false 로 로드되므로 첫 렌더 전 브라우저 환경이 보장된다.
  // lazy initializer로 쿠키 locale을 첫 렌더 전 동기 선택 → 플리커/hydration 에러 없음.
  const [locale, setLocale] = useState<Locale>(getLocaleCookie);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [messages, setMessages] = useState<any>(() => {
    const loc = getLocaleCookie();
    return STATIC_MESSAGES[loc] ?? enMessages;
  });

  const [messagesLoading, setMessagesLoading] = useState(false);

  // 동적 locale 초기 메시지 로드 (정적은 lazy initializer에서 이미 설정됨)
  useEffect(() => {
    const loc = getLocaleCookie();
    if (!DYNAMIC_LOCALES.has(loc)) return;
    setMessagesLoading(true);
    void loadMessages(loc).then((msgs) => {
      setMessages(msgs);
      setMessagesLoading(false);
    });
  }, []);

  // 브리지 언어 이벤트 구독
  useEffect(() => {
    function applyLocale(loc: string): void {
      const safeLoc = toSafeLocale(loc);
      setLocaleCookie(safeLoc);
      setLocale(safeLoc);
      if (STATIC_MESSAGES[safeLoc]) {
        // 정적 locale: 번들 메시지를 즉시 동기 교체 — 추가 fetch 불필요
        setMessages(STATIC_MESSAGES[safeLoc]);
      } else {
        // 동적 locale: /api/messages Azure 번역 호출
        setMessagesLoading(true);
        void loadMessages(safeLoc).then((msgs) => {
          setMessages(msgs);
          setMessagesLoading(false);
        });
      }
    }

    // 초기 언어 수신
    const unsubAppLanguage = bridgeEventBus.on<{ locale: string }>(
      'appLanguage',
      (data) => {
        const loc = extractLocale(data);
        if (loc) applyLocale(loc);
      },
    );

    // 언어 변경 → 전체 새로고침으로 처리(서버 컴포넌트 re-fetch 포함)
    const unsubLanguageChanged = bridgeEventBus.on<{ locale: string }>(
      'appLanguageChanged',
      (data) => {
        const loc = extractLocale(data);
        if (loc) {
          setLocaleCookie(loc);
          window.location.reload();
        }
      },
    );

    return () => {
      unsubAppLanguage();
      unsubLanguageChanged();
    };
  }, []);

  return (
    // timeZone: 서버·클라이언트 날짜/시간 포맷 불일치 방지. Asia/Seoul 고정(앱 기본 locale=ko).
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Seoul">
      <HtmlLang locale={locale} />
      {children}
      {/* 동적 locale(ja·th·vi·ms) 메시지 fetch 중 스피너 */}
      {messagesLoading && (
        <div style={{
          position:       'fixed',
          inset:          0,
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          background:     'rgba(0,0,0,0.25)',
          zIndex:         9999,
        }}>
          <style>{`@keyframes _mspn { to { transform: rotate(360deg); } }`}</style>
          <div style={{
            width:        '48px',
            height:       '48px',
            border:       '5px solid rgba(255,255,255,0.3)',
            borderTop:    '5px solid #fff',
            borderRadius: '50%',
            animation:    '_mspn 0.8s linear infinite',
          }} />
        </div>
      )}
    </NextIntlClientProvider>
  );
}
