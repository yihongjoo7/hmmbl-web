/**
 * lib/api/fileUploadClient.ts
 *
 * 파일 업로드 클라이언트 (DPoP 인증, multipart/form-data)
 *
 * 리팩토링 (P1: lib 레이어 순수화):
 *   - 이전: getAccessToken을 features/auth/hooks/useAuthStore에서 직접 import (레이어 위반)
 *   - 이후: configureFileUploadClient()로 getter·401 콜백을 주입 받음
 *           features/ 레이어 의존 완전 제거
 *
 * 2-Lite: 업로드도 fetch/XHR을 웹이 직접 수행한다. DPoP proof 서명 주체만
 * 모드에 따라 갈아끼운다(getDPoPHeader).
 *
 * 초기화 방법:
 *   features/auth/hooks/useAuthInterceptor.ts에서
 *   `configureFileUploadClient({ getToken, onUnauthorized })` 호출
 */

import { getDPoPHeader } from '@/lib/auth/dpop/proofProvider';
import { ApiError } from '@/types/api';
import { toApiError } from './parseApiError';

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;

// ── 주입 콜백 ─────────────────────────────────────────────────────────────
/** 현재 액세스 토큰을 동기 반환하는 getter. */
let _getToken: (() => string | null) | undefined;

/**
 * 401 응답 시 토큰을 갱신하고 새 토큰을 반환하는 콜백.
 * apiClient와 동일한 lib/auth/interceptor.ts의 onUnauthorized를 주입한다(single-flight 공유).
 */
let _onUnauthorized: (() => Promise<string>) | undefined;

/**
 * fileUploadClient에 토큰 getter와 401 갱신 콜백을 주입한다.
 * useAuthInterceptor의 useEffect 내에서 apiClient와 함께 설정한다.
 */
export function configureFileUploadClient(cfg: {
  getToken: () => string | null;
  onUnauthorized?: () => Promise<string>;
}): void {
  _getToken = cfg.getToken;
  _onUnauthorized = cfg.onUnauthorized;
}

// ── 타입 ──────────────────────────────────────────────────────────────────

export interface UploadResult {
  fileId:   string;
  url:      string;
  mimeType: string;
  size:     number;
}

export interface ValidateFileOptions {
  maxSizeBytes?:    number;
  allowedMimeTypes?: string[];
}

export interface UploadOptions {
  onProgress?: (percent: number) => void;
}

// ── 파일 검증 ─────────────────────────────────────────────────────────────

/**
 * 파일 크기·MIME 타입을 검증한다.
 *
 * @returns 오류 메시지 문자열 (유효하면 null)
 */
export function validateFile(file: File, options: ValidateFileOptions = {}): string | null {
  const { maxSizeBytes = 10 * 1024 * 1024, allowedMimeTypes } = options;

  if (file.size > maxSizeBytes) {
    const mb = Math.round(maxSizeBytes / 1024 / 1024);
    return `파일 크기는 ${mb}MB 이하여야 합니다.`;
  }
  if (allowedMimeTypes && !allowedMimeTypes.includes(file.type)) {
    return `허용되지 않는 파일 형식입니다. (허용: ${allowedMimeTypes.join(', ')})`;
  }
  return null;
}

// ── 업로드 ────────────────────────────────────────────────────────────────

/**
 * XHR 업로드(progress 지원)를 fetch와 동일하게 Response로 정규화한다.
 */
function xhrUpload(
  url: string,
  formData: FormData,
  headers: Record<string, string>,
  onProgress: (percent: number) => void,
): Promise<Response> {
  return new Promise<Response>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));
    xhr.withCredentials = true;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload  = () => resolve(new Response(xhr.responseText, { status: xhr.status }));
    xhr.onerror = () => reject(new ApiError(0, 'NETWORK_ERROR', '업로드 네트워크 오류가 발생했습니다.'));
    xhr.send(formData);
  });
}

/**
 * 업로드 1회 전송. 토큰이 있을 때만 DPoP proof를 생성·첨부한다(B1).
 * onProgress가 있으면 XHR, 없으면 fetch를 사용하되 둘 다 Response를 반환한다.
 */
async function sendUpload(
  file: File,
  url: string,
  onProgress?: (percent: number) => void,
): Promise<Response> {
  const token = _getToken?.() ?? null;
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `DPoP ${token}`;
    headers.DPoP = await getDPoPHeader(`${baseUrl}${url}`, 'POST');
  }

  // multipart 경계(boundary)는 브라우저가 설정하므로 Content-Type을 수동 지정하지 않는다.
  const formData = new FormData();
  formData.append('file', file);

  if (onProgress) {
    return xhrUpload(`${baseUrl}${url}`, formData, headers, onProgress);
  }
  return fetch(`${baseUrl}${url}`, {
    method:      'POST',
    headers,
    credentials: 'include',
    body:        formData,
  });
}

/**
 * 파일을 업로드한다.
 *
 * - onProgress 콜백이 있으면 XHR(진행률 지원), 없으면 fetch를 사용한다.
 * - 401 시 onUnauthorized로 토큰을 갱신하고 1회 재시도한다(interceptor single-flight 공유).
 * - 실패는 ApiError로 던진다(서버 detail.code/message/fields 보존).
 *
 * @param file     업로드할 File 객체
 * @param url      업로드 API 경로 (baseUrl 제외, 예: '/files/upload')
 * @param options  { onProgress? } 진행률 콜백
 */
export async function uploadFile(
  file: File,
  url: string,
  options: UploadOptions = {},
): Promise<UploadResult> {
  const { onProgress } = options;

  let res = await sendUpload(file, url, onProgress);

  // 401 → 토큰 갱신 후 1회 재시도
  if (res.status === 401 && _onUnauthorized) {
    await _onUnauthorized();
    res = await sendUpload(file, url, onProgress);
  }

  if (!res.ok) throw await toApiError(res);
  return res.json() as Promise<UploadResult>;
}
