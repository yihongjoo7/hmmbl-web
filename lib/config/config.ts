/**
 * lib/config/config.ts
 *
 * 앱 전역 설정 — 환경별 단일 진입점
 *
 * 원본: nextjs-new/lib/config/index.ts
 * 이전 변경:
 *   - Azure Translator / Google Translate 관련 설정 제거 (모바일 불필요)
 *   - 모바일 필요 설정(appEnv, apiBaseUrl)만 유지
 *   - (2026-06 다국어) Azure Translator 설정 재추가 — 동적 번역(ja/th/vi/ms)용
 *
 * API URL 결정 우선순위:
 *   1. NEXT_PUBLIC_API_BASE_URL 환경변수 설정 시 → 그 값 사용 (모든 환경)
 *   2. dev + 브라우저(CSR) → protocol//hostname:8000
 *   3. dev + 서버(SSR) / staging / prod → 환경별 fallback
 *
 * staging/prod 빌드 시 NEXT_PUBLIC_API_BASE_URL 미설정이면 즉시 에러 발생.
 */

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV ?? 'dev';

// staging/prod 빌드에서 API URL 미설정이면 즉시 에러로 알림
// placeholder URL이 그대로 배포되는 것을 방지한다
if (
  (APP_ENV === 'staging' || APP_ENV === 'prod') &&
  !process.env.NEXT_PUBLIC_API_BASE_URL
) {
  throw new Error(
    `[config] NEXT_PUBLIC_API_BASE_URL은 ${APP_ENV} 환경에서 반드시 설정해야 합니다. ` +
    '실제 API URL을 .env 파일에 설정하세요.',
  );
}

/** 환경별 API URL fallback (NEXT_PUBLIC_API_BASE_URL 미설정 시 사용) */
const FALLBACK: Record<string, string> = {
  dev:     'https://localhost:8000',
  staging: 'https://staging-api.hpoint.example.com',
  prod:    'https://api.hpoint.example.com',
};

/**
 * API base URL을 반환한다.
 * 환경변수 > dev CSR 자동 감지 > fallback 순으로 결정한다.
 */
function getApiBaseUrl(): string {
  // 명시적 환경변수가 있으면 최우선
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  // dev + 브라우저: 현재 호스트의 8000 포트로 자동 설정
  if (APP_ENV === 'dev' && typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:8000`;
  }
  return FALLBACK[APP_ENV] ?? FALLBACK.dev;
}

/** proxy.ts의 CSP connect-src에서 참조 — 중복 하드코딩 제거용 */
export { FALLBACK as apiUrlFallback };

/**
 * 앱 전역 설정 객체.
 * apiBaseUrl은 getter로 선언해 런타임에 URL을 동적 결정한다.
 */
export const config = {
  /** API 서버 base URL (런타임 결정) */
  get apiBaseUrl() { return getApiBaseUrl(); },

  /** 현재 앱 환경: 'dev' | 'staging' | 'prod' */
  appEnv: APP_ENV,

  /** Azure Translator 키 (서버 전용 — 동적 번역 ja/th/vi/ms). 미설정 시 원문 반환 */
  azureTranslatorKey: process.env.AZURE_TRANSLATOR_KEY ?? '',

  /** Azure Translator 리전 (기본 koreacentral) */
  azureTranslatorRegion: process.env.AZURE_TRANSLATOR_REGION ?? 'koreacentral',
};
