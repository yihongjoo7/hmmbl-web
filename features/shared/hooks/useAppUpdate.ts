'use client';
/**
 * 앱 업데이트 안내 훅 (강제·일반)
 *
 * Bridge 이벤트 'appUpdateRequired' 또는 'appUpdateAvailable' 수신 시
 * 업데이트 안내 다이얼로그를 표시합니다.
 *
 * 강제 업데이트: 앱 사용 불가, 스토어 이동 버튼만 표시
 * 일반 업데이트: 나중에 하기 선택 가능
 */

import { useState, useEffect } from 'react';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';

export interface AppUpdateInfo {
  type: 'force' | 'optional';
  version: string;
  storeUrl: string;
  message?: string;
}

interface UseAppUpdateReturn {
  updateInfo: AppUpdateInfo | null;
  dismiss: () => void;
}

export function useAppUpdate(): UseAppUpdateReturn {
  const [updateInfo, setUpdateInfo] = useState<AppUpdateInfo | null>(null);

  useEffect(() => {
    const u1 = bridgeEventBus.on<AppUpdateInfo>('appUpdateRequired', (data) => {
      setUpdateInfo({ ...data, type: 'force' });
    });
    const u2 = bridgeEventBus.on<AppUpdateInfo>('appUpdateAvailable', (data) => {
      setUpdateInfo({ ...data, type: 'optional' });
    });
    return () => { u1(); u2(); };
  }, []);

  const dismiss = () => {
    setUpdateInfo(prev => (prev?.type === 'optional' ? null : prev));
  };

  return { updateInfo, dismiss };
}
