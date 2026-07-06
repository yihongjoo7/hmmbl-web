import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/native-strings?locale=en
 * GET /api/native-strings?locale=zh
 *
 * 네이티브 앱(Android)이 en·zh 문자열을 서버에서 가져오기 위해 호출한다.
 * messages/*.json 의 중첩 구조를 dot notation 플랫 키로 변환하여 반환한다.
 *
 * 예: { auth: { login: { title: "Sign In" } } } → { "auth.login.title": "Sign In" }
 *
 * APK 재배포 없이 en·zh 오탈자·번역 수정을 가능하게 하는 엔드포인트.
 */

const SUPPORTED = new Set(['en', 'zh']);

function flatten(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const flatKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      result[flatKey] = value;
    } else if (value && typeof value === 'object') {
      Object.assign(result, flatten(value as Record<string, unknown>, flatKey));
    }
  }
  return result;
}

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') ?? '';

  if (!SUPPORTED.has(locale)) {
    return NextResponse.json({ error: 'unsupported locale' }, { status: 400 });
  }

  try {
    const messages = (await import(`@/messages/${locale}.json`)).default;
    const flat = flatten(messages as Record<string, unknown>);
    return NextResponse.json(flat, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' },
    });
  } catch {
    return NextResponse.json({ error: 'messages load failed' }, { status: 500 });
  }
}
