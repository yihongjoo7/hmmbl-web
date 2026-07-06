import { ApiError } from '@/types/api';

/**
 * ApiError.fields[]를 폼 라이브러리의 필드별 에러로 매핑한다.
 *
 * react-hook-form 호환 시그니처. 동일한 setError 패턴을 따르는
 * 다른 폼 라이브러리에도 적용 가능하다.
 *
 * 사용 예 (react-hook-form useMutation onError):
 * ```ts
 * onError: (error: unknown) => {
 *   if (!applyFieldErrors(error, form.setError)) {
 *     setGlobalError(getApiErrorMessage(error));
 *   }
 * },
 * ```
 *
 * @returns fields 에러를 적용했으면 true, ApiError.fields가 없으면 false
 */
export function applyFieldErrors(
  error: unknown,
  setError: (field: string, error: { message: string }) => void,
): boolean {
  if (!(error instanceof ApiError) || !error.fields?.length) return false;

  error.fields.forEach(({ field, message }) => {
    setError(field, { message });
  });

  return true;
}
