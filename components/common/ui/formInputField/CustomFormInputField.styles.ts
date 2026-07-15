import { cva } from 'class-variance-authority';

export const FormInputFieldVariants = cva(
  [
    'w-full transition-colors bg-transparent [&_.ant-form-item-row]:gap-2',

    '[&_.ant-form-item-label]:!p-0 [&_.ant-form-item-label]:!mb-0',
    'ant-form-item-label_label]:text-title-l [&_.ant-form-item-label_label]:text-font-700 [&_.ant-form-item-label_label]:font-bold [&_.ant-form-item-label_label]:!h-auto',
    '[&_.ant-form-item-label_label::after]:content-none',

    //ant-input-affix-wrapper : input 감싼 부분
    '[&_.ant-input-affix-wrapper]:p-0',
    '[&_.ant-input,&_.ant-input-affix-wrapper]:!border-outline-400 [&_.ant-input,&_.ant-input-affix-wrapper]:border-primary-700',
    '[&_.ant-input,&_.ant-input-affix-wrapper]:!rounded-lg [&_.ant-input-affix-wrapper]:!rounded-lg  [&_.ant-input-affix-wrapper]:px-[12px] [&_.ant-input,&_.ant-input-affix-wrapper]:!bg-white',

    // error
    '[&.ant-form-item-has-error_.ant-input,&.ant-form-item-has-error_.ant-input-affix-wrapper]:!border-system-error-500',
    '[&_.ant-form-item-explain-error]:mt-1 [&_.ant-form-item-explain-error]:ml-4 [&_.ant-form-item-explain-error]:text-body-s [&_.ant-form-item-explain-error]:text-system-error-500',

    '',
  ].join(' '),
  {
    variants: {
      size: {
        md: [
          '[&_.ant-input]:box-border',
          '[&_.ant-input]:text-xs',
          '[&_.ant-form-item-label_label]:mb-[6px]',
          '[&_.ant-form-item-label_label]:text-title-s',
        ].join(' '),
        lg: [
          '[&_.ant-input]:h-12',
          '[&_.ant-input]:text-sm',
          '[&_.ant-form-item-label_label]:mb-2',
          '[&_.ant-form-item-label_label]:text-title-m',
        ].join(' '),
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);
