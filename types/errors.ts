// 전역 에러 코드 정의 (HTTP·비즈니스·Bridge)
export const ErrorCode = {
  // HTTP 공통
  UNAUTHORIZED:               'UNAUTHORIZED',
  FORBIDDEN:                  'FORBIDDEN',
  NOT_FOUND:                  'NOT_FOUND',
  VALIDATION_ERROR:           'VALIDATION_ERROR',
  INTERNAL_SERVER_ERROR:      'INTERNAL_SERVER_ERROR',
  // 회원
  MEMBER_NOT_FOUND:           'MEMBER_NOT_FOUND',
  MEMBER_ALREADY_EXISTS:      'MEMBER_ALREADY_EXISTS',
  // 승인
  APPROVAL_ALREADY_PROCESSED: 'APPROVAL_ALREADY_PROCESSED',
  APPROVAL_NOT_FOUND:         'APPROVAL_NOT_FOUND',
} as const;

export type ErrorCodeType = typeof ErrorCode[keyof typeof ErrorCode];
