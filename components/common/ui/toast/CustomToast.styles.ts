import { cva } from 'class-variance-authority';

export const CustomToastVariants = cva(
  [
    '[&_.ant-notification-notice-close]:!w-auto',
    '!w-full',
    'font-sans !text-xs text-white',
    '!rounded-lg',
  ].join(' '),
  {
    variants: {
      lines: {
        single: '!py-3 !px-4',
        multi: '!py-2 !px-4',
      },
      mode: {
        snackbar: [
          // 스낵바 배경색
          '!bg-black/80',

          // 닫기 버튼 위치
          '[&_.ant-notification-notice-close]:!top-1/2',
          '[&_.ant-notification-notice-close]:!-translate-y-1/2',
          '[&_.ant-notification-notice-close]:!right-4',
        ].join(' '),
        toast: [
          // 토스트 닫기 버튼 : 우측 상단 고정
          '[&_.ant-notification-notice-close]:!top-4',
          '[&_.ant-notification-notice-close]:!right-4',

          // 중앙 정렬 속성 무효화
          '[&_.ant-notification-notice-close]:!translate-y-0',
        ].join(' '),
      },
      theme: {
        // 기본 스낵바 색상
        default: '!bg-black/80',

        // TODO: 아래 color는 나중에 필요시 수정이 필요합니다.
        // 성공
        success: '!bg-system-success-500',
        // 위험
        warning: '!bg-system-warning-500',
        // 에러
        error: '!bg-system-error-500',
      },
    },
    defaultVariants: {
      lines: 'single',
      mode: 'snackbar',
      theme: 'default',
    },
  }
);
