'use client';
/**
 * [개발자] 본인인증 훅 (휴대폰·아이핀·이메일)
 */

import { useState, useCallback } from 'react';

type VerifyMethod = 'phone' | 'ipin' | 'email';

interface UseIdentityVerificationReturn {
  method: VerifyMethod;
  setMethod: (m: VerifyMethod) => void;
  isLoading: boolean;
  isVerified: boolean;
  error: string | null;
  requestVerification: () => Promise<void>;
  confirmCode: (code: string) => Promise<void>;
}

export function useIdentityVerification(): UseIdentityVerificationReturn {
  const [method, setMethod] = useState<VerifyMethod>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestVerification = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      // TODO: 본인인증 요청 API
    } catch (err) {
      setError(err instanceof Error ? err.message : '인증 요청 실패');
    } finally { setIsLoading(false); }
  }, [method]);

  const confirmCode = useCallback(async (code: string) => {
    setIsLoading(true); setError(null);
    try {
      // TODO: 인증 코드 확인 API
      void code;
      setIsVerified(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '인증 실패');
    } finally { setIsLoading(false); }
  }, []);

  return { method, setMethod, isLoading, isVerified, error, requestVerification, confirmCode };
}
