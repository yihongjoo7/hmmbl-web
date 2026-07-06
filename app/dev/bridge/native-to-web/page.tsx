'use client';

/**
 * app/dev/bridge/native-to-web/page.tsx
 *
 * Native -> Web 이벤트 시뮬레이션 테스트 페이지
 * window.onBridgeEvent()를 직접 호출해 네이티브 이벤트를 흉내낸다.
 * 이벤트명은 BridgeEventName 명세(lib/env/bridge.ts)를 따른다.
 */

import { useState } from 'react';
import { Button } from '@/components/common/ui/action/Button';

/** 시뮬레이션할 이벤트 목록 */
const EVENT_LIST = [
  // 인증
  { name: 'appAuthCode',          label: 'appAuthCode',          payload: { code: 'mock-auth-code-123' } },
  // 언어
  { name: 'appLanguage',          label: 'appLanguage (ko)',      payload: { locale: 'ko' } },
  { name: 'appLanguageChanged',   label: 'appLanguageChanged (en)', payload: { locale: 'en' } },
  // 생체/PIN 인증
  { name: 'biometricResult',      label: 'biometricResult (ok)',  payload: { success: true } },
  { name: 'biometricResult',      label: 'biometricResult (fail)', payload: { success: false, error: 'USER_CANCELLED' } },
  { name: 'pinResult',            label: 'pinResult (ok)',        payload: { success: true } },
  // 미디어
  {
    name: 'cameraResult',
    label: 'cameraResult',
    payload: {
      base64: 'PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiPjwvc3ZnPg==',
      mimeType: 'image/png', width: 300, height: 300, fileSize: 500,
    },
  },
  {
    name: 'galleryResult',
    label: 'galleryResult',
    payload: {
      base64: 'PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiPjwvc3ZnPg==',
      mimeType: 'image/jpeg', width: 1920, height: 1080, fileSize: 204800,
    },
  },
  // GPS
  { name: 'gpsResult',            label: 'gpsResult (서울시청)',  payload: { latitude: 37.5665, longitude: 126.9780, accuracy: 15 } },
  // 걸음수 — B-02 패턴: 성공/실패 모두 stepCountResult 이벤트로 전달
  { name: 'stepCountResult',      label: 'stepCountResult (성공)', payload: { steps: 7420, date: new Date().toISOString().slice(0, 10) } },
  { name: 'stepCountResult',      label: 'stepCountResult (0보행)', payload: { steps: 0,    date: new Date().toISOString().slice(0, 10) } },
  { name: 'stepCountResult',      label: 'stepCountResult (권한거부)', payload: { error: 'HEALTH_PERMISSION_DENIED' } },
  { name: 'stepCountResult',      label: 'stepCountResult (미설치)', payload: { error: 'HEALTH_NOT_AVAILABLE' } },
  // 동영상
  {
    name: 'videoProgress',
    label: 'videoProgress',
    payload: { videoId: 'test-video-001', currentTime: 30, duration: 120, percentage: 0.25, timestamp: new Date().toISOString() },
  },
  {
    name: 'videoPlayerClosed',
    label: 'videoPlayerClosed',
    payload: { videoId: 'test-video-001', currentTime: 90, duration: 120, watchedPercentage: 0.75 },
  },
  // 디바이스
  {
    name: 'deviceInfo',
    label: 'deviceInfo',
    payload: {
      platform: 'android', osVersion: '14', appVersion: '1.2.0', buildNumber: '100',
      deviceModel: 'Mock Device', deviceId: 'mock-device-id-001',
      locale: 'ko', timezone: 'Asia/Seoul', networkType: 'wifi',
    },
  },
  { name: 'appVersion',           label: 'appVersion',           payload: { version: '1.2.0', buildNumber: '100' } },
  // 보안
  { name: 'appForceLogout',       label: 'appForceLogout',       payload: {} },
  { name: 'securityPolicyExpire', label: 'securityPolicyExpire', payload: { reason: 'policy_expired' } },
  // 시스템
  { name: 'appBackPressed',       label: 'appBackPressed',       payload: {} },
  { name: 'appForeground',        label: 'appForeground',        payload: {} },
];

export default function NativeToWebPage() {
  const [log, setLog] = useState<string[]>([]);
  const addLog = (msg: string) =>
    setLog(prev => ['[' + new Date().toLocaleTimeString() + '] ' + msg, ...prev.slice(0, 29)]);

  const fire = (name: string, payload: object) => {
    window.onBridgeEvent?.(name, payload);
    addLog(name + ': ' + JSON.stringify(payload));
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold">Native to Web 이벤트 시뮬레이션</h1>
      <p className="text-sm text-gray-500">
        버튼 클릭 시 window.onBridgeEvent()를 직접 호출해 네이티브 이벤트를 흉내냅니다.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {EVENT_LIST.map((e, i) => (
          <Button key={i} variant="outline" onClick={() => fire(e.name, e.payload)}>
            {e.label}
          </Button>
        ))}
      </div>

      {/* 로그 패널 */}
      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs h-56 overflow-y-auto">
        {log.length === 0
          ? '이벤트 발생 시 여기에 기록됩니다.'
          : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
