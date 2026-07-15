/**
 * lib/auth/dpop/mode.ts
 *
<<<<<<< HEAD
 * DPoP 처리 모드 결정 (2-Lite, docs/30-dpop-mode-switch-proposal.md §4)
=======
 * DPoP 처리 모드 결정 (2-Lite, docs/21-dpop-mode-switch-proposal.md §4)
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
 *
 * - webview (기본): 웹이 DPoP 키·proof·토큰을 자체 처리 (현행)
 * - native: DPoP proof 서명만 네이티브에 위임(createDpopProof), 토큰은 네이티브가
 *           발급/갱신해 tokenReceived로 푸시. fetch는 두 모드 모두 웹이 직접 수행한다.
 *
 * NEXT_PUBLIC_DPOP_MODE 미설정 시 webview. native 라도 브릿지·createDpopProof 능력이
 * 없으면(일반 브라우저/구버전 네이티브) webview 로 폴백한다 — 능력 체크가 실가드.
 */

import { isWebView } from '@/lib/bridge/bridgeClient';

export type DpopMode = 'webview' | 'native';

export function resolveDpopMode(): DpopMode {
  const want = process.env.NEXT_PUBLIC_DPOP_MODE === 'native' ? 'native' : 'webview';
  if (want !== 'native') return 'webview';
  // 능력 체크: 브릿지·createDpopProof 미보유 시 native 불가
  if (!isWebView() || typeof window.bridge?.createDpopProof !== 'function') return 'webview';
  return 'native';
}
