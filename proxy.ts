import { NextRequest, NextResponse } from 'next/server';

function generateNonce(): string {
  return Buffer.from(crypto.randomUUID()).toString('base64');
}

function applySecurityHeaders(response: NextResponse, nonce: string) {
  const isDev  = process.env.NODE_ENV === 'development';
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

  response.headers.set('X-Frame-Options',        'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy',        'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy',     'camera=(), microphone=(), geolocation=()');

  // connect-src: API 서버 URL을 명시적으로 허용한다.
  // NEXT_PUBLIC_API_BASE_URL 미설정 시 'self'만 허용.
  const connectSrc = ["'self'", ...(apiUrl ? [apiUrl] : [])].join(' ');

  // img-src:  카메라/갤러리 결과(data:), 미리보기 ObjectURL(blob:), 업로드/백엔드 이미지(https:).
  //   ※ default-src 'self' 만 두면 data:/blob: 이미지가 차단되어 카메라 결과가 안 보인다.
  // media-src: 인라인 동영상(https 호스트) + blob.
  // frame-src: GPS 결과 지도(OpenStreetMap embed).
  const imgSrc   = "'self' data: blob: https:";
  const mediaSrc = "'self' blob: https:";
  const frameSrc = "'self' https://www.openstreetmap.org";

  response.headers.set(
    'Content-Security-Policy',
    isDev
      ? `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src ${imgSrc}; media-src ${mediaSrc}; frame-src ${frameSrc}; connect-src 'self' ws: wss:${apiUrl ? ` ${apiUrl}` : ''};`
      : `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'nonce-${nonce}'; img-src ${imgSrc}; media-src ${mediaSrc}; frame-src ${frameSrc}; connect-src ${connectSrc}; object-src 'none';`
  );
  if (!isDev) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  response.headers.set('x-nonce', nonce);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // dev(=NODE_ENV 'development')에서는 게이트를 적용하지 않는다(전 페이지·/dev 개방).
  // staging·prod 빌드는 NODE_ENV 'production' → 게이트 ON.
  const isProd = process.env.NODE_ENV === 'production';

  // /dev/* 프로덕션 접근 차단
  if (pathname.startsWith('/dev') && isProd) {
    return NextResponse.rewrite(new URL('/404', request.url));
  }

  const nonce = generateNonce();

  // Server Component(layout.tsx)가 headers()로 nonce를 읽을 수 있도록
  // request header에도 전달한다.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  applySecurityHeaders(response, nonce);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
