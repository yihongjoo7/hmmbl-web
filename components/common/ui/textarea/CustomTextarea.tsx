import React from 'react';
import { Input as AntdInput } from 'antd';
import { VariantProps } from 'class-variance-authority';
import { TextareaVariants } from './CustomTextarea.styles';

export interface CustomTextareaProps
  extends Omit<React.ComponentProps<typeof AntdInput.TextArea>, 'size'>,
    VariantProps<typeof TextareaVariants> {}

export const CustomTextarea = ({ className, size, ...props }: CustomTextareaProps) => {
  const combinedClassName = TextareaVariants({
    size,
    className,
  });
  return <AntdInput.TextArea className={combinedClassName} {...props} />;
};
