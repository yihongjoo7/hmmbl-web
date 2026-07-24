/**
 * 메모리 기반 토큰 캐시
 *
 * WebView 환경에서 Authorization Code → Access Token 교환 중
 * 단일 비행(in-flight) 요청을 관리합니다.
 */

let cachedToken: string | null = null;
let expiresAt: number | null = null;

const EXPIRY_BUFFER_MS = 30_000; // 만료 30초 전 갱신 트리거

export const tokenCache = {
  get(): string | null {
    if (!cachedToken || !expiresAt) return null;
    if (Date.now() >= expiresAt - EXPIRY_BUFFER_MS) {
      tokenCache.clear();
      return null;
    }
    return cachedToken;
  },

  set(token: string, expiresInSec: number): void {
    cachedToken = token;
    expiresAt = Date.now() + expiresInSec * 1000;
  },

  clear(): void {
    cachedToken = null;
    expiresAt = null;
  },

  isExpiringSoon(): boolean {
    if (!expiresAt) return true;
    return Date.now() >= expiresAt - EXPIRY_BUFFER_MS;
  },
};

export function clearTokenCache(): void {
  tokenCache.clear();
}
