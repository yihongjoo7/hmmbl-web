'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from '@/components/common/ui/display/Spinner';

interface MemberCallButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children:   ReactNode;
  isLoading?: boolean;
}

/**
 * 멤버리스트 화면 전용 서버 호출 버튼.
 *
 * 기본 Button 컴포넌트와의 차이:
 *  - 형태 : rounded-full (알약형)  vs  rounded-md (기본)
 *  - 색상 : success 계열(#10B981)  vs  primary 계열(#3B82F6)
 *  - 그림자: shadow-md 추가
 *  - 굵기 : font-semibold          vs  font-medium
 *  - 테두리: 좌측에 흰색 원형 아이콘 영역 포함
 *
 * 사용처: features/_templates/member 내부에서만 import 한다.
 * 다른 화면에는 영향을 주지 않는다.
 *
 * @example
 * <MemberCallButton onClick={handleFetch}>서버 호출</MemberCallButton>
 * <MemberCallButton isLoading={isFetching}>서버 호출</MemberCallButton>
 */
export function MemberCallButton({
  children,
  className = '',
  disabled,
  isLoading,
  ...props
}: MemberCallButtonProps) {
  const busy = isLoading || disabled;

  return (
    <button
      disabled={busy}
      className={[
        // ── 레이아웃 ──────────────────────────────────────────
        'inline-flex items-center justify-center gap-2',

        // ── 형태: 알약형 (기본 Button은 rounded-md) ──────────
        'rounded-full',

        // ── 색상: success 계열 (기본 Button primary는 파란색) ─
        'bg-success text-text-inverse',
        'hover:bg-success-hover',

        // ── 크기 및 타이포그래피 ──────────────────────────────
        'px-6 py-2.5 text-sm font-semibold',

        // ── 그림자: 기본 Button에는 없음 ─────────────────────
        'shadow-md hover:shadow-lg',

        // ── 전환 효과 ─────────────────────────────────────────
        'transition-all duration-150',

        // ── 포커스 (접근성) ───────────────────────────────────
        'focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-success focus-visible:ring-offset-2',

        // ── 비활성 상태 ───────────────────────────────────────
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : null}
      {children}
    </button>
  );
}
