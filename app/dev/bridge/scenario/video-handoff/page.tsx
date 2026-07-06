'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/common/ui/action/Button';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';
import type { VideoProgressEvent, VideoPlayerClosedEvent } from '@/lib/bridge/bridge';

const MOCK_VIDEO = {
  url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  videoId: 'test-video-001',
};

export default function Scenario8Page() {
  const [log, setLog]           = useState<string[]>([]);
  const [progress, setProgress] = useState<VideoProgressEvent | null>(null);
  const [closed, setClosed]     = useState<VideoPlayerClosedEvent | null>(null);
  const addLog = (msg: string) => setLog(p => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p.slice(0, 29)]);

  useEffect(() => {
    const u1 = bridgeEventBus.on<VideoProgressEvent>('videoProgress', (d) => { setProgress(d); addLog(`videoProgress: ${d.currentTime}s / ${d.duration}s`); });
    const u2 = bridgeEventBus.on<VideoPlayerClosedEvent>('videoPlayerClosed', (d) => { setClosed(d); addLog(`videoPlayerClosed: ${d.currentTime}s (${Math.round(d.watchedPercentage * 100)}%)`); });
    return () => { u1(); u2(); };
  }, []);

  const handleOpen = (start = 0) => {
    if (!window.bridge) { addLog('bridge 없음'); return; }
    addLog(`openVideoPlayer() - start: ${start}s`); setClosed(null);
    window.bridge?.openVideoPlayer?.(MOCK_VIDEO.url, MOCK_VIDEO.videoId, start);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <span className="text-xs font-bold text-blue-500 uppercase">시나리오 8</span>
        <h1 className="text-xl font-bold mt-1">네이티브 동영상 플레이어</h1>
      </div>
      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => handleOpen(0)}>처음부터 재생</Button>
        <Button variant="outline" onClick={() => handleOpen(30)}>30초부터 재생</Button>
      </div>
      {progress && <div className="bg-blue-50 rounded p-3 text-sm">진행: {progress.currentTime}s / {progress.duration}s ({Math.round(progress.percentage * 100)}%)</div>}
      {closed && <div className="bg-green-50 rounded p-3 text-sm">종료: {closed.currentTime}s / {closed.duration}s (시청률 {Math.round(closed.watchedPercentage * 100)}%)</div>}
      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs h-48 overflow-y-auto">
        {log.length === 0 ? '로그가 여기에 표시됩니다.' : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
