'use client';
/*--------------------------------------------------------------------------------------------------------------------------
##  CustomButton.jsx
##  button custom
---------------------------------------------------------------------------------------------------------------------------*/

import { Button as AntdButton, type ButtonProps as AntdButtonProps } from 'antd';
import * as React from 'react';
import { CustomButtonStyles, type ButtonVariants } from './CustomButton.styles';
import { cn } from '../lib/utils';
import Image from 'next/image';

// html 기본 버튼 속성과 cva에서 추론된 타입을 결합한다.
export interface CustomButtonProps
  extends Omit<AntdButtonProps, 'size' | 'color' | 'loading' | 'variant'>, ButtonVariants {
  children?: React.ReactNode;
  leftIcon?: any;
  rightIcon?: any;
  fullRadius?: boolean;
  loading?: boolean;
}

export function CustomButton({
  className,
  variant,
  size,
  children,
  leftIcon,
  rightIcon,
  fullRadius = false,
  loading,
  disabled,
  onClick,
  ...props
}: CustomButtonProps) {
  return (
    <AntdButton
      type="text"
      disabled={disabled || loading}
      className={cn(CustomButtonStyles({ variant, size }), fullRadius && 'rounded-full', className)}
      onClick={onClick}
      {...props}
    >
      <span
        className={`inline-flex items-center justify-center h-full pointer-events-none ${['xs', 'sm', 'md'].includes(size ?? 'md') ? 'gap-2' : 'gap-1'}`}
      >
        {leftIcon && (
          <Image src={`/images/icons/common/${leftIcon}.svg`} alt="icon" width={16} height={16} />
        )}
        {children}
        {rightIcon && (
          <Image src={`/images/icons/common/${rightIcon}.svg`} alt="icon" width={16} height={16} />
        )}
      </span>
    </AntdButton>
  );
}
