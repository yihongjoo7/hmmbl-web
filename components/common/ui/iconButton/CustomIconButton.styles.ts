import { cva, type VariantProps } from 'class-variance-authority';

export const CustomIconButtonVariants = cva(
  `custom-iconbutton inline-flex items-center justify-center font-normal cursor-pointer select-none transition-all duration-200 disabled:opacity-100 disabled:cursor-not-allowed border rounded-full`,
  {
    variants: {
      variant: {
        // 1. Icon Only 타입 (배경/테두리 없음, 아이콘 자체만 노출)
        default: `
          bg-transparent text-[#49494A] border-transparent 
          active:bg-[#F8F9FC] active:text-[#303131] 
          disabled:bg-transparent disabled:text-[#AAABAE]
        `,
        // 2. Fill 타입 (메인 보라색 배경 + 흰색 아이콘)
        fill: `
          bg-[#F4F5F8] text-[#48484B] border-transparent 
          active:bg-[#6E23F0] active:text-[#EBDFFD] 
          disabled:bg-[#E0CFFC] disabled:text-[#ffffff]
        `,
        // 3. Outline 타입 (흰색 배경 + 회색 테두리 + 어두운 아이콘)
        outline: `
          bg-[#ffffff]  border-[#E2E2E4] 
          active:bg-[#F8F9FC] active:text-[#000000] active:border-[#B8B8C5] 
          disabled:bg-[#FFFFFF] disabled:text-[#AAABAE] disabled:border-[#E2E2E4]
        `,
      },
      size: {
        xs: 'h-5 w-5 text-xs', // 20px 12px
        sm: 'h-6 w-6 text-base', // 24px 16px
        md: 'h-10 w-10 text-2xl', // 40px 24px
        lg: 'h-[60px] w-[60px] text-[32px]', // 60px, 32px은 기본/커스텀 스케일에 없어 arbitrary value 유지 필요
      },
    },

    // 기본 설정 값
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export type IconButtonVariants = VariantProps<typeof CustomIconButtonVariants>;
