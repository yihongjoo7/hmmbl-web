import { cva } from 'class-variance-authority';

export const TextareaVariants = cva(
  [
    // focus, shadow 제거
    'focus-within:!shadow-none [&_textarea.ant-input:focus]:!shadow-none [&_textarea.ant-input-focused]:!shadow-none [&_textarea.ant-input-focused]:!border-primary-500 [&_textarea.ant-input:focus]:!border-primary-500',
    '[&.ant-input-affix-wrapper:focus-within]:!border-primary-700 [&.ant-input-affix-wrapper-focused]:!border-primary-700 [&.ant-input-affix-wrapper]:rounded-2',

    // 기본 basic style
    '[&_.ant-input-textarea]:after:text-sm',
    '[&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:placeholder-font-300 [&_textarea]:placeholder-text-title-s  [&_textarea]:font-normal [&_textarea::placeholder]:text-font-700 [&_textarea]:h-full [&_textarea::placeholder]:font-normal ',
    //focus-within:!border-primary-700

    'relative px-3 py-2 border border-outline-400 rounded-lg bg-white text-title-s',
  ].join(' '),
  {
    variants: {
      size: {
        md: '[&_textarea.ant-input]:text-xs',
        lg: '[&_textarea.ant-input]:text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);
