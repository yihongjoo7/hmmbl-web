import React, { useState } from 'react';
import { VariantProps } from 'class-variance-authority';
import { commentItemVariants } from './CommentItem.styles';
import { CustomButton, CustomIconButton, CustomInput } from '@/components/common/ui';
import Img from '@/components/common/ui/image/Img';
// data
const filterOptions = [
  { label: '등록순', value: 'Featured' },
  { label: '인기순', value: 'Newest' },
  { label: '기한만료순', value: 'Expirationdate ' },
];

const filterOptions2 = [
  { label: '20건', value: 'twenty' },
  { label: '50건', value: 'fifty' },
  { label: '100건', value: 'oneHundred' },
];

// 댓글 데이터
const dummyComments = [
  {
    id: 1,
    author: '조*원',
    date: '2026.07.17 06:41:15',
    content:
      '전에 구매 이벤트 할 때 주셨던 증정품이 너무 좋았어요. 이번에도 같은 증정품을 주면 좋을 것 같아요. 전에 구매 이벤트 할 때 주셨던 증정품이 너무 좋았어요. 이번에도 같은 증정품을 주면 좋을 것 같아요',
  },
  {
    id: 2,
    author: '김*태',
    date: '2026.07.17 07:12:00',
    content: '두 번째 댓글 테스트입니다.',
  },
];

// img 데이터
const imageList = [
  { id: 1, src: '/image_ratio_sm.png', alt: '' },
  { id: 2, src: '/image_ratio_sm.png', alt: '' },
  { id: 3, src: '/image_ratio_sm.png', alt: '' },
  { id: 4, src: '/image_ratio_sm.png', alt: '' },
  { id: 5, src: '/image_ratio_sm.png', alt: '' },
  { id: 6, src: '/image_ratio_sm.png', alt: '' },
];
interface CommentItemProps extends VariantProps<typeof commentItemVariants> {
  className?: string;
}

export const CommentItem = ({ className, ...props }: CommentItemProps) => {
  // 부모 상태관리
  const [selectOptions, setSelectOptions] = useState<string | null>(null);

  // 즐겨찾기
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      {/* header */}
      <div className="flex items-center justify-between border-b border-b-outline-300 py-3">
        <p className="text-title-l font-bold">댓글 (56)</p>
        <div className="flex items-center gap-1">
          <CustomButton variant="text" size="md" rightIcon="ic_arrow_down_16" className="pr-0">
            추천순
          </CustomButton>
        </div>
      </div>

      {/* content */}
      {dummyComments.map((commet, index) => {
        const isLast = index === dummyComments.length - 1;
        const borderclass = !isLast ? 'border-b border-b-outline-200 pb-5' : '';

        return (
          <div className={`flex flex-col gap-4  ${borderclass}`} key={commet.id}>
            <div className="flex items-center justify-between">
              <p className="text-title-m">{commet.author}</p>
              <span className="text-title-s text-font-300">{commet.date}</span>
            </div>
            <div className="flex flex-col gap-3">
              {/* content 영역 */}
              <div className="text-body-l text-font-500">{commet.content}</div>

              {/* 이미지 영역 */}
              <div className="flex items-center gap-2 overflow-x-auto">
                {imageList.map((item) => (
                  <Img key={item.id} src={item.src} alt={item.alt} width={80} height={80} />
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <CustomIconButton
                  ariaLabel="즐겨찾기"
                  size="xs"
                  icon="ic_favority_20"
                  className={`transition-colors duration-200 active:text-bg-400  ${isFavorite ? 'text-tertiary-800' : 'text-bg-400'}`}
                  onClick={() => setIsFavorite(!isFavorite)}
                />
                <span className="text-body-l text-font-500">2</span>
              </div>
              <CustomIconButton
                ariaLabel="더보기"
                size="xs"
                icon="ic_more_16"
                className={`transition-colors duration-200 active:text-bg-400  ${isFavorite ? 'text-tertiary-800' : 'text-bg-400'}`}
                onClick={() => setIsFavorite(!isFavorite)}
              />
            </div>
            <CustomButton size="md">더보기</CustomButton>
          </div>
        );
      })}

      {/* 댓글 입력 */}
      <div className="flex items-center bg-bg-200 py-4 px-6 -mx-6">
        <div className={commentItemVariants({ className, ...props })}>
          <CustomInput
            placeholder="댓글을 입력하세요"
            className="w-full bg-transparent !border-none !shadow-none !outline-none !py-0 !px-0 h-auto "
          />
          <CustomIconButton
            variant="fill"
            ariaLabel="입력"
            size="xs"
            className="bg-primary-700 shrink-0 active:bg-primary-700"
            icon="ic_arrow_up_12"
            onClick={() => console.log('클릭중')}
          />
        </div>
      </div>
    </div>
  );
};
