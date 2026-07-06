'use client';

/**
 * app/dev/bridge/web-to-native/page.tsx
 *
 * Web -> Native 브릿지 메서드 호출 테스트 페이지
 * window.bridge.method()를 직접 호출한다.
 * 메서드명은 BridgeInterface 명세(lib/env/bridge.ts)를 따른다.
 */

import { useState } from 'react';
import { Button } from '@/components/common/ui/action/Button';

/** 응답 이벤트가 있는 메서드 (비동기) */
const ASYNC_METHODS: Array<{ label: string; call: () => void; responseEvent: string }> = [
  { label: 'requestAuthCode',  call: () => window.bridge?.requestAuthCode(),  responseEvent: 'appAuthCode' },
  { label: 'requestBiometric', call: () => window.bridge?.requestBiometric(), responseEvent: 'biometricResult' },
  { label: 'requestPin',       call: () => window.bridge?.requestPin(),        responseEvent: 'pinResult' },
  { label: 'requestCamera',    call: () => window.bridge?.requestCamera(),     responseEvent: 'cameraResult' },
  { label: 'requestGallery',   call: () => window.bridge?.requestGallery(),    responseEvent: 'galleryResult' },
  { label: 'requestGPS',       call: () => window.bridge?.requestGPS(),        responseEvent: 'gpsResult' },
  { label: 'getDeviceInfo',    call: () => window.bridge?.getDeviceInfo(),     responseEvent: 'deviceInfo' },
  { label: 'getAppVersion',    call: () => window.bridge?.getAppVersion(),     responseEvent: 'appVersion' },
  {
    label: 'openVideoPlayer',
    call: () => window.bridge?.openVideoPlayer?.('https://example.com/test.mp4', 'test-video-001', 0),
    responseEvent: 'videoProgress / videoPlayerClosed',
  },
];

/** 응답 없는 단방향 메서드 */
const VOID_METHODS: Array<{ label: string; call: () => void }> = [
  { label: 'logout',                    call: () => window.bridge?.logout() },
  { label: 'goBack',                    call: () => window.bridge?.goBack() },
  { label: 'closeWebView',              call: () => window.bridge?.closeWebView() },
  { label: 'hapticFeedback (light)',    call: () => window.bridge?.hapticFeedback?.('light') },
  { label: 'hapticFeedback (medium)',   call: () => window.bridge?.hapticFeedback?.('medium') },
  { label: 'hapticFeedback (heavy)',    call: () => window.bridge?.hapticFeedback?.('heavy') },
  { label: 'setStatusBarColor (#3b82f6)', call: () => window.bridge?.setStatusBarColor('#3b82f6', false) },
  { label: 'showNativeLoading (on)',    call: () => window.bridge?.showNativeLoading(true) },
  { label: 'showNativeLoading (off)',   call: () => window.bridge?.showNativeLoading(false) },
  { label: 'showNativeToast',           call: () => window.bridge?.showNativeToast('브릿지 토스트 테스트') },
  { label: 'copyToClipboard',           call: () => window.bridge?.copyToClipboard?.('bridge-clipboard-test') },
  { label: 'openExternalBrowser',       call: () => window.bridge?.openExternalBrowser('https://example.com') },
];

export default function WebToNativePage() {
  const [log, setLog] = useState<string[]>([]);
  const addLog = (msg: string) =>
    setLog(prev => ['[' + new Date().toLocaleTimeString() + '] ' + msg, ...prev.slice(0, 29)]);

  const callAsync = (label: string, call: () => void, responseEvent: string) => {
    if (!window.bridge) {
      addLog('❌ window.bridge 없음 (Mock이 주입되지 않았습니다)');
      return;
    }
    addLog('-> ' + label + ' 호출 (응답: ' + responseEvent + ')');
    call();
  };

  const callVoid = (label: string, call: () => void) => {
    if (!window.bridge) {
      addLog('❌ window.bridge 없음 (Mock이 주입되지 않았습니다)');
      return;
    }
    call();
    addLog('-> ' + label + ' 호출 완료 (단방향)');
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold">Web to Native 메서드 테스트</h1>

      {/* 비동기 메서드 (응답 이벤트 있음) */}
      <div>
        <h2 className="text-sm font-semibold text-gray-600 mb-2">
          비동기 — 응답 이벤트 수신 (Native to Web 탭에서 확인)
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {ASYNC_METHODS.map((m, i) => (
            <Button key={i} variant="outline" onClick={() => callAsync(m.label, m.call, m.responseEvent)}>
              {m.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 단방향 메서드 (응답 없음) */}
      <div>
        <h2 className="text-sm font-semibold text-gray-600 mb-2">
          단방향 — 응답 없음 (콘솔 로그 확인)
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {VOID_METHODS.map((m, i) => (
            <Button key={i} variant="secondary" onClick={() => callVoid(m.label, m.call)}>
              {m.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 로그 패널 */}
      <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-xs h-48 overflow-y-auto">
        {log.length === 0
          ? '메서드 호출 시 여기에 기록됩니다.'
          : log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
