'use client';
import { useState } from 'react';
import { Button } from '@/components/common/ui/action/Button';
import { getDPoPKeyPair } from '@/lib/auth/dpop/proofGenerator';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';

export default function TokenStoragePage() {
  const [log, setLog] = useState<string[]>([]);
  const addLog = (msg: string) =>
    setLog(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p.slice(0, 29)]);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearAuth       = useAuthStore((s) => s.clearAuth);

  const checkDPoPKey = async () => {
    try {
      const kp = await getDPoPKeyPair();
      addLog(kp ? `DPoP 키 존재: publicKey.type=${kp.publicKey.type}` : 'DPoP 키 없음 (로그인 전 상태)');
    } catch (e) { addLog('DPoP 키 조회 오류: ' + String(e)); }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-bold text-blue-500 uppercase">시나리오 10</span>
        <h1 className="text-xl font-bold mt-1">DPoP 인증 상태 확인</h1>
        <p className="text-sm text-gray-500 mt-1">Keychain 토큰 저장 방식은 DPoP + 서버 세션으로 대체되었습니다.</p>
      </div>
      <div className="bg-gray-50 rounded p-3 text-sm">
        인증 상태: <strong className={isAuthenticated ? 'text-green-600' : 'text-red-500'}>
          {isAuthenticated ? '로그인됨' : '미로그인'}
        </strong>
      </div>
      <div className="flex gap-3 flex-wrap">
        <Button variant="secondary" onClick={checkDPoPKey}>DPoP 키 확인</Button>
        <Button variant="secondary" onClick={() => addLog(`isAuthenticated: ${String(isAuthenticated)}`)}>인증 상태 확인</Button>
        <Button variant="outline" onClick={() => { window.onBridgeEvent?.('appAuthCode', { code: 'mock-auth-' + Date.now() }); addLog('appAuthCode 이벤트 시뮬레이션'); }}>appAuthCode 시뮬레이션</Button>
        <Button variant="danger" onClick={() => { clearAuth(); addLog('clearAuth() 호출 - 인증 상태 초기화'); }}>인증 초기화</Button>
      </div>
      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs h-48 overflow-y-auto">
        {log.length === 0 ? '버튼을 눌러 테스트를 시작하세요.' : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
