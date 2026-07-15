import { cva } from 'class-variance-authority';

export const DialogVariants = cva(
  [
    '[&_.ant-modal-content]:!p-[24px] [&_.ant-modal-content]:!pb-4 [&_.ant-modal-content]:!rounded-[20px]',
    '[&.ant-modal]:min-w-[calc(100%_-_48px)]',
    '[&_.ant-modal-header]:!m-0 [&_.ant-modal-title]:text-base/[22px] [&_.ant-modal-title]:text-left [&_.ant-modal-title]:text-font-900 [&_.ant-modal-title]:font-bold',
    '[&_.ant-modal-body]:text-sm/[22px] [&_.ant-modal-body]:text-font-700 [&_.ant-modal-body]:py-[12px]',
    '[&_.ant-modal-footer]:!mt-0 [&_.ant-modal-footer]:flex [&_.ant-modal-footer]:flex-col [&_.ant-modal-footer]:gap-2',
    '[&_.dialog-action-button]:px-[8px] [&_.dialog-action-button]:py-[6px] [&_.dialog-action-button]:text-sm',
    '[&_.dialog-action-row]:flex [&_.dialog-action-row]:justify-end [&_.dialog-action-row]:gap-2',
    '[&_.dialog-action-row_.dialog-action-button:first-child]:text-font-800 [&_.dialog-action-row_.dialog-action-button:last-child]:text-primary-800',
  ].join(' ')
);
