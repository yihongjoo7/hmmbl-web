'use client';
import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { initAuthFromCode } from '@/lib/auth/authService';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';
import { requestNativeToken } from '@/lib/bridge/bridgeActions';
import { resolveDpopMode } from '@/lib/auth/dpop/mode';

/**
 * Protected 레이아웃 — 네이티브 웹뷰 인증 부트스트랩
 *
 * 보호 라우트(파일 업로드 등)는 백엔드 인증(`Depends(get_current_user)`)이 필요하다.
 * 네이티브 로그인과 웹뷰 세션은 독립적이므로, 웹뷰가 자체 토큰을 가져야 한다.
 *
 * 동작: 네이티브 웹뷰에서 미인증이면 모드별로 토큰을 발급받는다(2-Lite).
 *   webview: window.bridge.requestAuthCode()
 *     → onBridgeEvent('appAuthCode', { code })  (네이티브: POST /auth/webview-code)
 *     → initAuthFromCode(code)  (웹: POST /auth/token, DPoP)
 *     → setAuth(user, accessToken)  → fileUploadClient/apiClient가 토큰 첨부
 *   native: window.bridge.requestNativeToken()
 *     → onBridgeEvent('tokenReceived', { access_token, user })
 *     → useTokenReceiver(전역 마운트)가 setAuth(user, accessToken) 호출
 *
 * 주의:
 *   - 브라우저(window.bridge 없음)에서는 동작하지 않는다(dev 브라우저는 /dev/auth 사용).
 *   - dev/prod 모두 적용한다(이전엔 prod에서 빈 페이지 /auth/simple-auth로 리다이렉트만 해 실제 인증이 안 됐음).
 */
export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setAuth         = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    if (isAuthenticated) return;
    // 네이티브 브릿지가 없으면(브라우저) 스킵
    if (typeof window === 'undefined' || typeof window.bridge === 'undefined') return;

    if (resolveDpopMode() === 'native') {
      // [2-Lite] 네이티브 세션 토큰 요청. 수신·store 반영은 useTokenReceiver(전역 마운트)가 담당한다.
      requestNativeToken().catch((e) => console.warn('[ProtectedLayout] native 토큰 요청 실패', e));
      return;
    }

    const unsub = bridgeEventBus.on<{ code: string }>('appAuthCode', async (data) => {
      const code = typeof data === 'object' && data !== null
        ? (data as Record<string, unknown>).code
        : null;
      if (typeof code !== 'string') return;
      try {
        await initAuthFromCode(code, setAuth);
      } catch (e) {
        console.warn('[ProtectedLayout] webview SSO 실패', e);
      }
    });
    window.bridge?.requestAuthCode();
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return <>{children}</>;
}
