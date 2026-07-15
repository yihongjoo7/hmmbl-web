import { cva } from 'class-variance-authority';

export const selectionVariants = cva(
  '[&.custom-checkbox]:py-[8px] [&.custom-checkbox]:w-full [&.custom-checkbox]:justify-start',
  {
    variants: {
      variant: {
        single: [
          '[&_.ant-checkbox]:!rounded-full',
          '[&_.ant-checkbox]:border',
          '[&_.ant-checkbox]:!border-outline-600',
          '[&_.ant-checkbox.ant-checkbox-checked]:!border-[5px]',
          '[&_.ant-checkbox.ant-checkbox-checked]:!bg-white',
          '[&_.ant-checkbox.ant-checkbox-checked]:after:hidden',
        ].join(' '),
        multiple: [''],
      },
    },
    defaultVariants: {
      variant: 'single',
    },
  }
);
