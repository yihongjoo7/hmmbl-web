'use client';
import { useEffect } from 'react';
import { bridgeEventBus } from '@/lib/bridge/bridgeEventBus';
import type { BridgeEventName } from '@/lib/bridge/bridge';

export function useBridgeEvent<T = unknown>(
  eventName: BridgeEventName,
  handler: (data: T) => void,
): void {
  useEffect(() => {
    return bridgeEventBus.on<T>(eventName, handler);
  }, [eventName, handler]);
}
