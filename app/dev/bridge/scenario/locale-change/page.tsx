'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/common/ui/action/Button';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';

const LOCALES = [
  { code: 'ko', label: 'Korean (ko)' },
  { code: 'en', label: 'English (en)' },
  { code: 'ja', label: 'Japanese (ja)' },
  { code: 'zh', label: 'Chinese (zh)' },
];

export default function Scenario12Page() {
  const [log, setLog] = useState<string[]>([]);
  const addLog = (msg: string) => setLog(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p.slice(0, 29)]);

  useEffect(() => {
    const u1 = bridgeEventBus.on<{ locale: string }>('appLanguage', (d) => addLog(`appLanguage 수신: ${d.locale}`));
    const u2 = bridgeEventBus.on<{ locale: string }>('appLanguageChanged', (d) => addLog(`appLanguageChanged 수신: ${d.locale}`));
    return () => { u1(); u2(); };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-bold text-blue-500 uppercase">시나리오 12</span>
        <h1 className="text-xl font-bold mt-1">언어 변경</h1>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">appLanguage (초기 설정)</p>
        <div className="flex gap-2 flex-wrap">
          {LOCALES.map(l => <Button key={l.code} variant="outline" onClick={() => window.onBridgeEvent?.('appLanguage', { locale: l.code })}>{l.label}</Button>)}
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">appLanguageChanged (변경)</p>
        <div className="flex gap-2 flex-wrap">
          {LOCALES.map(l => <Button key={l.code} variant="secondary" onClick={() => window.onBridgeEvent?.('appLanguageChanged', { locale: l.code })}>{l.label}</Button>)}
        </div>
      </div>
      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs h-40 overflow-y-auto">
        {log.length === 0 ? '로그가 여기에 표시됩니다.' : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
