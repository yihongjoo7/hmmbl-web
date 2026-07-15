import React from 'react';
import { Input as AntdInput, type InputProps as AntdInputProps } from 'antd';
import { VariantProps } from 'class-variance-authority';
import { InputVariants } from './CustomInput.styles';

export interface CustomInputProps
  extends Omit<AntdInputProps, 'size'>, VariantProps<typeof InputVariants> {
  readOnly?: boolean;
}

export const CustomInput = ({
  size,
  className,
  placeholder,
  readOnly,
  disabled,
  value,
  ...props
}: CustomInputProps) => {
  const combinedClassName = InputVariants({
    size,
    className,
  });

  const stateClassName = [
    readOnly && 'pointer-events-none select-none is-readonly',
    disabled && 'is-disabled',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <AntdInput
      allowClear={{ clearIcon: <img src="/images/icons/common/btn_clear.svg" alt="삭제" /> }}
      className={`${combinedClassName} ${stateClassName}`}
      placeholder={readOnly ? '' : placeholder}
      value={value}
      readOnly={readOnly}
      disabled={disabled}
      {...props}
    />
  );
};
