'use client';
import { useState, useCallback } from 'react';
import { requestBiometric } from '@/lib/bridge/bridgeActions';
import { BridgeErrorCode } from '@/lib/bridge/bridgeErrorCodes';
import { BridgeTimeoutError } from '@/lib/bridge/bridgeEventBus';

interface UseBiometricAuthOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface UseBiometricAuthReturn {
  authenticate: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  clearError: () => void;
}

export function useBiometricAuth({
  onSuccess,
  onError,
}: UseBiometricAuthOptions = {}): UseBiometricAuthReturn {
  const [isLoading,       setIsLoading      ] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error,           setError          ] = useState<string | null>(null);

  const authenticate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await requestBiometric();
      setIsAuthenticated(true);
      onSuccess?.();
    } catch (err) {
      const msg = buildCatchMessage(err);
      setError(msg);
      onError?.(msg);
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  return {
    authenticate,
    isLoading,
    isAuthenticated,
    error,
    clearError: useCallback(() => setError(null), []),
  };
}

function buildErrorMessage(code?: string): string {
  const messages: Record<string, string> = {
    [BridgeErrorCode.USER_CANCELLED]:   '생체인증이 취소되었습니다.',
    [BridgeErrorCode.PERMISSION_DENIED]:'생체인증 권한이 거부되었습니다.',
    [BridgeErrorCode.BIOMETRIC_LOCKED]: '생체인증이 잠겼습니다. 기기 잠금 해제 후 다시 시도해 주세요.',
    [BridgeErrorCode.NO_BIOMETRIC]:     '등록된 생체정보가 없습니다.',
    [BridgeErrorCode.NOT_SUPPORTED]:    '이 기기는 생체인증을 지원하지 않습니다.',
  };
  return messages[code ?? ''] ?? '생체인증에 실패했습니다. 다시 시도해 주세요.';
}

function buildCatchMessage(err: unknown): string {
  if (err instanceof BridgeTimeoutError) return '생체인증 요청이 시간 초과되었습니다.';
  if (err instanceof Error) return buildErrorMessage(err.message);
  return '알 수 없는 오류가 발생했습니다.';
}
