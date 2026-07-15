/*--------------------------------------------------------------------------------------------------------------------------
##  CustomIconButton.jsx
##  Iconbutton custom
---------------------------------------------------------------------------------------------------------------------------*/

import React, { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

import { CustomIconButtonVariants, type IconButtonVariants } from './CustomIconButton.styles';
import Image from 'next/image';

export interface CustomIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, IconButtonVariants {
  icon: string;
  ariaLabel: string;
}

// 버튼 사이즈별 아이콘 이미지 크기 매핑
const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
};

export const CustomIconButton = forwardRef<HTMLButtonElement, CustomIconButtonProps>(
  ({ icon, ariaLabel, variant, size = 'md', className, disabled, ...props }, ref) => {
    const currentIconSize = ICON_SIZES[size] || 24;
    return (
      <button
        ref={ref}
        type={props.type || 'button'}
        aria-label={ariaLabel}
        disabled={disabled}
        className={cn(CustomIconButtonVariants({ variant, size }), className)}
        {...props}
      >
        <Image
          src={`/images/icons/common/${icon}.svg`}
          width={currentIconSize}
          height={currentIconSize}
          alt={`${ariaLabel}`}
        />
      </button>
    );
  }
);

CustomIconButton.displayName = 'CustomIconButton';
