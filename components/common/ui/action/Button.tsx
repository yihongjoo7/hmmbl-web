'use client';
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Spinner } from '../display/Spinner';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type Size    = 'sm' | 'md' | 'lg';

const variantClass: Record<Variant, string> = {
  primary:   'bg-primary text-text-inverse hover:bg-primary-hover',
  secondary: 'bg-bg-tertiary text-text-secondary hover:bg-bg-hover',
  danger:    'bg-error text-text-inverse hover:bg-error-hover',
  ghost:     'bg-transparent text-text-secondary hover:bg-bg-tertiary',
  outline:   'bg-bg-primary text-text-secondary border border-border-default hover:bg-bg-secondary',
};
const sizeClass: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};
const iconGap: Record<Size, string> = {
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:   Variant;
  size?:      Size;
  /** @deprecated use isLoading */
  loading?:   boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?:  ReactNode;
  rightIcon?: ReactNode;
  children:   ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  isLoading,
  fullWidth,
  leftIcon,
  rightIcon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const busy = loading || isLoading;
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantClass[variant]} ${sizeClass[size]} ${iconGap[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}`}
      disabled={busy || props.disabled}
      {...props}
    >
      {busy
        ? <Spinner size="sm" />
        : leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      }
      {children}
      {!busy && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
}
