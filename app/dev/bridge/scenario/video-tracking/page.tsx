'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/common/ui/action/Button';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';
import type { VideoProgressEvent, VideoPlayerClosedEvent } from '@/lib/bridge/bridge';

const VIDEOS = [
  { id: 'video-001', url: 'https://example.com/video1.mp4', label: '영상 A (120s)' },
  { id: 'video-002', url: 'https://example.com/video2.mp4', label: '영상 B (240s)' },
];

export default function Scenario9Page() {
  const [log, setLog]                 = useState<string[]>([]);
  const [totalWatched, setTotalWatched] = useState(0);
  const [sessions, setSessions]       = useState<VideoPlayerClosedEvent[]>([]);
  const addLog = (msg: string) => setLog(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p.slice(0, 29)]);

  useEffect(() => {
    const u1 = bridgeEventBus.on<VideoProgressEvent>('videoProgress', (d) => addLog(`progress: ${d.currentTime}s (${Math.round(d.percentage * 100)}%)`));
    const u2 = bridgeEventBus.on<VideoPlayerClosedEvent>('videoPlayerClosed', (d) => {
      setSessions(prev => [d, ...prev]);
      setTotalWatched(prev => prev + d.currentTime);
      addLog(`closed: ${d.currentTime}s, 완료율 ${Math.round(d.watchedPercentage * 100)}%`);
    });
    return () => { u1(); u2(); };
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-bold text-blue-500 uppercase">시나리오 9</span>
        <h1 className="text-xl font-bold mt-1">동영상 시청 추적</h1>
      </div>
      <div className="flex gap-3 flex-wrap">
        {VIDEOS.map(v => <Button key={v.id} variant="outline" onClick={() => { if (!window.bridge) { addLog('bridge 없음'); return; } addLog(`openVideoPlayer: ${v.id}`); window.bridge?.openVideoPlayer?.(v.url, v.id, 0); }}>{v.label}</Button>)}
      </div>
      <div className="bg-gray-50 rounded p-3 text-sm">
        <p>총 시청 시간: <strong>{totalWatched}s</strong> | 세션 수: <strong>{sessions.length}회</strong></p>
      </div>
      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs h-48 overflow-y-auto">
        {log.length === 0 ? '로그가 여기에 표시됩니다.' : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
