'use client';
import { useState, useCallback } from 'react';

export interface GeoLocation { latitude: number; longitude: number; accuracy: number; }

const GPS_TIMEOUT_MS = 45_000;

function getBrowserLocation(): Promise<GeoLocation> {
  return new Promise<GeoLocation>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('이 브라우저는 위치 서비스를 지원하지 않습니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude:  pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy:  pos.coords.accuracy,
        }),
      (err) => {
        // PositionError.code → 사람이 읽을 수 있는 메시지로 변환
        const messages: Record<number, string> = {
          1: '위치 정보 접근이 거부되었습니다.',
          2: '위치 정보를 가져올 수 없습니다.',
          3: '위치 요청이 시간 초과되었습니다.',
        };
        reject(new Error(messages[err.code] ?? '위치 오류가 발생했습니다.'));
      },
      { timeout: GPS_TIMEOUT_MS, maximumAge: 60_000, enableHighAccuracy: true },
    );
  });
}

export function useLocation() {
  const [location,  setLocation ] = useState<GeoLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError    ] = useState<string | null>(null);

  const requestLocation = useCallback(async (): Promise<GeoLocation> => {
    setIsLoading(true); setError(null);
    try {
      const result = await getBrowserLocation();
      setLocation(result);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : '위치를 가져오지 못했습니다.';
      setError(msg); throw err;
    } finally { setIsLoading(false); }
  }, []);

  return { location, isLoading, error, requestLocation };
}
