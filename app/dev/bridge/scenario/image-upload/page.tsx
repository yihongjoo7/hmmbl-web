'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/common/ui/action/Button';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';
import { isCameraError } from '@/lib/bridge/bridge';
import type { CameraResultOrError } from '@/lib/bridge/bridge';

export default function Scenario2Page() {
  const [log, setLog]         = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const addLog = (msg: string) =>
    setLog(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p.slice(0, 29)]);

  useEffect(() => {
    const handler = (event: string) => (data: CameraResultOrError) => {
      if (isCameraError(data)) { addLog(`${event} error: ${data.error}`); return; }
      addLog(`${event}: ${data.mimeType} ${data.width}x${data.height}`);
      setPreview(`data:${data.mimeType};base64,${data.base64}`);
    };
    const u1 = bridgeEventBus.on<CameraResultOrError>('cameraResult',  handler('cameraResult'));
    const u2 = bridgeEventBus.on<CameraResultOrError>('galleryResult', handler('galleryResult'));
    return () => { u1(); u2(); };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-bold text-blue-500 uppercase">시나리오 2</span>
        <h1 className="text-xl font-bold mt-1">이미지 업로드 (카메라/갤러리)</h1>
      </div>
      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => { if (!window.bridge) { addLog('bridge 없음'); return; } addLog('requestCamera() 호출...'); window.bridge.requestCamera(); }}>requestCamera()</Button>
        <Button variant="outline" onClick={() => { if (!window.bridge) { addLog('bridge 없음'); return; } addLog('requestGallery() 호출...'); window.bridge.requestGallery(); }}>requestGallery()</Button>
      </div>
      {preview && <img src={preview} alt="preview" className="w-40 h-40 object-cover rounded border" />}
      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs h-48 overflow-y-auto">
        {log.length === 0 ? '로그가 여기에 표시됩니다.' : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
