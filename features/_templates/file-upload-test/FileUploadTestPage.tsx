'use client';
/**
 * features/_templates/file-upload-test/FileUploadTestPage.tsx
 *
 * 파일 업로드 테스트 화면. `app/(protected)/file-upload-test/page.tsx`에서 렌더된다.
 *
 * 변경점(원본 대비):
 *   1. import 경로 @/services/fileUploadClient → @/lib/api/fileUploadClient
 *   2. validateFile 계약 차이 보정 — hpoint는 "오류 메시지 | null(유효)" 반환(자체 토스트 없음)
 */

import { useState, useEffect } from 'react';
import { useCameraCapture } from '@/features/shared/hooks/useCameraCapture';
import { useFileUpload } from '@/features/shared/hooks/useFileUpload';
import { validateFile, type UploadResult } from '@/lib/api/fileUploadClient';
import { fileApi } from '@/features/shared/services/fileApi';
import { UploadProgressBar } from '@/components/common/ui/feedback';
import { BottomSheet } from '@/components/common/ui/overlay';
import { Button } from '@/components/common/ui/action/Button';
import { useToastStore } from '@/hooks/useToastStore';

/** 카메라/갤러리 파일 선택 에러 → 사용자 친화 메시지. USER_CANCELLED는 조용히 무시(null 반환). */
function friendlyCaptureError(err: unknown): string | null {
  const code = err instanceof Error ? err.message : '';
  if (code === 'USER_CANCELLED') return null;
  return code || '이미지를 가져오지 못했습니다.';
}

/** 다운로드(서명 URL 발급) 에러 → 사용자 친화 메시지. */
function friendlyDownloadError(err: unknown): string {
  const code = err instanceof Error ? err.message : '';
  return code || '이미지를 저장하지 못했습니다.';
}

/**
 * 파일 업로드 테스트 화면
 * - '대상 선택' → 카메라/갤러리(BottomSheet) → useCameraCapture 로 File 획득
 * - 선택 이미지 미리보기 → '업로드'(useFileUpload, /files/image)
 * - 업로드 결과: 썸네일 터치 시 확대 미리보기, '다운로드'는 새 탭으로 열기
 * - 알림은 인앱 토스트(useToastStore/ToastContainer)로 통일.
 */
export default function FileUploadTestPage() {
  const addToast = useToastStore((s) => s.addToast);
  const { capture, isCapturing } = useCameraCapture();
  const { mutate: upload, isPending, progress } = useFileUpload('image');

  const [selected, setSelected] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [uploaded, setUploaded] = useState<UploadResult[]>([]);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);

  // 선택 이미지 미리보기 ObjectURL 생성/정리
  useEffect(() => {
    if (!selected) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selected]);

  const handlePick = async (source: 'camera' | 'gallery') => {
    setSheetOpen(false);
    try {
      const file = await capture(source);
      // hpoint validateFile은 "오류 메시지 문자열 | null(유효)" 반환 → 메시지 있으면 토스트 후 중단
      const verr = validateFile(file);
      if (verr) {
        addToast(verr, 'error');
        return;
      }
      setSelected(file);
    } catch (err) {
      const msg = friendlyCaptureError(err);
      if (msg) addToast(msg, 'error'); // USER_CANCELLED 등은 null → 조용히
    }
  };

  const handleUpload = () => {
    if (!selected) return;
    upload(selected, {
      onSuccess: (result) => {
        setUploaded((prev) => [result, ...prev]);
        setSelected(null);
        addToast('업로드되었습니다.', 'success');
      },
      onError: (e) => addToast(e.message, 'error'),
    });
  };

  // 다운로드: 서명 URL 발급(DPoP) 후 새 탭으로 연다.
  const handleDownload = async (f: UploadResult) => {
    try {
      const { url } = await fileApi.getDownloadUrl(f.fileId);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      addToast(friendlyDownloadError(err), 'error');
    }
  };

  return (
    <main className="p-4 space-y-6">
      <h1 className="text-lg font-bold text-text-primary">파일 업로드 테스트</h1>

      {/* 대상 선택 + 미리보기 + 업로드 */}
      <section className="space-y-3">
        <Button variant="outline" onClick={() => setSheetOpen(true)} disabled={isCapturing || isPending}>
          대상 선택
        </Button>

        {previewUrl && (
          <div className="space-y-3">
            <p className="text-xs font-semibold text-text-secondary">선택한 이미지</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="선택 이미지 미리보기"
              className="max-w-full rounded-lg border border-border-default"
              style={{ maxHeight: 240 }}
            />
            <Button onClick={handleUpload} isLoading={isPending} fullWidth>
              {isPending ? '업로드 중…' : '업로드'}
            </Button>
          </div>
        )}

        {isPending && <UploadProgressBar progress={progress} />}
      </section>

      {/* 업로드 결과 */}
      {uploaded.length > 0 && (
        <section className="space-y-2">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">업로드 결과</p>
          <ul className="grid grid-cols-2 gap-3">
            {uploaded.map((f) => (
              <li key={f.fileId} className="rounded-lg border border-border-default p-2 space-y-1">
                <button type="button" onClick={() => setZoomUrl(f.url)} className="block w-full" title="터치하여 미리보기">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.url} alt={f.fileId} className="h-28 w-full rounded object-cover" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(f)}
                  className="block w-full text-center text-xs text-text-secondary hover:text-text-primary"
                >
                  다운로드
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 대상 선택 시트 */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="대상 선택">
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => handlePick('camera')} className="w-full py-3 rounded-lg text-text-primary hover:bg-bg-secondary transition-colors">카메라 촬영</button>
          <button type="button" onClick={() => handlePick('gallery')} className="w-full py-3 rounded-lg text-text-primary hover:bg-bg-secondary transition-colors">갤러리에서 선택</button>
        </div>
      </BottomSheet>

      {/* 미리보기 확대 모달 */}
      {zoomUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setZoomUrl(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoomUrl} alt="확대 미리보기" className="max-h-full max-w-full rounded-lg" />
        </div>
      )}
    </main>
  );
}
