'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/common/ui/action/Button';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';
import type { GPSResult } from '@/lib/bridge/bridge';

type GpsResultPayload = GPSResult | { error: string };

const GPS_ERROR_MSG: Record<string, string> = {
  PERMISSION_DENIED: '위치 권한이 거부되었습니다.',
  GPS_DISABLED:      'GPS가 비활성화되어 있습니다.',
  TIMEOUT:           '위치 수신 시간이 초과되었습니다.',
};

export default function Scenario7Page() {
  const [log, setLog]           = useState<string[]>([]);
  const [location, setLocation] = useState<GPSResult | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const addLog = (msg: string) =>
    setLog(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p.slice(0, 29)]);

  useEffect(() => {
    return bridgeEventBus.on<GpsResultPayload>('gpsResult', (data) => {
      if ('error' in data) {
        setGpsError(GPS_ERROR_MSG[data.error] ?? `오류: ${data.error}`);
        setLocation(null);
        addLog('gpsResult 오류: ' + data.error);
        return;
      }
      setLocation(data); setGpsError(null);
      addLog(`gpsResult: lat=${data.latitude}, lng=${data.longitude}, acc=${data.accuracy}m`);
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-bold text-blue-500 uppercase">시나리오 7</span>
        <h1 className="text-xl font-bold mt-1">GPS 위치 조회</h1>
      </div>
      <Button onClick={() => { if (!window.bridge) { addLog('bridge 없음'); return; } setGpsError(null); setLocation(null); addLog('requestGPS() 호출...'); window.bridge.requestGPS(); }}>requestGPS() 호출</Button>
      {gpsError && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{gpsError}</div>}
      {location && (
        <div className="bg-blue-50 rounded-lg p-4 text-sm flex flex-col gap-1">
          <p>위도: {location.latitude}</p>
          <p>경도: {location.longitude}</p>
          <p>정확도: {location.accuracy}m</p>
          <a href={`https://maps.google.com/?q=${location.latitude},${location.longitude}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Google Maps에서 보기</a>
        </div>
      )}
      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs h-40 overflow-y-auto">
        {log.length === 0 ? '로그가 여기에 표시됩니다.' : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
