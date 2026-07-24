'use client';
import { useState, useCallback } from 'react';
import { requestCamera, requestGallery, BridgeTimeoutError } from '@/lib/bridge/bridgeActions';

type CameraSource = 'camera' | 'gallery';

interface UseCameraCaptureReturn {
  capture: (source: CameraSource) => Promise<File>;
  isCapturing: boolean;
  error: string | null;
  clearError: () => void;
}

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/heic': 'heic', 'image/webp': 'webp',
};

function base64ToFile(base64: string, mimeType: string, filename: string): File {
  let byteString: string;
  try { byteString = atob(base64); }
  catch { throw new Error('[Bridge] 이미지 데이터가 유효하지 않습니다.'); }
  const bytes = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) bytes[i] = byteString.charCodeAt(i);
  return new File([new Blob([bytes], { type: mimeType })], filename, { type: mimeType });
}

function pickFileFromInput(): Promise<File> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.style.display = 'none';
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
      if (window.bridge) {
        const result = source === 'camera' ? await requestCamera() : await requestGallery();
        const ext = MIME_TO_EXT[result.mimeType] ?? 'jpg';
        return base64ToFile(result.base64, result.mimeType, `capture_${Date.now()}.${ext}`);
      }
      return await pickFileFromInput();
    } catch (err) {
      const msg = err instanceof BridgeTimeoutError ? '이미지 선택 시간이 초과되었습니다.'
        : err instanceof Error ? err.message : '이미지를 가져오지 못했습니다.';
      setError(msg);
      throw err;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  return { capture, isCapturing, error, clearError: useCallback(() => setError(null), []) };
}
