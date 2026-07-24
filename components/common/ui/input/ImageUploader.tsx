'use client';
import { useState, useRef } from 'react';
import { useCameraCapture } from '@/features/shared/hooks/useCameraCapture';
import { BottomSheet } from '@/components/common/ui/overlay';

interface ImageUploaderProps {
  onSelect: (file: File | string) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  preview?: string;
}

export function ImageUploader({ onSelect, accept = 'image/*', maxSizeMB = 10, label, preview }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(preview);
  const [sheetOpen, setSheetOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { capture, isCapturing } = useCameraCapture();

  const displayLabel = label ?? '이미지 업로드';

  const handleFile = (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`이미지 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
    onSelect(file);
  };

  // WebView 전용 — 항상 카메라/갤러리 선택 시트 표시
  const handleClick = () => {
    setSheetOpen(true);
  };

  const handlePick = async (source: 'camera' | 'gallery') => {
    setSheetOpen(false);
    try {
      const file = await capture(source);
      handleFile(file);
    } catch (err) {
      if (err instanceof Error && err.message === 'USER_CANCELLED') return;
      // 기타 에러는 useCameraCapture 내부 error 상태로 관리됨
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {displayLabel && <label className="text-sm font-medium text-text-primary">{displayLabel}</label>}
      <button type="button" onClick={handleClick} disabled={isCapturing}
        className="w-full h-32 border-2 border-dashed border-border-muted rounded-lg flex flex-col items-center justify-center gap-2 hover:border-border-hover transition-colors disabled:opacity-50">
        {previewUrl
          ? <img src={previewUrl} alt="preview" className="h-full w-full object-cover rounded-lg" />
          : <>
              <svg className="w-8 h-8 text-text-disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-xs text-text-secondary">{displayLabel}</span>
            </>
        }
      </button>
      <input ref={fileRef} type="file" accept={accept} className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="사진 가져오기">
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => handlePick('camera')}
            className="w-full py-3 rounded-lg text-text-primary hover:bg-bg-secondary transition-colors">카메라 촬영</button>
          <button type="button" onClick={() => handlePick('gallery')}
            className="w-full py-3 rounded-lg text-text-primary hover:bg-bg-secondary transition-colors">갤러리에서 선택</button>
        </div>
      </BottomSheet>
    </div>
  );
}
