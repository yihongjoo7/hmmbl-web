import { cva, type VariantProps } from 'class-variance-authority';

export const dividerVariants = cva('w-full m-0', {
  variants: {
    variant: {
      thick: 'h-[8px] bg-gray-100',
      thin: 'h-[1px] bg-gray-200',
    },
  },
  defaultVariants: {
    variant: 'thin',
  },
});
export type DividerVariants = VariantProps<typeof dividerVariants>;
