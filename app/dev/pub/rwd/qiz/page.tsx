'use client';
import Img from '@/components/common/ui/image/Img';
import QuizLayout from './layout';
import QuizCard from '@/components/rwd/qiz/QuizCard';
import QuizToggle from '@/components/rwd/qiz/QuizToggle';
import QuizAd from '@/components/rwd/qiz/QuizAd';
import { IMG_QUIZ_PATH, MOCK_QUIZ_LIST, MOCK_QUIZ_PAGE } from './mock';

export default function QuizPage() {
  return (
    <div className="flex flex-col w-full h-dvh overflow-hidden text-font-800">
      <section role="quiz-header-point" className="shrink-0 px-6 pt-5 pb-10 bg-primary-50">
        <div className="flex items-top justify-between">
          <div className="flex flex-col items-start">
            <p className="pt-2">이번 달 퀴즈로 획득한 포인트</p>
            <div
              className="flex items-center justify-center gap-[2px]"
              onClick={() => alert('포인트 집계영역으로 이동')}
            >
              <Img src={`${IMG_QUIZ_PATH}/icon/ic_point_24.svg`} alt="point icon" />
              <span className="text-xl font-black text-primary-900">{MOCK_QUIZ_PAGE.point}</span>
              <Img
                src={`${IMG_QUIZ_PATH}/icon/ic_arrow_front_16.svg`}
                className="p-0.5"
                width={16}
                height={16}
                alt="arrow icon"
              />
            </div>
          </div>
          <Img src={`${IMG_QUIZ_PATH}/quiz-top-img.svg`} width={120} height={80} alt="icon point" />
        </div>
      </section>
      <QuizLayout>
        <section role="quiz-list" className="flex-1 overflow-y-auto">
          <ul>
            {MOCK_QUIZ_LIST.map((props, i) => (
              <QuizCard key={i} {...props} />
            ))}
          </ul>
        </section>
        <section role="quiz-bottom" className="shrink-0 w-full mb-[34px]">
          <QuizToggle />
          <QuizAd />
        </section>
      </QuizLayout>
    </div>
  );
}
