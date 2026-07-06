'use client';
/**
 * [개발자] Native → Web 토큰 수신 훅
 *
 * 네이티브 로그인 완료(webview 모드) 또는 네이티브 세션 발급/갱신(native 모드,
 * bridge.requestNativeToken() 응답) 시 Bridge 이벤트로 TokenSet을 수신하고
 * useAuthStore에 저장합니다. 두 모드 모두 동일하게 동작합니다(2-Lite).
 */

import { useEffect } from 'react';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';
import { useAuthStore } from './useAuthStore';
import type { User } from '@/features/auth/types';

interface TokenPayload {
  access_token: string;
  user: User;
}

export function useTokenReceiver() {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    return bridgeEventBus.on<TokenPayload>('tokenReceived', ({ access_token, user }) => {
      setAuth(user, access_token);
    });
  }, [setAuth]);
}
