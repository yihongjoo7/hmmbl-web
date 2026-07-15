import { cva } from 'class-variance-authority';

export const CapsuleTabsVariants = cva('w-full');

export const capsuleTabButtonVariants = cva(
  'flex-1 rounded-full border border-outline-300 bg-bg-0 text-font-800 text-xs py-1.5 transition-colors disabled:opacity-50',
  {
    variants: {
      active: {
        true: '!bg-primary-700 !text-white !border-primary-700',
        false: '',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);
