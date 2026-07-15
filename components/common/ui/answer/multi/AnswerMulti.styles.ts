import { cva } from 'class-variance-authority';

export const AnswerMultiVariants = cva(
  [
    'flex items-center w-full py-3.5 px-4',
    'border rounded-lg cursor-pointer',
    'font-sans text-title-l text-font-600',
    'active:!border-outline-500 active:!bg-bg-100',
    '[&>span:last-child]:!w-full',
    '[&>span:last-child]:!flex [&>span:last-child]:!items-center',
  ].join(' '),
  {
    variants: {
      checked: {
        true: '',
        false: '',
      },
      hasIcon: {
        true: '',
        false: [
          '[&_.ant-radio]:!hidden [&_.ant-radio+span]:!pl-0',
          '[&_.ant-checkbox]:!hidden [&_.ant-checkbox+span]:!pl-0',
        ].join(' '),
      },
      disabled: {
        true: '!cursor-not-allowed !pointer-events-none',
        false: 'cursor-pointer active:!border-outline-500 active:!bg-bg-100',
      },
    },
    compoundVariants: [
      {
        disabled: false,
        checked: false,
        class: ['!border-outline-300 !bg-white', '[&>span:last-child]:!text-font-600'].join(' '),
      },
      {
        disabled: false,
        checked: true,
        class: [
          '!border-primary-700 !bg-primary-50',
          '[&>span:last-child]:!text-primary-800',
          // '[&_.ant-checkbox-checked]:!border-primary-700',
        ].join(' '),
      },
      {
        disabled: true,
        checked: false,
        class: [
          '!text-font-200 !border-outline-200 !bg-white',
          '[&>span:last-child]:!text-font-200',
        ].join(' '),
      },
      {
        disabled: true,
        checked: true,
        class: [
          '!text-primary-400 !border-primary-400 !bg-primary-50',
          '[&>span:last-child]:!text-primary-400',
          '[&_.ant-checkbox-checked_.ant-checkbox-inner::after]:!border-primary-400',
        ].join(' '),
      },
    ],
    defaultVariants: {
      checked: false,
      hasIcon: false,
    },
  }
);
