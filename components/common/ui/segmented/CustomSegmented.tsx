import React from 'react';
import { Segmented as AntdSegmented } from 'antd';
import { VariantProps } from 'class-variance-authority';
import { segmentedVariants } from './CustomSegmented.styles';

export interface SegmentedItem {
  label: React.ReactNode;
  value: string;
}

type AntdSegmentedProps = React.ComponentProps<typeof AntdSegmented>;

export interface CustomSegmentedProps
  extends Omit<AntdSegmentedProps, 'children' | 'options'>, VariantProps<typeof segmentedVariants> {
  options: SegmentedItem[];
}

export const CustomSegmented = ({ options, className, ...props }: CustomSegmentedProps) => {
  const combinedClassName = segmentedVariants({ className });
  return <AntdSegmented options={options} className={combinedClassName} {...props} />;
};
