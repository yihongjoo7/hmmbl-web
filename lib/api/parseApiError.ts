/**
 * lib/api/parseApiError.ts
 *
 * HTTP 실패 응답 → ApiError 변환 (공용 헬퍼)
 *
 * 배경:
 *   백엔드(FastAPI)는 HTTPException(detail={...})를 {"detail": {...}}로 감싼다.
 *   따라서 code/message/fields가 detail 안에 중첩될 수 있다.
 *   이 헬퍼가 detail 중첩과 평탄 형태를 모두 수용해 apiClient·tokenRefresh·
 *   authService·fileUploadClient의 에러 생성을 한 곳으로 통일한다.
 */

import { ApiError } from '@/types/api';
import { fallbackMessages } from '@/lib/utils/errorMessages';

type ApiErrorFields = ApiError['fields'];

interface RawErrorBody {
  detail?: { code?: string; message?: string; fields?: ApiErrorFields };
  code?:    string;
  message?: string;
  fields?:  ApiErrorFields;
}

/** HTTP 상태별 사용자 메시지 폴백 (서버가 message를 주지 않을 때). */
export function getHttpErrorMessage(status: number): string {
  if (status >= 500)  return fallbackMessages.server;
  if (status === 403) return fallbackMessages.forbidden;
  return fallbackMessages.unknown;
}

/**
 * 실패 Response를 ApiError로 변환한다.
 *
 * detail이 (배열 아닌) 객체면 그 안에서, 아니면 최상위에서 code/message/fields를 읽는다.
 * 본문이 비었거나 JSON이 아니면 상태 기반 폴백 메시지를 사용한다.
 */
export async function toApiError(res: Response, fallbackCode = 'UNKNOWN'): Promise<ApiError> {
  const raw = (await res.json().catch(() => null)) as RawErrorBody | null;
  const d =
    raw && typeof raw.detail === 'object' && raw.detail !== null && !Array.isArray(raw.detail)
      ? raw.detail
      : (raw ?? {});
  return new ApiError(
    res.status,
    d.code ?? fallbackCode,
    d.message ?? getHttpErrorMessage(res.status),
    d.fields,
  );
}
