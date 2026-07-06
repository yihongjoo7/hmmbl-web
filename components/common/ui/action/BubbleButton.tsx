'use client';

/**
 * BubbleButton.tsx
 *
 * 말풍선(bubble) 형태의 버튼 컴포넌트.
 * 기존 Button을 wrapping하며, 꼬리(tail) 방향만 추가로 제어한다.
 *
 * 사용법:
 *   <BubbleButton tailPosition="bottom">확인</BubbleButton>
 *   <BubbleButton tailPosition="left" variant="danger" leftIcon={<Icon />}>삭제</BubbleButton>
 *
 * 주의:
 *   - variant, size, leftIcon, rightIcon 등 Button의 모든 props를 그대로 사용할 수 있다.
 *   - tailPosition 기본값은 'bottom'이다.
 */

import { ComponentProps } from 'react';
import { Button } from './Button';

/** 꼬리가 나오는 방향 (버튼 몸통 기준 바깥쪽) */
type TailPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Button의 variant 타입을 로컬에서 재선언.
 * Button에서 export되지 않으므로 tailColorClass 매핑에 사용하기 위해 정의한다.
 */
type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';

/**
 * 꼬리 위치 클래스 (방향별)
 *
 * 구현 방식: 12×12px 정사각형(rotate-45)을 버튼 모서리 근처에 배치한다.
 * - 정사각형의 절반은 버튼 뒤에 숨고 (Button이 DOM 순서상 뒤 → stacking 위에 위치),
 *   나머지 절반만 바깥으로 노출되어 삼각형처럼 보인다.
 * - CSS border 트릭 대신 이 방식을 선택한 이유:
 *   border 트릭은 이등변삼각형만 만들 수 있고, 꼭지점 위치 제어가 어렵다.
 *
 * 각 방향은 버튼의 꼭지점 근처에 꼬리가 붙도록 offset을 설정한다.
 * (중앙이 아닌 모서리 근처 → 말풍선의 자연스러운 위치감)
 */
const tailPositionClass: Record<TailPosition, string> = {
  // 상단 오른쪽 꼭지점 근처, 위로 돌출
  top:    'absolute top-0    right-4  -translate-y-1/2 rotate-45',
  // 하단 왼쪽 꼭지점 근처, 아래로 돌출
  bottom: 'absolute bottom-0 left-4   translate-y-1/2  rotate-45',
  // 왼쪽 하단 꼭지점 근처, 왼쪽으로 돌출
  left:   'absolute left-0   bottom-2 -translate-x-1/2 rotate-45',
  // 오른쪽 하단 꼭지점 근처, 오른쪽으로 돌출
  right:  'absolute right-0  bottom-2  translate-x-1/2 rotate-45',
};

/**
 * 꼬리 색상 클래스 (variant별)
 *
 * 꼬리 span은 Button의 형제 요소이므로 bg-inherit이 동작하지 않는다.
 * Button의 variantClass(Button.tsx)와 동일한 배경색을 직접 매핑한다.
 * → Button의 variant 색상이 변경될 경우 여기도 함께 수정해야 한다.
 */
const tailColorClass: Record<Variant, string> = {
  primary:   'bg-primary',   // Button primary와 동일
  secondary: 'bg-bg-tertiary',   // Button secondary와 동일
  danger:    'bg-error',    // Button danger와 동일
  ghost:     'bg-transparent',
  outline:   'bg-bg-primary',
};

/**
 * outline variant 전용 꼬리 테두리 클래스 (방향별)
 *
 * outline 버튼은 bg-bg-primary + border-border-muted 조합이라, 꼬리가 흰 배경에 묻혀 보이지 않는다.
 * rotate-45 정사각형에서 버튼 바깥으로 노출되는 두 변에만 border-border-muted를 적용해
 * 버튼의 테두리가 꼬리까지 이어지는 것처럼 보이게 한다.
 *
 * rotate-45 기준 노출 변:
 *   top    → 위·왼쪽 변  → border-t border-l
 *   bottom → 아래·오른쪽 변 → border-b border-r
 *   left   → 아래·왼쪽 변  → border-b border-l
 *   right  → 위·오른쪽 변  → border-t border-r
 */
const tailOutlineBorderClass: Record<TailPosition, string> = {
  top:    'border-t border-l border-border-muted',
  bottom: 'border-b border-r border-border-muted',
  left:   'border-b border-l border-border-muted',
  right:  'border-t border-r border-border-muted',
};

interface BubbleButtonProps extends ComponentProps<typeof Button> {
  /** 꼬리 방향. 기본값: 'bottom' */
  tailPosition?: TailPosition;
}

export function BubbleButton({
  tailPosition = 'bottom',
  variant      = 'primary',
  className    = '',
  ...props
}: BubbleButtonProps) {
  return (
    /**
     * 래퍼 div: relative + inline-flex
     * - relative: 꼬리 span의 absolute 포지셔닝 기준점
     * - inline-flex: 버튼 크기만큼만 공간 차지 (block이면 full-width가 됨)
     */
    <div className="relative inline-flex">
      {/*
       * 꼬리 삼각형 (rotate-45 정사각형)
       * - DOM 순서상 Button보다 앞에 위치 → stacking 아래에 깔림
       * - Button(relative)이 위에 쌓여 안쪽 절반을 덮음 → 삼각형처럼 노출
       * - aria-hidden: 스크린리더에서 의미 없는 장식 요소로 처리
       */}
      <span
        aria-hidden="true"
        className={`w-3 h-3 ${tailPositionClass[tailPosition]} ${tailColorClass[variant]}${variant === 'outline' ? ` ${tailOutlineBorderClass[tailPosition]}` : ''}`}
      />

      {/*
       * 실제 버튼
       * - rounded-2xl: 기본 rounded-md보다 큰 radius → 말풍선 느낌
       * - relative: stacking context 생성 → 꼬리 span 위에 위치하게 됨
       * - className은 외부에서 override 가능 (rounded 재지정 등)
       */}
      <Button
        variant={variant}
        className={`rounded-2xl relative ${className}`}
        {...props}
      />
    </div>
  );
}
