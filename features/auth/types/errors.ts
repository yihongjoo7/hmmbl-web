/**
 * features/auth/types/errors.ts
 *
 * 인증 에러 코드 단일 정의 (P0: 중복 선언 제거)
 *
 * 수정 전 문제:
 *   - `AuthErrorCode` const가 파일 내에 2회 선언됨 → 런타임 오류 위험
 *   - 두 선언의 키가 달라 어느 것이 정식 정의인지 불분명
 *
 * 수정 후:
 *   - 두 선언을 머지하여 단일 const로 통합
 *   - 중복 키(TOKEN_EXPIRED)는 두 선언 중 범용 값('TOKEN_EXPIRED')을 유지
 */

export const AuthErrorCode = {
  // ── 토큰 ────────────────────────────────────────────────────────────────
  /** 만료된 액세스 토큰 */
  TOKEN_EXPIRED:         'TOKEN_EXPIRED',
  /** 유효하지 않은 토큰 (서명 불일치 등) */
  TOKEN_INVALID:         'TOKEN_INVALID',
  /** 토큰 교환 실패 (/auth/token POST 오류) */
  TOKEN_EXCHANGE_FAIL:   'TOKEN_EXCHANGE_FAILED',
  /** 인증 코드 유효하지 않음 */
  INVALID_CODE:          'INVALID_CODE',

  // ── DPoP ────────────────────────────────────────────────────────────────
  /** IndexedDB에 DPoP 키쌍 없음 (초기화 필요) */
  DPOP_KEY_MISSING:      'DPOP_KEY_MISSING',
  /** 서버가 DPoP proof를 거부 */
  INVALID_DPOP_PROOF:    'INVALID_DPOP_PROOF',

  // ── 세션 ────────────────────────────────────────────────────────────────
  /** 서버에 세션 없음 (재인증 필요) */
  SESSION_NOT_FOUND:     'SESSION_NOT_FOUND',

  // ── 인증 방법 ────────────────────────────────────────────────────────────
  /** 생체인증 실패 */
  BIOMETRIC_FAILED:      'BIOMETRIC_FAILED',
  /** PIN 인증 실패 */
  PIN_FAILED:            'PIN_FAILED',
  /** 본인인증 실패 */
  IDENTITY_FAILED:       'IDENTITY_FAILED',
  /** 약관 미동의 */
  TERMS_NOT_AGREED:      'TERMS_NOT_AGREED',
} as const;

/** AuthErrorCode 값의 유니언 타입 */
export type AuthErrorCode = typeof AuthErrorCode[keyof typeof AuthErrorCode];
