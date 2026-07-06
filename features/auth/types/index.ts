/**
 * features/auth/types/index.ts
 *
 * 인증 도메인 타입 단일 정의 (P0: 중복 선언 제거)
 *
 * 수정 전 문제:
 *   - `User`와 `AuthResponse`가 파일 내에 2회씩 중복 선언됨
 *   - 두 선언 간 `profileImage` 필드 optional 여부가 불일치
 *   - `TokenSet`, `DPoPKeyPair`, `AuthState`가 미사용 상태로 잔존
 *
 * 수정 후:
 *   - `User.profileImage`는 optional로 통일 (미등록 사용자 허용)
 *   - `AuthResponse.expiresIn`는 optional (일부 엔드포인트가 미반환)
 *   - `DPoPKeyPair`는 Web Crypto API 표준 타입(CryptoKeyPair)으로 대체
 *     → lib/auth/dpop/proofGenerator.ts와 타입 충돌 방지
 */

// ── 사용자 ─────────────────────────────────────────────────────────────────

/** 로그인 사용자 정보 */
export interface User {
  id:            string;
  name:          string;
  email:         string;
  role:          string;
  /** 프로필 이미지 URL. 미설정 사용자는 undefined. */
  profileImage?: string;
}

// ── 토큰 ───────────────────────────────────────────────────────────────────

/** `/auth/token` 응답 전체 구조 */
export interface AuthResponse {
  accessToken:  string;
  /** 만료까지 남은 초. 서버가 내려주지 않을 수 있으므로 optional. */
  expiresIn?:   number;
  user:         User;
}

/** 메모리 캐시에 저장하는 토큰 세트 */
export interface AuthTokens {
  accessToken:  string;
  refreshToken: string;
}

/** tokenCache.set()에 전달하는 토큰 + 만료 정보 */
export interface TokenSet {
  accessToken: string;
  expiresIn:   number;
}

// ── 인증 상태 ──────────────────────────────────────────────────────────────

/** Zustand useAuthStore의 상태 슬라이스 */
export interface AuthState {
  isAuthenticated: boolean;
  user:            User | null;
}
