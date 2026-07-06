'use client';
import { useState } from 'react';
import { Button } from '@/components/common/ui/action/Button';
import {
  DPOP_DB_NAME, DPOP_DB_STORE, DPOP_KEY_ID,
  getDPoPKeyPair, generateDPoPKeyPair,
} from '@/lib/auth/dpop/proofGenerator';

export default function KeyRotationPage() {
  const [log, setLog] = useState<string[]>([]);
  const addLog = (msg: string) =>
    setLog((p) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p.slice(0, 29)]);

  async function handleCheckKey() {
    try {
      addLog(`IndexedDB: ${DPOP_DB_NAME} / store: ${DPOP_DB_STORE} / id: ${DPOP_KEY_ID}`);
      const kp = await getDPoPKeyPair();
      addLog(kp ? `✅ 키 존재: publicKey.type=${kp.publicKey.type}` : '⚠️ 저장된 키 없음');
    } catch (e) { addLog(`❌ 오류: ${String(e)}`); }
  }

  async function handleRotateKey() {
    try {
      addLog('🔄 키 교체 시작...');
      const newKp = await generateDPoPKeyPair();
      addLog(`✅ 새 키 생성 완료: publicKey.type=${newKp.publicKey.type}`);
    } catch (e) { addLog(`❌ 오류: ${String(e)}`); }
  }

  async function handleDeleteKey() {
    try {
      addLog('🗑️ 키 삭제 시작...');
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        const req = indexedDB.open(DPOP_DB_NAME, 1);
        req.onupgradeneeded = () => req.result.createObjectStore(DPOP_DB_STORE);
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(DPOP_DB_STORE, 'readwrite');
        tx.objectStore(DPOP_DB_STORE).delete(DPOP_KEY_ID);
        tx.oncomplete = () => resolve();
        tx.onerror    = () => reject(tx.error);
      });
      addLog('✅ 키 삭제 완료');
    } catch (e) { addLog(`❌ 오류: ${String(e)}`); }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-bold text-blue-500 uppercase">시나리오 11</span>
        <h1 className="text-xl font-bold mt-1">DPoP 키 로테이션</h1>
        <p className="text-sm text-gray-500 mt-1">IndexedDB에 저장된 DPoP 키쌍을 조회·교체·삭제합니다.</p>
      </div>
      <div className="flex gap-3 flex-wrap">
        <Button variant="secondary" onClick={handleCheckKey}>키 확인</Button>
        <Button onClick={handleRotateKey}>키 교체</Button>
        <Button variant="danger" onClick={handleDeleteKey}>키 삭제</Button>
      </div>
      <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 min-h-[200px] max-h-[400px] overflow-y-auto flex flex-col gap-1">
        {log.length === 0
          ? <span className="text-gray-500">버튼을 눌러 테스트를 시작하세요...</span>
          : log.map((entry, i) => <div key={i}>{entry}</div>)}
      </div>
    </div>
  );
}
