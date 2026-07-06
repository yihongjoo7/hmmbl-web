'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/common/ui/action/Button';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';

const PIN_ERROR: Record<string, string> = {
  USER_CANCELLED: '사용자 취소', PIN_NOT_REGISTERED: 'PIN 미등록', PIN_LOCKED: '잠금', TIMEOUT: '타임아웃',
};

export default function Scenario6Page() {
  const [log, setLog] = useState<string[]>([]);
  const addLog = (msg: string) => setLog(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p.slice(0, 29)]);

  useEffect(() => {
    return bridgeEventBus.on<{ success: boolean; error?: string }>('pinResult', (data) => {
      const code = data.error ?? 'UNKNOWN';
      addLog(data.success ? 'PIN 인증 성공' : `실패 - ${code} (${PIN_ERROR[code] ?? '알 수 없음'})`);
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-bold text-blue-500 uppercase">시나리오 6</span>
        <h1 className="text-xl font-bold mt-1">PIN 인증</h1>
      </div>
      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => { if (!window.bridge) { addLog('bridge 없음'); return; } addLog('requestPin() 호출...'); window.bridge.requestPin(); }}>requestPin() 호출</Button>
        <Button variant="outline" onClick={() => window.onBridgeEvent?.('pinResult', { success: true })}>성공</Button>
        <Button variant="outline" onClick={() => window.onBridgeEvent?.('pinResult', { success: false, error: 'USER_CANCELLED' })}>취소</Button>
        <Button variant="outline" onClick={() => window.onBridgeEvent?.('pinResult', { success: false, error: 'PIN_NOT_REGISTERED' })}>미등록</Button>
        <Button variant="outline" onClick={() => window.onBridgeEvent?.('pinResult', { success: false, error: 'PIN_LOCKED' })}>잠금</Button>
        <Button variant="outline" onClick={() => window.onBridgeEvent?.('pinResult', { success: false, error: 'TIMEOUT' })}>타임아웃</Button>
      </div>
      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs h-48 overflow-y-auto">
        {log.length === 0 ? '로그가 여기에 표시됩니다.' : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
