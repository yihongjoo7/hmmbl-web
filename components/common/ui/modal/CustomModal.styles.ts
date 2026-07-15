import { cva } from 'class-variance-authority';

export const ModalVariants = cva(
  [
    '[&_.ant-modal-body]:min-h-[338px] ',
    '[&_.ant-modal-content]:flex [&_.ant-modal-content]:flex-col',
    '[&_.ant-modal-content]:!p-6 [&_.ant-modal-content]:!pt-[32px] [&_.ant-modal-content]:!pb-[20px] [&_.ant-modal-content]:!rounded-[20px]',
    '[&.ant-modal]:min-w-[calc(100%_-_48px)]',
    '[&_.ant-checkbox]:!bg-white [&_.ant-checkbox-wrapper-checked_.checkbox-content]:text-white [&_.ant-checkbox-wrapper-checked_.checkbox-content]:font-normal',
  ].join(' ')
);
