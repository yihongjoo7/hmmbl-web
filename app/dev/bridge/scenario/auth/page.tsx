'use client';
import { useState } from 'react';
import { Button } from '@/components/common/ui/action/Button';
import { getOrCreateKeyPair, createDPoPProof } from '@/lib/auth/dpop/proofGenerator';

export default function ScenarioAuthPage() {
  const [log, setLog] = useState<string[]>([]);
  const addLog = (msg: string) => setLog(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p.slice(0, 29)]);

  const testKeyGen = async () => {
    addLog('DPoP 키쌍 생성/조회 시작...');
    const kp = await getOrCreateKeyPair();
    addLog(`✅ 키쌍 준비: ${kp ? '완료' : '실패'}`);
  };

  const testProof = async () => {
    addLog('DPoP Proof 생성 시작...');
    const proof = await createDPoPProof('/api/auth/token', 'POST');
    addLog(`✅ Proof 생성: ${proof ? proof.substring(0, 30) + '...' : '실패'}`);
  };

  const testAuthCode = () => {
    addLog('appAuthCode 이벤트 시뮬레이션...');
    window.onBridgeEvent?.('appAuthCode', { code: 'mock-code-' + Date.now() });
    addLog('✅ appAuthCode 이벤트 발생');
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-bold text-blue-500 uppercase">시나리오 1 · 4</span>
        <h1 className="text-xl font-bold mt-1">DPoP 인증 및 토큰 갱신</h1>
      </div>
      <div className="flex gap-3 flex-wrap">
        <Button onClick={testKeyGen}>키쌍 생성/조회</Button>
        <Button onClick={testProof} variant="outline">DPoP Proof 생성</Button>
        <Button onClick={testAuthCode} variant="secondary">appAuthCode 이벤트</Button>
      </div>
      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs h-64 overflow-y-auto">
        {log.length === 0 ? '로그가 여기에 표시됩니다.' : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
