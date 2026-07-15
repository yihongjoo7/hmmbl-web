import { cva } from 'class-variance-authority';

export const radiobuttonVariants = cva(
  'inline-flex items-center justify-center font-normal cursor-pointer select-none ',
  {
    variants: {
      variant: {
        default: [
          // 기본
          '[&.ant-radio-wrapper_.ant-radio]:border-outline-400',
          '[&.ant-radio-wrapper:not(.ant-radio-wrapper-disabled):hover_.ant-radio]:!border-primary-700',
          '[&_.radio-content]:text-font-700',

          // checked
          '[&.ant-radio-wrapper-checked]:text-font-700',
          '[&.ant-radio-wrapper-checked_.ant-radio]:!border-primary-700',
          '[&.ant-radio-wrapper-checked_.ant-radio]:!bg-primary-700',
          '[&.ant-radio-wrapper-checked_.ant-radio:after]:bg-white [&.ant-radio-wrapper-checked_.ant-radio:after]:w-[0.625rem] [&.ant-radio-wrapper-checked_.ant-radio:after]:h-[0.625rem]',

          // disabled
          '[&.ant-radio-wrapper-disabled_.ant-radio]:!border-outline-400',
          '[&.ant-radio-wrapper-disabled_.ant-radio]:!bg-100',
          '[&.ant-radio-wrapper-disabled:hover_.ant-radio]:!border-outline-400',

          // disabled + checked
          '[&.ant-radio-wrapper-checked.ant-radio-wrapper-disabled_.ant-radio]:!border-primary-100',
          '[&.ant-radio-wrapper-checked.ant-radio-wrapper-disabled_.ant-radio]:!bg-primary-100',
          '[&.ant-radio-wrapper-checked.ant-radio-wrapper-disabled_.ant-radio:after]:!bg-white',
        ],

        chip: [
          '[&_.ant-radio]:min-h-[28px]',
          'px-2.5 py-[5px] rounded-[1000px] border border-outline-300 bg-white text-font-800 transition-colors font-bold ',
          '[&.ant-radio-wrapper-checked]:bg-bg-800 [&.ant-radio-wrapper-checked]:border-bg-800 [&.ant-radio-wrapper-checked]:text-white',
          '[&.ant-radio-wrapper_.ant-radio-label]:w-full [&.ant-radio-wrapper_.ant-radio-label]:text-center',
          '[&.ant-radio-wrapper_.ant-radio-label_.radio-content]:block',
          '[&_.radio-content]:p-0',

          '[&_.ant-radio]:hidden',
          '[&_.radio-content]:p-0 [&_.radio-content]:flex [&_.radio-content]:items-center [&_.radio-content]:gap-x-1',
          '[&_.radio-content_svg]:w-4 [&_.radio-content_svg]:h-4',

          '[&.ant-radio-wrapper-disabled]:bg-outline-200',
        ],
      },
      size: {
        md: '[&_.ant-radio]:!w-4 [&_.ant-radio]:!h-4 [&_.radio-content]:text-xs',
        lg: '[&_.ant-radio]:!w-5 [&_.ant-radio]:!h-5 [&_.radio-content]:text-sm',
      },
      vertical: {
        true: 'w-full !justify-start',
        false: '',
      },
    },

    // 조합 조건부 스타일
    compoundVariants: [
      {
        variant: 'chip',
        class: '[&_.radio-content]:text-xs',
      },
    ],

    defaultVariants: {
      variant: 'default',
      size: 'lg',
      vertical: false,
    },
  }
);
