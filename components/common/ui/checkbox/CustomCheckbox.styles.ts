import { cva } from 'class-variance-authority';

export const checkboxVariants = cva(
  'custom-checkbox inline-flex items-center justify-center font-normal cursor-pointer select-none [&.ant-checkbox-wrapper]:px-2.5 [&.ant-checkbox-wrapper]:items-center border-none',
  {
    variants: {
      variant: {
        default: [
          'border-none',
          '[&.ant-checkbox-wrapper:hover:not(.ant-checkbox-wrapper-disabled)_.ant-checkbox]:!border-primary-500',

          '[&_.ant-checkbox]:flex [&_.ant-checkbox]:items-center [&_.ant-checkbox]:justify-center',
          '[&_.ant-checkbox]:border [&_.ant-checkbox]:border-outline-400 [&_.ant-checkbox]:rounded-sm',
          '[&_.ant-checkbox]:transition-colors',

          // checked
          '[&_.ant-checkbox-checked]:!bg-primary-700 [&_.ant-checkbox-checked]:!border-primary-700 [&_.ant-checkbox-checked:after]:absolute ',
          '[&_.ant-checkbox-checked]:!flex [&_.ant-checkbox-checked]:!items-center [&_.ant-checkbox-checked]:!justify-center [&_.ant-checkbox-checked]:!w-full [&_.ant-checkbox-checked]:!h-full',
          '[&_.ant-checkbox-checked_svg]:!stroke-white [&_.ant-checkbox-checked_svg]:!text-white [&_.ant-checkbox-checked_svg]:!block [&_.ant-checkbox-checked_svg]:!w-[60%] [&_.ant-checkbox-checked_svg]:!h-[60%]',
          // disabled
          '[&_.ant-checkbox-disabled.ant-checkbox-checked]:!bg-bg-200 ',
          '[&.ant-checkbox-wrapper-disabled:hover]:bg-transparent ',
          // checked + disabled
          '[&_.ant-checkbox-disabled.ant-checkbox-checked]:!bg-primary-100 [&_.ant-checkbox-disabled.ant-checkbox-checked]:!border-primary-100 [&_.ant-checkbox-disabled.ant-checkbox-checked:after]:border-primary-300',
          '[&_.ant-checkbox-label]:text-title-m [&_.ant-checkbox-label]:text-font-700',
        ],
        ghost: [
          '[&_.ant-checkbox]:!bg-transparent [&_.ant-checkbox]:!border-none [&_.ant-checkbox]:!p-0 [&_.ant-checkbox]:!shadow-none',
          '[&_.ant-checkbox:after]:!w-[6px] [&_.ant-checkbox:after]:!h-[9px] [&_.ant-checkbox:after]:left-[5px] [&_.ant-checkbox:after]:top-[2px]',
          '[&_.ant-checkbox:after]:border-outline-300 [&_.ant-checkbox:after]:!opacity-100 [&_.ant-checkbox:after]:!visible [&_.ant-checkbox:after]:!scale-100 [&_.ant-checkbox:after]:!rotate-45',
          '[&_.ant-checkbox-checked:after]:!border-primary-700 [&_.ant-checkbox-checked:after]:!left-[5px] [&_.ant-checkbox-checked:after]:!top-[2px]',
          '[&_.ant-checkbox-disabled:after]:!border-icon-200',
          '[&_.ant-checkbox-checked.ant-checkbox-disabled:after]:!border-primary-300',
          '[&_.ant-checkbox-inner::after]:!hidden [&_.ant-checkbox-inner]:!shadow-none [&_css-wave]:!hidden [&_.ant-wave]:!hidden',
        ],
        chip: [
          'px-2.5 py-[5px] rounded-[1000px] border border-outline-300 bg-white text-font-800 transition-colors',
          // checked
          '[&.ant-checkbox-wrapper-checked]:!bg-bg-800 [&.ant-checkbox-wrapper-checked]:!border-bg-bg-800 [&.ant-checkbox-wrapper-checked_.checkbox-content]:!text-white',
          '[&.ant-checkbox-wrapper-checked_img]:brightness-0 [&.ant-checkbox-wrapper-checked_img]:!invert',
          '[&.ant-checkbox-wrapper-checked_svg]:!stroke-white [&.ant-checkbox-wrapper-checked_svg]:!fill-white',

          '[&_.ant-checkbox-label]:!p-0 [&_.ant-checkbox-label]:!flex [&_.ant-checkbox-label]:!items-center [&_.ant-checkbox-label]:!gap-x-1',
          '[&_.ant-checkbox]:!hidden',
          '[&_.ant-checkbox-label_svg]:!w-4 [&_.ant-checkbox-label_svg]:!h-4 [&_.ant-checkbox-label_svg]:!shrink-0',

          '[&_.ant-checkbox-label>.checkbox-content]:flex-1',

          // disabled
          '[&.ant-checkbox-wrapper-disabled]:!bg-bg-purple-100 [&.ant-checkbox-wrapper-disabled]:!border-outline-200 [&.ant-checkbox-wrapper-disabled_.checkbox-content]:!text-font-200',
          '[&.ant-checkbox-wrapper-disabled_svg]:!stroke-icon-300 [&.ant-checkbox-wrapper-disabled_svg]:!fill-icon-300',
          '[&.ant-checkbox-wrapper-disabled_img]:!opacity-30',

          // checked + disabled
          '[&.ant-checkbox-wrapper-checked.ant-checkbox-wrapper-disabled_.checkbox-content]:!text-font-200',
          '[&.ant-checkbox-wrapper-checked.ant-checkbox-wrapper-disabled_img]:!filter-none [&.ant-checkbox-wrapper-checked.ant-checkbox-wrapper-disabled_img]:!opacity-30',
          '[&.ant-checkbox-wrapper-checked.ant-checkbox-wrapper-disabled_svg]:!stroke-icon-300 [&.ant-checkbox-wrapper-checked.ant-checkbox-wrapper-disabled_svg]:!fill-icon-300',
        ],
      },
      size: {
        sm: '[&_.ant-checkbox]:!w-3.5 [&_.ant-checkbox]:!h-3.5 [&_.ant-checkbox-label]:text-title-s [&_.ant-checkbox-label]:text-font-700  [&_.ant-checkbox-checked:after]:w-[4px] [&_.ant-checkbox-checked:after]:h-[6px] [&_.ant-checkbox-checked:after]:left-[4px] [&_.ant-checkbox-checked:after]:top-[6px]',
        md: '[&_.ant-checkbox]:!w-[20px] [&_.ant-checkbox]:!h-[20px] [&_.ant-checkbox-label]:text-title-m [&_.ant-checkbox-label]:text-font-700 [&_.ant-checkbox-checked:after]:w-[5px] [&_.ant-checkbox-checked:after]:h-[8px]  [&_.ant-checkbox-checked:after]:left-[5px] [&_.ant-checkbox-checked:after]:top-[8px]',
        lg: '[&_.ant-checkbox]:!w-[22px] [&_.ant-checkbox]:!h-[22px] [&_.ant-checkbox-label]:text-title-l [&_.ant-checkbox-label]:text-font-800 [&_.ant-checkbox-checked:after]:left-[6px] [&_.ant-checkbox-checked:after]:top-[9px] ',
      },
    },
    compoundVariants: [
      {
        variant: 'chip',
        class: '[&_.ant-checkbox-label]:!text-xs',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size: 'lg',
    },
  }
);

export const checkboxGroupVariants = cva('!flex !flex-wrap !gap-4', {
  variants: {
    vertical: {
      true: '!flex-col !items-start !gap-y-1',
      false: '!flex-row !items-center',
    },
  },
  defaultVariants: {
    vertical: false,
  },
});
