'use client';
/**
 * [개발자] 패턴 인증 흐름 훅
 * PIN 인증과 동일한 Bridge 패턴, 이벤트명만 다름
 */

import { useState, useCallback } from 'react';

interface UsePatternAuthOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function usePatternAuth({ onSuccess, onError }: UsePatternAuthOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [pattern, setPattern] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addPoint = useCallback((point: number) => {
    setPattern(prev => [...prev, point]);
  }, []);

  const submit = useCallback(async () => {
    if (pattern.length < 4) {
      const msg = '패턴은 4개 이상의 점을 연결해야 합니다.';
      setError(msg); onError?.(msg); return;
    }
    setIsLoading(true);
    try {
      // TODO: 패턴 검증 API 호출
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '패턴 인증 실패';
      setError(msg); onError?.(msg);
    } finally { setIsLoading(false); }
  }, [pattern, onSuccess, onError]);

  const reset = useCallback(() => { setPattern([]); setError(null); }, []);

  return { pattern, addPoint, submit, reset, isLoading, error };
}
