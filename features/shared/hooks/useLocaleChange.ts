'use client';
/**
 * 다국어 언어 전환 훅 (Bridge 이벤트 수신)
 *
 * 네이티브가 HPOINT_LOCALE 쿠키를 설정한 후
 * 'appLanguage'(초기) / 'appLanguageChanged'(변경) 이벤트를 발행하면
 * 쿠키를 갱신하고 현재 locale 상태를 업데이트합니다.
 *
 * appLanguageChanged: 페이지 새로고침을 트리거해 서버 컴포넌트에 반영합니다.
 */

import { useState, useEffect } from 'react';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';

const SUPPORTED = ['ko', 'en', 'ja', 'zh'] as const;
type Locale = typeof SUPPORTED[number];

function isLocale(v: string): v is Locale {
  return (SUPPORTED as readonly string[]).includes(v);
}

function getLocaleCookie(): Locale {
  if (typeof document === 'undefined') return 'ko';
  const m = document.cookie.match(/(?:^|;\s*)HPOINT_LOCALE=([^;]+)/);
  const v = m?.[1] ?? '';
  return isLocale(v) ? v : 'ko';
}

function setLocaleCookie(locale: Locale) {
  if (typeof document === 'undefined') return;
  document.cookie = `HPOINT_LOCALE=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
}

export function useLocaleChange(): Locale {
  const [locale, setLocale] = useState<Locale>('ko');

  useEffect(() => {
    setLocale(getLocaleCookie());

    const u1 = bridgeEventBus.on<{ locale: string }>('appLanguage', ({ locale: l }) => {
      if (!isLocale(l)) return;
      setLocaleCookie(l);
      setLocale(l);
    });

    const u2 = bridgeEventBus.on<{ locale: string }>('appLanguageChanged', ({ locale: l }) => {
      if (!isLocale(l)) return;
      setLocaleCookie(l);
      window.location.reload();
    });

    return () => { u1(); u2(); };
  }, []);

  return locale;
}
