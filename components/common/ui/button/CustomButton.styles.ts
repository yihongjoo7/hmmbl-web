import { cva, type VariantProps } from 'class-variance-authority';

export const CustomButtonStyles = cva(
  `!inline-flex !items-center !justify-center !rounded-lg !border !font-bold !gap-1 !transition-all !duration-200 !disabled:opacity-100 !shadow-none !whitespace-nowrap ![&_span]:leading-none`,
  {
    variants: {
      // 버튼 기본 스타일 정의
      variant: {
        primary: `!bg-primary-800 !text-white !border-transparent active:!bg-primary-900 active:!text-primary-50 disabled:!bg-primary-200 `,
        default: `!bg-white !text-font-700 !border-outline-500 active:!bg-bg-100 active:!text-font-900 active:!border-outline-600 disabled:!bg-white disabled:!text-font-300 disabled:!border-outline-300 !tracking-[-0.4px] `,
        text: ` !bg-transparent !text-font-700 !border-transparent active:!bg-bg-100 active:!text-font-800 disabled:!bg-transparent disabled:!text-font-300 !font-normal `,
        textPrimary: `!bg-transparent !text-primary-800 !border-transparent active:!bg-primary-50 active:!text-primary-900 active:!rounded-md disabled:!bg-transparent disabled:!text-primary-200 `,
        solid: `!h-7 !py-1 !bg-white !text-font-500 !border-transparent !rounded-full !text-xs active:!bg-white active:!text-font-500 [&.ant-btn_span]:!gap-0 [&.ant-btn_span_img]:w-5 [&.ant-btn_span_img]:h-5`,
        solidActive: `!h-7 !py-1 !bg-bg-900 !text-white !border-transparent !rounded-full !text-xs active:!bg-white active:!text-font-500 [&.ant-btn_span]:!gap-0 [&.ant-btn_span_img]:w-5 [&.ant-btn_span_img]:h-5 [&.ant-btn_span_img]:!brightness-0 [&.ant-btn_span_img]:invert`,
        ghost: `!pl-3 !pr-2 !py-0.5 !bg-transparent !text-font-700 !border-transparent !text-xs active:!bg-font-700 active:!text-font-700 active:!bg-transparent [&.ant-btn_span]:!gap-0 [&.ant-btn_span_img]:w-5 [&.ant-btn_span_img]:h-5`,
      },
      size: {
        xs: '!h-6 !p-[6px] !rounded-sm !text-[11px] !w-auto ',
        sm: '!h-8 !px-2 !py-1.5 !rounded-sm !text-xs !w-auto ',
        md: '!h-10 !p-3 !text-xs !min-w-[60px] !w-auto',
        lg: '!h-12 !py-[14px] !p-6 !text-sm w-full',
      },
    },
    // 조합 조건부 스타일
    compoundVariants: [
      {
        variant: 'primary',
        size: 'xs',
        class: '!bg-bg-800 active:!bg-bg-900 active:!text-font-100',
      },
      {
        variant: 'primary',
        size: 'sm',
        class: '!bg-bg-800 active:!bg-bg-900 active:!text-font-100',
      },
      {
        variant: 'primary',
        size: 'md',
        class: '!bg-primary-700 active:!bg-primary-800 active:!text-primary-100',
      },
      {
        variant: 'text',
        size: 'xs',
        class: '!h-6 !p-0',
      },
      {
        variant: 'text',
        size: 'sm',
        class: '!h-6 !p-0',
      },
      {
        variant: 'text',
        size: 'md',
        class: '!h-6 !p-0 !py-[4px] !font-bold',
      },
      {
        variant: 'text',
        size: 'lg',
        class: '!h-8 !p-0 !py-[6px]',
      },
      {
        variant: 'textPrimary',
        size: 'xs',
        class: '!h-6 !p-0',
      },
      {
        variant: 'textPrimary',
        size: 'sm',
        class: '!h-6 !p-0',
      },
      {
        variant: 'textPrimary',
        size: 'md',
        class: '!h-6 !p-0 !py-[4px]',
      },
      {
        variant: 'textPrimary',
        size: 'lg',
        class: '!h-8 !p-0 !py-[6px]',
      },
    ],
    // 기본 설정 값
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export type ButtonVariants = VariantProps<typeof CustomButtonStyles>;
