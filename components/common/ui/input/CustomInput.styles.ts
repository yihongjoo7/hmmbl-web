import { cva } from 'class-variance-authority';

export const InputVariants = cva(
  [
    'bg-white',
    'border border-outline-400 rounded-[4px]',
    // focus, shadow 제거
    'focus-within:!border-primary-700 focus-within:!shadow-none',
    '[&_.ant-input:focus]:!shadow-none [&_.ant-input-focused]:!shadow-none',
    '[&_.ant-input-affix-wrapper:focus]:!shadow-none [&_.ant-input-affix-wrapper]:!rounded-lg [&_.ant-input-affix-wrapper-focused]:!shadow-none',
    '[&_input:focus]:shadow-none [&_input:focus]:outline-none',

    //basic style
    'bg-white border border-outline-400 rounded-[4px]',
    '[&_.ant-input]:text-font-700 [&_.ant-input]:bg-white',
    'focus-within:!border-primary-700 focus-within:!shadow-none focus-within:!outline-transparent ',
    '[&_input]:placeholder-font-300',
    '[&_.ant-input-clear-icon]:ml-0 [&_.ant-input-clear-icon]:py-[2px] [&_.ant-input-clear-icon]:px-[0]',

    //disabled
    '[&.is-disabled]:!bg-bg-200 [&.is-disabled_input]:!text-font-300 [&.is-disabled]:opacity-100',

    //readonly
    '[&.is-readonly]:!bg-bg-200 [&.is-readonly_input]:!text-font-700 [&.is-readonly_input]:opacity-100',
  ].join(' '),
  {
    variants: {
      size: {
        md: 'h-10 px4 py-[8px] [&_.ant-input]:text-xs',
        lg: 'h-12 px4 py-[12px] [&_.ant-input]:text-sm',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);
