'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/common/ui/action/Button';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';

export default function Scenario5Page() {
  const [log, setLog] = useState<string[]>([]);
  const addLog = (msg: string) =>
    setLog(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p.slice(0, 29)]);

  useEffect(() => {
    return bridgeEventBus.on<{ success: boolean; error?: string }>('biometricResult', (data) => {
      addLog(data.success ? 'biometricResult: 인증 성공' : `biometricResult: 인증 실패 - ${data.error ?? 'UNKNOWN'}`);
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-bold text-blue-500 uppercase">시나리오 5</span>
        <h1 className="text-xl font-bold mt-1">생체인증 (지문/Face ID)</h1>
      </div>
      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => { if (!window.bridge) { addLog('bridge 없음'); return; } addLog('requestBiometric() 호출...'); window.bridge.requestBiometric(); }}>requestBiometric() 호출</Button>
        <Button variant="outline" onClick={() => { window.onBridgeEvent?.('biometricResult', { success: true }); addLog('시뮬레이션: success'); }}>성공 시뮬레이션</Button>
        <Button variant="outline" onClick={() => { window.onBridgeEvent?.('biometricResult', { success: false, error: 'USER_CANCELLED' }); addLog('시뮬레이션: USER_CANCELLED'); }}>실패 시뮬레이션</Button>
      </div>
      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs h-48 overflow-y-auto">
        {log.length === 0 ? '로그가 여기에 표시됩니다.' : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
