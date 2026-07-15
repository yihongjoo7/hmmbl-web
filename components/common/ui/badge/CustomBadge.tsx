import { Tag as AntdTag } from 'antd';
import { VariantProps } from 'class-variance-authority';
import { badgeVariants } from './CustomBadge.styles';
import { HTMLAttributes } from 'react';
import * as React from 'react';

type AntdTagProps = React.ComponentProps<typeof AntdTag>;

export interface CustomBadgeProps
  extends
    Omit<AntdTagProps, 'color' | 'variant'>,
    Omit<VariantProps<typeof badgeVariants>, 'hasIcon'>,
    Omit<HTMLAttributes<HTMLSpanElement>, keyof AntdTagProps> {
  color: 'purple' | 'purpleLite' | 'green' | 'pink' | 'blue' | 'black' | 'gray' | 'quizCompleted';
  size: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const CustomBadge = ({
  className,
  color,
  size,
  children,
  icon,
  ...props
}: CustomBadgeProps) => {
  const hasIcon = !!icon;
  return (
    <AntdTag
      {...props}
      variant="filled"
      className={badgeVariants({ variant: color, size, hasIcon, className })}
    >
      {icon && <span className="inline-flex items-center justify-center">{icon}</span>}
      {children}
    </AntdTag>
  );
};
