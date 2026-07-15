import { cva } from 'class-variance-authority';

export const FormTextareaFieldVariants = cva(
  [
    'w-full transition-colors bg-transparent [&_.ant-form-item-row]:gap-2',

    '[&_.ant-form-item-label]:!p-0 [&_.ant-form-item-label]:!mb-0',
    '[&_.ant-form-item-label_label]:text-title-l [&_.ant-form-item-label_label]:text-font-700 [&_.ant-form-item-label_label]:font-bold [&_.ant-form-item-label_label]:!h-auto',
    '[&_.ant-form-item-label_label::after]:content-none',

    // textarea.ant-input : textarea 자체
    '[&_textarea.ant-input]:border-outline-400 [&:not(.is-readonly):not(.ant-form-item-has-error):focus-within_textarea.ant-input]:!border-primary-700',
    '[&:not(.is-readonly):not(.ant-form-item-has-error)_.ant-input-affix-wrapper:focus-within]:!border-primary-700',
    '[&_textarea.ant-input]:!rounded-[8px] [&_textarea.ant-input]:px-[12px] [&_textarea.ant-input]:!bg-white',

    // error
    '[&.ant-form-item-has-error_textarea.ant-input]:!border-system-error-500',
    '[&_.ant-form-item-explain-error]:mt-1 [&_.ant-form-item-explain-error]:ml-4 [&_.ant-form-item-explain-error]:text-body-s [&_.ant-form-item-explain-error]:text-system-error-500',

    // readonly / disabled
    '[&.is-readonly_textarea.ant-input]:!bg-bg-200 [&.is-readonly_textarea.ant-input]:!text-font-700 [&.is-readonly_textarea.ant-input]:!border-outline-900 [&.is-disabled_textarea.ant-input]:!bg-bg-200  [&.is-disabled_textarea.ant-input]:!border-outline-400 ',

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
