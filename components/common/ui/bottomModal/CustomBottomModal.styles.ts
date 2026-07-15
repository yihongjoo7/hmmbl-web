import { cva } from 'class-variance-authority';

export const BottomModalOverlayVariants = cva('fixed inset-0 z-40 bg-black/40');

export const BottomModalContentVariants = cva(
  'fixed inset-x-0 bottom-0 z-50 flex flex-col max-h-[90vh] rounded-t-4 bg-white outline-none'
);
