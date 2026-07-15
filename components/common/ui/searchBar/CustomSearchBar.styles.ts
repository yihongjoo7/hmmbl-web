import { cva } from 'class-variance-authority';

export const SearchBarVariants = cva(
  'p-[1px] rounded-full text-xs border border-outline-300 bg-white',
  {
    variants: {
      variant: {
        default: [
          '[&_.ant-input-affix-wrapper]:h-12 [&_.ant-input-affix-wrapper]:py-0 [&_.ant-input-affix-wrapper]:rounded-full [&_.ant-input-affix-wrapper]:!border-transparent [&_.ant-input-affix-wrapper]:pl-[20px] [&_.ant-input-affix-wrapper]:pr-[3px] [&_.ant-input-affix-wrapper]:shadow-none',
          '[&_.ant-input-affix-wrapper-focused]:!shadow-none',
          '[&_input]:text-sm [&_input::placeholder]:text-font-300',
          '[&_.search-bar-icon-btn]:flex [&_.search-bar-icon-btn]:items-center [&_.search-bar-icon-btn]:justify-center [&_.search-bar-icon-btn]:w-[40px] [&_.search-bar-icon-btn]:h-[40px]',
          '[&_.search-bar-icon-btn]:bg-bg-900 [&_.search-bar-icon-btn]:rounded-full [&_.search-bar-icon-btn]:cursor-pointer',
          '[&_.search-bar-icon-btn_svg]:text-white [&_.search-bar-icon-btn_svg]:w-[18px] [&_.search-bar-icon-btn_svg]:h-[18px]',
          '[&_.ant-input-affix-wrapper:not(.ant-input-affix-wrapper-focused)_.ant-input-clear-icon]:hidden',
        ],
      },
      hasValue: {
        true: '',
        false: '',
      },
      isFocused: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
    compoundVariants: [
      {
        hasValue: true,
        isFocused: false,
        className: '[&_.ant-input-affix-wrapper]:!border-outline-800',
      },
    ],
  }
);
