import { cva } from 'class-variance-authority';

export const PopupVariants = cva(
  ['[&_.ant-drawer-body]:min-h-[40vh]', '[&_.ant-drawer-content]:rounded-t4'].join(' ')
);
