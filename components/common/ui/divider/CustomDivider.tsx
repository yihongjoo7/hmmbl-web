'use client';
import { Divider } from 'antd';
import { dividerVariants } from './CustomDivider.styles';
import { cn } from '../lib/utils';
import { type VariantProps } from 'class-variance-authority';

export interface CustomDividerProps extends VariantProps<typeof dividerVariants> {
  className?: string;
  dashed?: boolean;
  height?: string; //선두께
  color?: string; // 선컬러
  style?: React.CSSProperties;
}

export const CustomDivider = ({
  variant,
  height,
  color,
  className,
  dashed = false,
  style,
  ...props
}: CustomDividerProps) => {
  return (
    <Divider
      dashed={dashed}
      {...props}
      style={{ height: height ? `${height}px` : undefined, background: color, ...style }}
      className={cn(dividerVariants({ variant }), className)}
    />
  );
};
