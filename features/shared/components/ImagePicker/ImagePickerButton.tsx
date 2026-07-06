'use client';

/**
 * features/shared/components/ImagePicker/ImagePickerButton.tsx
 *
 * 이미지 선택 버튼 컴포넌트
 *
 * 웹뷰 환경:
 *   source="camera"  → 카메라 직접 촬영
 *   source="gallery" → 갤러리에서 선택
 *   source="both"    → 카메라/갤러리 버튼 동시 표시
 *
 * 웹 환경:
 *   <input type="file"> 파일 선택 다이얼로그 (단일 버튼)
 *
 * 사용법:
 *   <ImagePickerButton
 *     source="both"
 *     onSelect={(file, previewUrl) => { ... }}
 *   />
 */

import { useCallback } from 'react';
import { useCameraCapture } from '@/features/shared/hooks/useCameraCapture';

interface ImagePickerButtonProps {
  /**
   * 이미지 선택 완료 시 호출되는 콜백
   * @param file 선택된 파일 객체
   * @param previewUrl Object URL (사용 후 URL.revokeObjectURL 필요)
   */
  onSelect: (file: File, previewUrl: string) => void;
  /**
   * 웹뷰에서 표시할 소스 선택 옵션
   * 'both': 카메라 + 갤러리 버튼 모두 표시 (기본값)
   */
  source?: 'camera' | 'gallery' | 'both';
  /** 버튼 비활성화 여부 */
  disabled?: boolean;
  /** 버튼 텍스트 (웹 환경 단일 버튼) */
  children?: React.ReactNode;
}

export function ImagePickerButton({
  onSelect,
  source = 'both',
  disabled = false,
  children,
}: ImagePickerButtonProps) {
  const { capture, isCapturing, error } = useCameraCapture();

  const handleCapture = useCallback(
    async (src: 'camera' | 'gallery') => {
      try {
        const file = await capture(src);
        // Object URL로 미리보기 생성 (사용 후 반드시 URL.revokeObjectURL 호출 필요)
        const previewUrl = URL.createObjectURL(file);
        onSelect(file, previewUrl);
      } catch (err) {
        // USER_CANCELLED는 조용히 처리 (에러 표시 X)
        if (err instanceof Error && err.message === 'USER_CANCELLED') return;
        // 기타 에러는 useCameraCapture 내부에서 error 상태로 관리됨
      }
    },
    [capture, onSelect],
  );

  const isDisabled = disabled || isCapturing;
  
  // 웹 환경: 단일 버튼 (파일 선택 다이얼로그)
  if (!true) {
    return (
      <div>
        <button
          onClick={() => handleCapture('gallery')}
          disabled={isDisabled}
          style={{
            padding: '8px 16px',
            borderRadius: 6,
            border: '1px solid #d1d5db',
            background: '#fff',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            opacity: isDisabled ? 0.6 : 1,
          }}
        >
          {isCapturing ? '처리 중...' : (children ?? '이미지 선택')}
        </button>
        {error && (
          <p style={{ color: '#ef4444', fontSize: 13, marginTop: 4 }}>{error}</p>
        )}
      </div>
    );
  }

  // 웹뷰 환경: source에 따라 버튼 표시
  return (
    <div>
      <div style={{ display: 'flex', gap: 8 }}>
        {(source === 'camera' || source === 'both') && (
          <button
            onClick={() => handleCapture('camera')}
            disabled={isDisabled}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              background: '#fff',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.6 : 1,
            }}
          >
            {isCapturing ? '처리 중...' : '📷 카메라'}
          </button>
        )}
        {(source === 'gallery' || source === 'both') && (
          <button
            onClick={() => handleCapture('gallery')}
            disabled={isDisabled}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              background: '#fff',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              opacity: isDisabled ? 0.6 : 1,
            }}
          >
            {isCapturing ? '처리 중...' : '🖼️ 갤러리'}
          </button>
        )}
      </div>
      {error && (
        <p style={{ color: '#ef4444', fontSize: 13, marginTop: 4 }}>{error}</p>
      )}
    </div>
  );
}
