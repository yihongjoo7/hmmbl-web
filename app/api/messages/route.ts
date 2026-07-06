import { NextRequest, NextResponse } from 'next/server';
import { supportedLocales } from '@/lib/i18n/config';
import { translateBatch } from '@/lib/i18n/translate';

/**
 * GET /api/messages?locale=ja
 *
 * 웹뷰 클라이언트(LocaleProvider)가 동적 locale(ja·th·vi·ms)의
 * 번역 메시지를 가져오기 위해 호출한다.
 *
 * 정적 locale(ko·en·zh): 해당 messages/*.json 파일 반환
 * 동적 locale(ja·th·vi·ms): en.json → Azure Translator (서버 사이드 캐시 활용)
 */

const DYNAMIC_LOCALES = new Set(['ja', 'th', 'vi', 'ms']);

async function translateMessages(
  messages: Record<string, unknown>,
  targetLocale: string,
  sourceLocale: string,
): Promise<Record<string, unknown>> {
  const strings: string[]                   = [];
  const setters: Array<(v: string) => void> = [];

  // 중첩 구조를 재귀 탐색해 문자열 값과 대입 클로저를 수집한다.
  // 결과 객체(dst)는 탐색과 동시에 구조가 구성된다.
  function collect(src: Record<string, unknown>, dst: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(src)) {
      if (typeof value === 'string') {
        strings.push(value);
        setters.push((v) => { dst[key] = v; });
      } else if (value && typeof value === 'object') {
        dst[key] = {};
        collect(value as Record<string, unknown>, dst[key] as Record<string, unknown>);
      } else {
        dst[key] = value;
      }
    }
  }

  const result: Record<string, unknown> = {};
  collect(messages, result);

  const translated = await translateBatch(strings, targetLocale, sourceLocale);
  setters.forEach((set, i) => set(translated[i]));

  return result;
}

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') ?? 'ko';

  if (!(supportedLocales as readonly string[]).includes(locale)) {
    return NextResponse.json({ error: 'unsupported locale' }, { status: 400 });
  }

  try {
    if (DYNAMIC_LOCALES.has(locale)) {
      const enMessages = (await import('@/messages/en.json')).default;
      const translated = await translateMessages(
        enMessages as Record<string, unknown>,
        locale,
        'en',
      );
      return NextResponse.json(translated, {
        headers: {
          // CDN 4h, SWR 8h — en.json 변경 후 최대 4h 내 CDN 자동 갱신
          'Cache-Control': 'public, s-maxage=14400, stale-while-revalidate=28800',
        },
      });
    }

    const messages = (await import(`@/messages/${locale}.json`)).default;
    return NextResponse.json(messages, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' },
    });
  } catch {
    return NextResponse.json({ error: 'messages load failed' }, { status: 500 });
  }
}
