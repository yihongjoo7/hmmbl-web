'use client';

/**
 * 개발 환경 전용 더미 Provider
<<<<<<< HEAD
 * hmmbl-web은 next-intl을 사용하지 않으므로 그냥 children을 렌더링합니다.
=======
 * hpoint-mobile은 next-intl을 사용하지 않으므로 그냥 children을 렌더링합니다.
>>>>>>> d7f5d08095fee6c85b4316650c7ef0b3797f4fda
 */
import { ReactNode } from 'react';

export function DevIntlProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
