'use client';
/**
 * [개발자] DPoP 키 로테이션 트리거 훅
 *
 * Bridge 이벤트 'keyRotation' 수신 시 기존 DPoP 키쌍을 폐기하고
 * 새 키쌍을 생성합니다.
 */

import { useEffect } from 'react';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';
import { rotateDPoPKey } from '@/lib/auth/dpop/keyRotation';
import { resolveDpopMode } from '@/lib/auth/dpop/mode';

export function useKeyRotation() {
  useEffect(() => {
    // [202] native 모드는 웹 DPoP 키를 쓰지 않으므로 로테이션 불필요(네이티브 KeyStore 책임)
    if (resolveDpopMode() === 'native') return;
    return bridgeEventBus.on('keyRotation', async () => {
      await rotateDPoPKey();
    });
  }, []);
}
