'use client';
import { useEffect } from 'react';

interface HtmlLangProps {
  locale: string;
}

/**
 * html[lang] 속성을 현재 locale에 맞게 동적으로 업데이트한다.
 *
 * 루트 layout.tsx는 SSR 시 lang="ko"를 기본값으로 가지며,
 * 이 컴포넌트가 마운트될 때 실제 locale로 교체된다.
 * 스크린리더·번역 도구의 올바른 언어 인식에 필요하다.
 */
export function HtmlLang({ locale }: HtmlLangProps) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
