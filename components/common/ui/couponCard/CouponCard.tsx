'use client';

import { CustomBadge } from '../badge/CustomBadge';
import { CustomIconButton } from '../iconButton/CustomIconButton';
import { useState } from 'react';

export const CouponCard = () => {
  // 즐겨찾기
  const [isFavorite, setIsFavorite] = useState(false);
  return (
    <div className="flex rounded-2xl w-full">
      {/* textarea */}
      <div className="relative flex flex-1 items-center gap-3 px-4 py-[14px] bg-white border border-outline-200 border-r-0 min-w-0 rounded-s-2xl">
        <img src="/images/img_Thumb.png" alt="logo" className="w-12 h-12 rounded-2xl" />
        <div className="flex-1 ">
          <span className="text-sm text-font-500">현대아울렛 동대문점</span>
          <p className="text-sm text-font-800 line-clamp-2">
            60만원이상 구매시사용 가능한 플러스포인트60만원이상 구매시사용 가능한 플러스포인트
          </p>
          <div className="flex items-center gap-1 mt-2.5">
            <CustomBadge variant="blueSolid" size="sm">
              플포
            </CustomBadge>
            <CustomBadge variant="purpleSolid" size="sm">
              D-14
            </CustomBadge>
            <CustomBadge variant="grayOutline" size="sm">
              60만원 이상
            </CustomBadge>
          </div>
        </div>
        {/* 즐겨찾기 */}
        <CustomIconButton
          ariaLabel="즐겨찾기"
          size="xs"
          icon="ic_favority_20"
          className={`absolute right-2.5 top-2.5 transition-colors duration-200 active:text-bg-400  ${isFavorite ? 'text-tertiary-800' : 'text-bg-400'}`}
          onClick={() => setIsFavorite(!isFavorite)}
        />
      </div>

      {/* btn */}
      <div className="relative w-16 shrink-0 flex items-center justify-center bg-bg-200 rounded-e-2xl text-indigo-500 text-[11px]">
        <div
          className="absolute top-0 bottom-0 left-0 w-0.5 -translate-x-full pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom, #e0e7ff 0px, #e0e7ff 2px, transparent 2px, transparent 4px)`,
          }}
        />

        <button
          type="button"
          className="flex flex-col justify-center items-center gap-1 w-full h-full text-bg-900"
          onClick={() => console.log('ddd')}
        >
          <img src="/images/icons/common/ic_download_16.svg" alt="쿠폰다운" className="w-4 h-4" />
          플포받기
        </button>
      </div>
    </div>
  );
};
