import { NextRequest, NextResponse } from 'next/server';
import { translateText } from '@/lib/i18n/translate';
import { supportedLocales } from '@/lib/i18n/config';

// ─── Rate Limit (인메모리, 운영에서는 Upstash Redis 권장) ─────────────────
const rateLimitMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT   = 30;        // 분당 최대 호출 수
const WINDOW_MS    = 60_000;    // 1분
const MAX_TEXT_LEN = 5_000;     // 최대 입력 길이

// 만료된 항목을 매 호출 시 정리해 메모리 누수를 방지한다.
function cleanExpiredEntries(): void {
  const now = Date.now();
  for (const [key, record] of rateLimitMap) {
    if (now > record.reset) rateLimitMap.delete(key);
  }
}

// Rate Limit 키를 IP+익명세션 쿠키 조합으로 구성한다.
// IP만 사용하면 NAT 뒤 다수 사용자가 동일 제한을 공유하는 문제가 있다.
function getRateLimitKey(request: NextRequest): string {
  const ip      = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  const anonSid = request.cookies.get('_anon_sid')?.value ?? '';
  return anonSid ? `${ip}:${anonSid}` : ip;
}

function checkRateLimit(key: string): boolean {
  cleanExpiredEntries(); // 만료된 항목 정리
  const now    = Date.now();
  const record = rateLimitMap.get(key);
  if (!record || now > record.reset) {
    rateLimitMap.set(key, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

// ── 미로그인 사용자도 공개 페이지 번역 사용 가능 ──────────────────────────────
// DPoP/Bearer 토큰 검증은 미로그인 사용자를 차단하므로 적합하지 않다.
// Origin이 없는 클라이언트(curl 등)는 Referer를 폴백으로 확인한다.
// dev origin은 hmmbl-web dev 서버에 맞춘다.
// 기본은 HTTP(3000), 필요 시(`npm run dev:https`) HTTPS(3001)도 함께 허용한다.
// ─────────────────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL ?? '',
  ...(process.env.NEXT_PUBLIC_APP_ENV === 'dev'
    ? ['http://localhost:3000', 'https://localhost:3001']
    : []),
].filter(Boolean);

function isAllowedRequest(request: NextRequest): boolean {
  const origin  = request.headers.get('origin')  ?? '';
  const referer = request.headers.get('referer') ?? '';
  return (
    ALLOWED_ORIGINS.some((o) => origin  === o) ||
    ALLOWED_ORIGINS.some((o) => referer.startsWith(o))
  );
}

export async function POST(request: NextRequest) {
  // 1. Origin / Referer 체크 — 동일 출처 요청만 허용
  if (!isAllowedRequest(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // 2. Rate Limit (IP + 익명세션 키)
  const rateLimitKey = getRateLimitKey(request);
  if (!checkRateLimit(rateLimitKey)) {
    return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
  }

  // 3. 입력 파싱 및 검증
  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { text, targetLocale } = body as { text?: unknown; targetLocale?: unknown };

  if (typeof text !== 'string' || text.trim().length === 0) {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
  }
  if (text.length > MAX_TEXT_LEN) {
    return NextResponse.json(
      { error: `text must be ${MAX_TEXT_LEN} characters or fewer` },
      { status: 400 },
    );
  }
  if (!(supportedLocales as readonly string[]).includes(targetLocale as string)) {
    return NextResponse.json({ error: 'unsupported targetLocale' }, { status: 400 });
  }

  const translated = await translateText(text, targetLocale as string);
  return NextResponse.json({ translated });
}
