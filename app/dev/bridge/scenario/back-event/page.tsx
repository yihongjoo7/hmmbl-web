'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/common/ui/action/Button';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';

export default function ScenarioBackEventPage() {
  const [log, setLog] = useState<string[]>([]);
  const addLog = (msg: string) => setLog(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p.slice(0, 29)]);

  useEffect(() => {
    return bridgeEventBus.on('appBackPressed', () => {
      addLog('appBackPressed 수신 -> history.back() 실행');
      history.back();
    });
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-bold text-blue-500 uppercase">시나리오 3</span>
        <h1 className="text-xl font-bold mt-1">Android 뒤로가기 이벤트</h1>
      </div>
      <Button onClick={() => window.onBridgeEvent?.('appBackPressed', {})}>appBackPressed 시뮬레이션</Button>
      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs h-48 overflow-y-auto">
        {log.length === 0 ? '뒤로가기 이벤트 발생 시 기록됩니다.' : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
