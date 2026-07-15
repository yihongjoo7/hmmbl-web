import { cva } from 'class-variance-authority';

export const commentItemVariants = cva(
  'flex items-center gap-2 border border-outline-400 rounded-md w-full py-3 px-4 bg-white focus-within:border-primary-700',
  {
    variants: {},
    defaultVariants: {},
  }
);
