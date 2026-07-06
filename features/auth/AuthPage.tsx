'use client';
/**
 * [개발자] Auth Container
 *
 * 간편인증·본인인증·약관동의 화면의 비즈니스 로직을 담당합니다.
 * 하위 View 컴포넌트에 props를 주입합니다.
 */

import { useBiometricAuth } from './hooks/useBiometricAuth';

export default function AuthPage() {
  const { authenticate, isLoading, error } = useBiometricAuth();

  return (
    <div>
      {/* TODO: 라우트 파라미터에 따라 SimpleAuthView / IdentityView / TermsView 분기 */}
      <button onClick={authenticate} disabled={isLoading}>
        {isLoading ? '인증 중...' : '간편인증'}
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
