'use client';
import { QUIZ_CLOSED_SUBTEXT, QUIZ_TOAST_COMMENT } from '@/app/dev/pub/rwd/qiz/mock';
import { CustomBadge, CustomBadgeProps, CustomToastProps, showToast } from '@/components/common/ui';
import Img, { ImgProps } from '@/components/common/ui/image/Img';
import { useCallback, useState } from 'react';

type QuizBadgeChildrenType = 'LIMITED' | 'BONUS' | 'TODAY';
type QuizStatus = 'OPEN' | 'UPCOMIMG' | 'COMPLETED' | 'CLOSED';

export interface QuizCardProps {
  contents: {
    thumbImg: ImgProps;
    badge: Pick<CustomBadgeProps, 'color' | 'size'> & { children: QuizBadgeChildrenType };
    title: string;
    subText: string;
  };
  point?: {
    badge: Pick<CustomBadgeProps, 'color' | 'size' | 'children'>;
  };
  status?: QuizStatus;
  onClickHandler?: () => void;
}

/**
 *
 * @param {
 *    contents:{ // 리스트의 오른쪽 영역
 *      thumbImg: ImgProps; // 공통 컴포넌트 Img props
 *      badge: Pick<CustomBadgeProps, 'color' | 'size'> & { children: QuizBadgeChildrenType }; // 공통 컴포넌트 Badge props에서 color, size, children만 pick & children은 LIMITED: 선착순 퀴즈, BONUS: 보너스 퀴즈, TODAY: 오늘의 퀴즈
 *      title: string; // 퀴즈 제목
 *      subText?: string; // sub글 (퀴즈 종료 시ㅣ: '퀴즈가 종료되었어요.' 문구 들어감)
 *    }
 *    point: { // 리스트의 왼쪽 영역 (포인트 부분)
 *      badge: Pick<CustomBadgeProps, 'color' | 'size' | 'children'>; // 공통 컴포넌트 Badge props에서 color, size, children만 pick
 *    }  
 *    status: 'OPEN' | 'UPCOMIMG' | 'COMPLETED' | 'CLOSED'; // OPEN: 참여가능, UPCOMIMG: 오픈예정, COMPLETED: 참여완료, CLOSED: 종료 (기본값 : OPEN)
 * }  
 * @returns
 */

export default function QuizCard(props: QuizCardProps) {
  const { contents, point, status = 'OPEN', onClickHandler } = props;
  const { thumbImg, badge: contentsBadge, title, subText } = contents;
  const { src, width = 48, height = 48, alt = 'thumb 이미지' } = thumbImg;

  // 비활성화 상태
  const disabledStatus = status === 'COMPLETED' || status === 'CLOSED';

  // 퀴즈 상태가 종료인 경우 '
  const subTextCustom = status === 'CLOSED' ? QUIZ_CLOSED_SUBTEXT : subText;

  // 퀴즈 라벨별 한글 변경
  const contentsBadgeCustom: CustomBadgeProps = {
    color: contentsBadge.color,
    size: contentsBadge.size,
    children:
      contentsBadge.children === 'LIMITED'
        ? '선착순'
        : contentsBadge.children === 'BONUS'
          ? '보너스'
          : '오늘의' + ' 퀴즈',
  };

  // 포인트 영역 뱃지 complete일 때 강제 주입
  const pointBadgeCusotm: CustomBadgeProps = {
    color: status === 'COMPLETED' ? 'quizCompleted' : point?.badge.color || 'purple',
    size: point?.badge.size || 'lg',
    children: point?.badge.children,
  };

  const quizCardOnClickHandler = () => {
    if (status === 'CLOSED') {
      showToast({
        description: QUIZ_TOAST_COMMENT.quizEnd,
      });
    } else if (status === 'COMPLETED') {
      showToast({
        description: QUIZ_TOAST_COMMENT.quizComplete,
      });
    }

    if (!!onClickHandler) {
      // 외부에서 받아온 onClickHandler(상세페이지 이동) 실행
      console.log('quizCard onClickHandler');
      onClickHandler();
    }
  };

  return (
    <button
      className={`flex justify-between
      w-full min-h-[92px]
      mb-2 last:mb-0
      overflow-hidden
      rounded-xl border border-outline-100
      shadow-[0_2px_8px_0_rgba(5,20,31,0.08)]
      ${status === 'OPEN' && 'border-primary-700'}
      ${disabledStatus ? 'bg-bg-100 cursor-not-allowed' : 'bg-bg-0 cursor-pointer'}
      `}
      onClick={quizCardOnClickHandler}
      aria-disabled={disabledStatus} // 스크린 리더기를 위한 접근성 태그
    >
      <section className="flex flex-[250] items-start py-4 pl-4 pr-2">
        <Img className="mr-3" src={src} width={width} height={height} alt={alt} />
        <article className="w-[170px] flex flex-col items-start ">
          <CustomBadge {...contentsBadgeCustom} />
          <h2
            className={`py-1 text-title-l font-bold ${status === 'CLOSED' && 'text-font-500'} text-left`}
          >
            {title}
          </h2>
          <p className="text-title-s text-font-300">{subTextCustom}</p>
        </article>
      </section>
      <section className="flex flex-[77] items-center justify-end pr-3">
        {!!point?.badge && <CustomBadge className="min-w-[59px]" {...pointBadgeCusotm} />}
      </section>
    </button>
  );
}
