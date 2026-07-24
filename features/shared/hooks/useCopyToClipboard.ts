'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useHaptic } from './useHaptic';

interface UseCopyToClipboardReturn {
  copy: (text: string) => Promise<boolean>;
  isCopied: boolean;
  error: string | null;
}

export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { light } = useHaptic();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current !== null) clearTimeout(timerRef.current); }, []);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    setError(null);
    try {
      if (window.bridge?.copyToClipboard) {
        window.bridge.copyToClipboard(text);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (!ok) throw new Error('클립보드 복사를 지원하지 않는 환경입니다.');
      }
      light();
      setIsCopied(true);
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => { timerRef.current = null; setIsCopied(false); }, 2_000);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '복사에 실패했습니다.');
      return false;
    }
  }, [light]);

  return { copy, isCopied, error };
}
