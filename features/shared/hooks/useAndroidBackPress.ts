'use client';
import { useEffect } from 'react';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';

export function useAndroidBackPress(handler: () => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    return bridgeEventBus.on('appBackPressed', handler);
  }, [handler, enabled]);
}
