import { cva } from 'class-variance-authority';

export const AnswerTrueFalseVariants = cva(
  [
    'group', // group 클래스 : 상태를 자식에게 전달 가능
    'flex flex-1 items-center justify-center',
    'min-w-[50%] min-h-[100px] min- py-5 ',
    'border rounded-lg',

    // 라디오 아이콘 숨김
    '[&_.ant-radio]:!hidden [&_.ant-radio+span]:!pl-0',
    '[&>span:last-child]:!w-full',
    '[&>span:last-child]:!flex',
    '[&>span:last-child]:!justify-center',
  ].join(' '),
  {
    variants: {
      checked: {
        true: 'border border-primary-700 bg-primary-50',
        false: [
          'border border-outline-300 bg-white',
          'active:border-outline-400 active:bg-bg-100',
        ].join(' '),
      },
    },
    defaultVariants: {
      checked: false,
    },
  }
);
