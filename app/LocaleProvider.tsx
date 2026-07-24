'use client';

/**
 * app/LocaleProvider.tsx
 *
 * 다국어 Provider
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
 * 쿠키: HPOINT_LOCALE — 언어 전환 UI가 추가되면 쿠키 설정 후 새로고침하는 방식으로
 * 연결한다(현재는 언어 전환 진입점 없음, 쿠키 없으면 기본값 사용).
 */

import { ReactNode, useEffect, useState } from 'react';
import enMessages from '@/messages/en.json';
import koMessages from '@/messages/ko.json';
import zhMessages from '@/messages/zh.json';
import { NextIntlClientProvider } from 'next-intl';
import { HtmlLang } from '@/components/common/HtmlLang';
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

function getLocaleCookie(): Locale {
  if (typeof document === 'undefined') return defaultLocale;
  const match = document.cookie.match(/(?:^|;\s*)HPOINT_LOCALE=([^;]+)/);
  const raw   = match ? decodeURIComponent(match[1]) : defaultLocale;
  return (supportedLocales as readonly string[]).includes(raw)
    ? (raw as Locale)
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
  const [locale] = useState<Locale>(getLocaleCookie);

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
