'use client';
/**
 * features/_templates/file-upload-test/FileUploadTestPage.tsx
 *
 * 테스트용 템플릿: nextjs-new 의 파일 업로드 테스트 화면
 *   (app/m/(protected)/advertisement/file-upload-test/page.tsx)을 복사한 것.
 * 개발 허브(/dev) → /dev/bridge/file-upload-test 라우트에서 렌더된다.
 *   (해당 라우트는 app/dev/bridge/layout.tsx 의 Mock 브릿지를 상속 → 네이티브 없이 카메라/갤러리 동작)
 *
 * 변경점(원본 대비):
 *   1. import 경로 @/services/fileUploadClient → @/lib/api/fileUploadClient
 *   2. import 경로 @/lib/env → @/lib/bridge, @/lib/env/bridgeActions → @/lib/bridge/bridgeActions
 *   3. validateFile 계약 차이 보정 — hpoint는 "오류 메시지 | null(유효)" 반환(자체 토스트 없음)
 */

import { useState, useEffect } from 'react';
import { useCameraCapture } from '@/features/shared/hooks/useCameraCapture';
import { useFileUpload } from '@/features/shared/hooks/useFileUpload';
import { validateFile, type UploadResult } from '@/lib/api/fileUploadClient';
import { fileApi } from '@/features/shared/services/fileApi';
import { UploadProgressBar } from '@/components/common/ui/feedback';
import { BottomSheet } from '@/components/common/ui/overlay';
import { Button } from '@/components/common/ui/action/Button';
import { BridgeTimeoutError, isWebView } from '@/lib/bridge';
import { requestImageDownload } from '@/lib/bridge/bridgeActions';
import { useToastStore } from '@/hooks/useToastStore';

/**
 * 카메라/갤러리(브릿지) 에러 → 사용자 친화 메시지 매핑.
 * USER_CANCELLED 는 조용히 무시(null 반환).
 */
function friendlyCaptureError(err: unknown): string | null {
  if (err instanceof BridgeTimeoutError) {
    return '카메라/갤러리 응답이 지연되었습니다. 다시 시도해 주세요.';
  }
  const code = err instanceof Error ? err.message : '';
  switch (code) {
    case 'USER_CANCELLED':
      return null;
    case 'PERMISSION_DENIED':
    case 'PERMISSION_UNKNOWN':
      return '카메라/갤러리 권한이 필요합니다. 설정에서 허용해 주세요.';
    case 'CAMERA_UNAVAILABLE':
      return '카메라를 사용할 수 없습니다. 기기 카메라 상태를 확인해 주세요.';
    case 'DECODE_FAILED':
      return '이미지를 읽을 수 없습니다. 다른 사진을 선택해 주세요.';
    case 'NOT_SUPPORTED':
      return '이 기기에서 지원하지 않는 기능입니다.';
    case 'TIMEOUT':
      return '카메라/갤러리 응답이 지연되었습니다. 다시 시도해 주세요.';
    default:
      return '이미지를 가져오지 못했습니다.';
  }
}

/** [39번 §5-5] 저장 파일명 — fileId 기반 (네이티브는 응답 Content-Type 우선, 확장자는 보조) */
function fileNameFrom(f: UploadResult): string {
  return `ad_${f.fileId}.jpg`;
}

/**
 * [39번 §5-5] 다운로드 에러 → 사용자 친화 메시지.
 * 발급 단계(ApiError — 서버 detail.message 보유)와 브릿지 단계(에러 코드)를 함께 처리한다.
 */
function friendlyDownloadError(err: unknown): string {
  if (err instanceof BridgeTimeoutError) {
    return '저장이 지연되고 있습니다. 잠시 후 사진 앱을 확인해 주세요.';
  }
  const code = err instanceof Error ? err.message : '';
  switch (code) {
    case 'PERMISSION_DENIED':
      return '사진 저장 권한이 필요합니다. 설정에서 허용해 주세요.';
    case 'NETWORK_ERROR':
      return '다운로드에 실패했습니다. 네트워크를 확인해 주세요.';
    case 'DOWNLOAD_FAILED':
    case 'INVALID_URL':
      return '이미지를 저장하지 못했습니다.';
    default:
      // ApiError(발급 403/404 등)는 서버 메시지를 그대로 사용
      return code || '이미지를 저장하지 못했습니다.';
  }
}

/**
 * 웹뷰 파일 업로드 테스트 화면
 * - '대상 선택' → 카메라/갤러리(BottomSheet) → useCameraCapture 로 File 획득
 * - 선택 이미지 미리보기 → '업로드'(useFileUpload, /files/image)
 * - 업로드 결과: 썸네일 터치 시 확대 미리보기, '다운로드'는 시스템 브라우저로 열기(openExternalBrowser)
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

  // [39번 §5-5] 다운로드: 서명 URL 발급(비공개 전환 대응) → 네이티브 사진 저장.
  // 폴백: 구버전 앱 → 외부 브라우저(서명 URL), 순수웹 → 새 탭 (현행 UX 동일)
  const handleDownload = async (f: UploadResult) => {
    try {
      // 1. 서명 URL 발급 (DPoP) — 비공개 전환 후 모든 다운로드의 공통 선행 단계
      const { url } = await fileApi.getDownloadUrl(f.fileId);

      // 2-a. 웹뷰 + 신버전 앱: 네이티브 다운로드 → 사진 라이브러리 저장
      if (isWebView() && window.bridge?.requestImageDownload) {
        await requestImageDownload(url, fileNameFrom(f));
        addToast('사진에 저장되었습니다.', 'success');
        return;
      }
      // 2-b. 웹뷰 + 구버전 앱: 외부 브라우저 폴백
      if (window.bridge?.openExternalBrowser) {
        window.bridge.openExternalBrowser(url);
        return;
      }
      // 2-c. 순수웹: 새 탭
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
