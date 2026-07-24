/**
 * lib/auth/dpop/proofProvider.ts
 *
 * DPoP proof 공급자 — 웹이 자체 ES256 키(IndexedDB)로 서명한다(lib/auth/dpop/proofGenerator.ts).
 *
 * apiClient/fileUploadClient는 이 함수 하나로 DPoP 헤더 값을 얻는다.
 */

import { createDPoPProof } from './proofGenerator';

/**
 * 절대 URL과 HTTP 메서드로 DPoP proof JWT를 생성한다.
 *
 * @param url    절대 URL (쿼리스트링 포함 가능 — htu 계산 시 내부에서 제외됨)
 * @param method HTTP 메서드
 */
export async function getDPoPHeader(url: string, method: string): Promise<string> {
  return createDPoPProof(url, method);
}
