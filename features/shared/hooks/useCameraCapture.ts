'use client';
import { useState, useCallback } from 'react';

type CameraSource = 'camera' | 'gallery';

interface UseCameraCaptureReturn {
  capture: (source: CameraSource) => Promise<File>;
  isCapturing: boolean;
  error: string | null;
  clearError: () => void;
}

function pickFileFromInput(source: CameraSource): Promise<File> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.style.display = 'none';
    // 모바일 브라우저에서 카메라 소스일 때만 후면 카메라를 힌트로 우선 노출한다.
    if (source === 'camera') input.capture = 'environment';
    document.body.appendChild(input);
    const timeout = setTimeout(() => { cleanup(); reject(new Error('파일 선택 시간이 초과되었습니다.')); }, 5 * 60_000);
    function cleanup() { clearTimeout(timeout); if (document.body.contains(input)) document.body.removeChild(input); }
    input.onchange = () => { const f = input.files?.[0]; cleanup(); f ? resolve(f) : reject(new Error('파일이 선택되지 않았습니다.')); };
    input.addEventListener('cancel', () => { cleanup(); reject(new Error('USER_CANCELLED')); });
    input.click();
  });
}

export function useCameraCapture(): UseCameraCaptureReturn {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capture = useCallback(async (source: CameraSource): Promise<File> => {
    setIsCapturing(true);
    setError(null);
    try {
      return await pickFileFromInput(source);
    } catch (err) {
      const msg = err instanceof Error ? err.message : '이미지를 가져오지 못했습니다.';
      setError(msg);
      throw err;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  return { capture, isCapturing, error, clearError: useCallback(() => setError(null), []) };
}
