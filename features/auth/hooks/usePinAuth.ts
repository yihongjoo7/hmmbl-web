'use client';
/**
 * [개발자] PIN 인증 흐름 훅
 */

import { useState, useCallback } from 'react';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';
import { BridgeErrorCode } from '@/lib/bridge/bridgeErrorCodes';

interface UsePinAuthOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function usePinAuth({ onSuccess, onError }: UsePinAuthOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticate = useCallback(async () => {
    if (!window.bridge) {
      const msg = 'PIN 인증은 앱에서만 사용할 수 있습니다.';
      setError(msg); onError?.(msg); return;
    }
    setIsLoading(true); setError(null);
    try {
      await new Promise<void>((resolve, reject) => {
        const unsub = bridgeEventBus.once<{ success: boolean; error?: string }>('pinResult', (data) => {
          if (data.success) resolve();
          else reject(new Error(data.error ?? BridgeErrorCode.UNKNOWN));
        });
        window.bridge!.requestPin();
        setTimeout(() => { unsub(); reject(new Error(BridgeErrorCode.TIMEOUT)); }, 60_000);
      });
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '알 수 없는 오류';
      setError(msg); onError?.(msg);
    } finally { setIsLoading(false); }
  }, [onSuccess, onError]);

  return { authenticate, isLoading, error, clearError: useCallback(() => setError(null), []) };
}
