'use client';

/**
 * 개발 환경 전용 더미 Provider
 * hmfrnt-web은 next-intl을 사용하지 않으므로 그냥 children을 렌더링합니다.
 */
import { ReactNode } from 'react';

export function DevIntlProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
