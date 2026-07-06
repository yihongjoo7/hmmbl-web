import { logger } from '@/lib/logger';

export async function register() {
  // 런타임 초기화 — 필요 시 여기에 추가
}

export async function onRequestError(
  err: { digest?: string } & Error,
  request: { path: string; method: string },
  context: { routerKind: string; routePath: string }
) {
  logger.error({ err, request, context }, 'Request error captured');
}
