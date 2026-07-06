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

/** dev 여부 판단: 앱 환경 또는 Node 환경 기준 */
const isDev =
  process.env.NEXT_PUBLIC_APP_ENV === 'dev' || process.env.NODE_ENV === 'development';

export const logger = pino({
  /** dev: debug 이상 출력 / 운영: warn 이상만 출력 */
  level: isDev ? 'debug' : 'warn',

  // dev 환경에서만 pino-pretty 적용 (운영에서는 JSON 출력으로 로그 수집 효율화)
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize:      true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
        ignore:        'pid,hostname',
      },
    },
  }),
});
