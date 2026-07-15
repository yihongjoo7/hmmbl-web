import { cva } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center justify-center font-sans font-bold whitespace-nowrap box-border custom-badge tracking-[-0.48px]',
  {
    variants: {
      variant: {
        purple: ['text-primary-700 bg-primary-50'],
        purpleLite: ['text-primary-500 bg-primary-50'],
        green: ['text-secondary-dim50 bg-secondary-dim10'],
        pink: ['text-tertiary-900 bg-tertiary-50'],
        blue: ['text-indigo-700 bg-indigo-50'],
        black: ['text-font-700 bg-bg-200'],
        gray: ['text-font-200 bg-bg-100'],

        // quiz에서만 사용되는 뱃지 색상
        quizCompleted: ['text-white bg-black/40'],
      },
      size: {
        sm: 'rounded-sm min-w-[41px] min-h-4 py-[3px] px-1 text-title-xxs',
        md: 'rounded-sm min-w-[56px] min-h-[20px] py-[4px] px-2 text-title-xs',
        lg: 'rounded-md min-w-[63px] min-h-[24px] py-[7px] px-2.5 text-title-s',
      },
      hasIcon: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'purple',
      size: 'md',
    },
    compoundVariants: [
      {
        size: 'sm',
        hasIcon: true,
        className: '!gap-[2px] !shrink-0 !pl-1',
      },
      {
        size: 'md',
        hasIcon: true,
        className: '!gap-[2px] !shrink-0 !pl-1.5 !pr-2.5 !text-[0.69rem]',
      },
      {
        size: 'lg',
        hasIcon: true,
        className: '!gap-[2px] !shrink-0 !pl-1.5 !pr-3 !text-xs',
      },
      {
        variant: 'gray',
        size: 'lg',
        className: 'border border-outline-200',
      },
    ],
  }
);
