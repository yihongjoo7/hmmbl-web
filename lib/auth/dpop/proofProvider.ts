/**
 * lib/auth/dpop/proofProvider.ts
 *
<<<<<<< HEAD
 * DPoP proof 공급자 — 모드별로 proof 서명 주체만 갈아끼운다 (2-Lite, docs/30 §4.2)
=======
 * DPoP proof 공급자 — 모드별로 proof 서명 주체만 갈아끼운다 (2-Lite, docs/21 §4.2)
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
 *
 * - webview 모드: 웹이 자체 ES256 키(IndexedDB)로 서명 (lib/auth/dpop/proofGenerator.ts)
 * - native 모드:  네이티브 KeyStore가 서명 → window.bridge.createDpopProof(method, url)
 *                 (@JavascriptInterface 동기 String 반환이라 Promise로 감싼다)
 *
 * apiClient/fileUploadClient는 이 함수 하나로 모드를 신경 쓰지 않고 DPoP 헤더 값을 얻는다.
 */

import { createDPoPProof } from './proofGenerator';
import { resolveDpopMode } from './mode';

/**
 * 절대 URL과 HTTP 메서드로 DPoP proof JWT를 생성한다.
 *
 * @param url    절대 URL (쿼리스트링 포함 가능 — htu 계산 시 내부에서 제외됨)
 * @param method HTTP 메서드
 * @throws Error  native 모드에서 네이티브가 proof 생성에 실패(키 없음 등)한 경우
 */
export async function getDPoPHeader(url: string, method: string): Promise<string> {
  if (resolveDpopMode() === 'native') {
    const proof = window.bridge?.createDpopProof?.(method, url);
    if (!proof) throw new Error('[DPoP] 네이티브 proof 생성 실패(createDpopProof)');
    return proof;
  }
  return createDPoPProof(url, method);
}
