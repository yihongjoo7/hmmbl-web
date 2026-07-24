'use client';
import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy';
const VIBRATION_DURATION: Record<HapticType, number> = { light: 10, medium: 25, heavy: 50 };

interface UseHapticReturn {
  trigger: (type?: HapticType) => void;
  light: () => void;
  medium: () => void;
  heavy: () => void;
}

export function useHaptic(): UseHapticReturn {
  const trigger = useCallback((type: HapticType = 'light') => {
    if (typeof navigator.vibrate === 'function') {
      navigator.vibrate(VIBRATION_DURATION[type]);
    }
  }, []);

  return {
    trigger,
    light:  useCallback(() => trigger('light'),  [trigger]),
    medium: useCallback(() => trigger('medium'), [trigger]),
    heavy:  useCallback(() => trigger('heavy'),  [trigger]),
  };
}
