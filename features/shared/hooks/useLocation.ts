'use client';
import { useState, useCallback } from 'react';
import { getLocation, BridgeTimeoutError } from '@/lib/bridge/bridgeActions';

export interface GeoLocation { latitude: number; longitude: number; accuracy: number; }

export function useLocation() {
  const [location,  setLocation ] = useState<GeoLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError    ] = useState<string | null>(null);

  const requestLocation = useCallback(async (): Promise<GeoLocation> => {
    setIsLoading(true); setError(null);
    try {
      const result = await getLocation();
      setLocation(result);
      return result;
    } catch (err) {
      const msg = err instanceof BridgeTimeoutError ? 'GPS 응답 시간이 초과되었습니다.'
        : err instanceof Error ? err.message : '위치를 가져오지 못했습니다.';
      setError(msg); throw err;
    } finally { setIsLoading(false); }
  }, []);

  return { location, isLoading, error, requestLocation };
}
