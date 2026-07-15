import { cva } from 'class-variance-authority';

export const collapseVariants = cva('w-full', {
  variants: {
    variant: {
      default: [
        '[&_.ant-collapse-item]:border-b [&_.ant-collapse-item]:border-b-outline-200',
        '[&_.ant-collapse-header]:!px-0 [&_.ant-collapse-header]:!py-4',
        '[&_.ant-collapse-content-box]:!px-0 [&_.ant-collapse-content-box]:!pb-5',
      ],
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});
