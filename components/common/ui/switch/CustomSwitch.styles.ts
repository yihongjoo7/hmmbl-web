import { cva } from 'class-variance-authority';

export const SwitchVariants = cva(
  [
    // 기본
    '[&.ant-switch]:!bg-bg-600',
    '[&.ant-switch.ant-switch-checked]:!bg-primary-700',
    // 비활성화
    '[&.ant-switch.ant-switch-disabled]:!bg-bg-300',
    '[&.ant-switch.ant-switch-checked.ant-switch-disabled]:!bg-primary-200',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  }
);
