import { CustomBadgeProps } from '@/components/common/ui';
import { QuizCardProps } from '@/components/rwd/qiz/QuizCard';

export const IMG_QUIZ_PATH = '/quiz';
export const QUIZ_CLOSED_SUBTEXT = '퀴즈가 종료되었어요.';
export const QUIZ_TOAST_COMMENT = {
  quizEnd: '해당 퀴즈가 종료되어 참여할 수 없습니다. 다른 퀴즈에 참여해보세요.',
  quizComplete: '이미 참여 완료한 퀴즈입니다.',
  quizAlarm: '이제 퀴즈 시작 알림을 받을 수 있어요.',
};

export const MOCK_QUIZ_PAGE = {
  point: '1,000',
};

export const MOCK_QUIZ_LIST: QuizCardProps[] = [
  {
    contents: {
      thumbImg: {
        src: `${IMG_QUIZ_PATH}/thumb-hyundai.svg`,
        width: 48,
        height: 48,
        alt: 'thumb 이미지',
      },
      badge: { color: 'pink', size: 'sm', children: 'TODAY' },
      title: '현대백화점 Hi 퀴즈 퀴즈 2줄 케이스',
      subText: '22,400,120포인트 남았습니다.',
    },
    point: {
      badge: { color: 'purple', size: 'lg', children: '최대 7P' },
    },
    status: 'OPEN',
  },
  {
    contents: {
      thumbImg: {
        src: `${IMG_QUIZ_PATH}/thumb-hyundai.svg`,
      },
      badge: { color: 'green', size: 'sm', children: 'BONUS' },
      title: '현대백화점 Hi 퀴즈',
      subText: '5월 17일 10시 오픈',
    },
    point: {
      badge: { color: 'purple', size: 'lg', children: '최대 10P' },
    },
    status: 'UPCOMIMG',
  },
  {
    contents: {
      thumbImg: {
        src: `${IMG_QUIZ_PATH}/thumb-hyundai.svg`,
      },
      badge: { color: 'blue', size: 'sm', children: 'LIMITED' },
      title: '현대백화점 Hi 퀴즈 퀴즈 2줄 케이스',
      subText: '5월 17일 10시 오픈',
    },
    point: {
      badge: { color: 'purple', size: 'lg', children: '최대 100P' },
    },
    status: 'UPCOMIMG',
  },
  {
    contents: {
      thumbImg: {
        src: `${IMG_QUIZ_PATH}/thumb-hmall.svg`,
      },
      badge: { color: 'gray', size: 'sm', children: 'TODAY' },
      title: '현대백화점 Hi 퀴즈 퀴즈 2줄 케이스',
      subText: '5월 17일 10시 오픈',
    },
    point: {
      badge: { color: 'quizCompleted', size: 'lg', children: '2P 획득' },
    },
    status: 'COMPLETED',
  },
  {
    contents: {
      thumbImg: {
        src: `${IMG_QUIZ_PATH}/thumb-hfasion.svg`,
      },
      badge: { color: 'gray', size: 'sm', children: 'BONUS' },
      title: '현대백화점 Hi 퀴즈 퀴즈 2줄 케이스',
      subText: '5월 17일 10시 오픈',
    },
    status: 'CLOSED',
  },
];
