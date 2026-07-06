'use client';
import { useState, useCallback } from 'react';
import { requestStepCount, BridgeTimeoutError } from '@/lib/bridge/bridgeActions';

const ERROR_MESSAGES: Record<string, string> = {
  HEALTH_PERMISSION_DENIED: '건강 데이터 접근 권한이 없습니다.',
  HEALTH_NOT_AVAILABLE:     '이 기기에서 Health Connect를 사용할 수 없습니다.',
  HEALTH_DATA_UNAVAILABLE:  '해당 날짜의 걸음수 데이터가 없습니다.',
  TIMEOUT:                  '걸음수 응답 시간이 초과되었습니다.',
};

export function useStepCount() {
  const [steps,     setSteps    ] = useState<number | null>(null);
  const [date,      setDate     ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError    ] = useState<string | null>(null);

  const fetchStepCount = useCallback(async (targetDate?: string) => {
    setIsLoading(true); setError(null);
    try {
      const result = await requestStepCount(targetDate);
      setSteps(result.steps); setDate(result.date);
      return result;
    } catch (err) {
      const msg = err instanceof BridgeTimeoutError ? '걸음수 응답 시간이 초과되었습니다.'
        : err instanceof Error ? (ERROR_MESSAGES[err.message] ?? err.message)
        : '걸음수를 가져오지 못했습니다.';
      setError(msg); throw err;
    } finally { setIsLoading(false); }
  }, []);

  return { steps, date, isLoading, error, fetchStepCount };
}
