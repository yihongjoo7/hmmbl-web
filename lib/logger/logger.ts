/**
 * lib/logger/logger.ts
 *
 * 앱 전역 로거 (pino 기반)
 *
 * 원본: nextjs-new/lib/logger.ts 그대로 이전 (경로만 변경)
 *
 * - dev 환경: debug 레벨, pino-pretty로 컬러 출력
 * - 그 외 환경: warn 레벨, JSON 출력 (로그 집계 시스템으로 전송 용이)
 *
 * 사용법:
 *   import { logger } from '@/lib/logger/logger';
 *   logger.info({ userId }, '로그인 성공');
 *   logger.error({ err }, 'API 요청 실패');
 */

import pino from 'pino';
import pretty from 'pino-pretty';

/** dev 여부 판단: 앱 환경 또는 Node 환경 기준 */
const isDev =
  process.env.NEXT_PUBLIC_APP_ENV === 'dev' || process.env.NODE_ENV === 'development';

// 주의: pino의 `transport: { target: 'pino-pretty' }` 옵션은 내부적으로
// worker_threads를 띄워 대상 모듈을 "동적으로" require 하는 방식이라
// Turbopack이 정적으로 추적하지 못해 instrumentation.ts 번들링이
// MODULE_UNPARSABLE 로 실패하는 원인이 된다.
// (관련: vercel/next.js #86099, #87342)
// pino-pretty 스트림을 직접 생성해 동기적으로 넘겨주면 worker_threads를
// 타지 않아 Turbopack에서도 안전하게 동작한다.
export const logger = pino(
  { level: isDev ? 'debug' : 'warn' },
  isDev
    ? pretty({
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
      })
    : undefined
);
