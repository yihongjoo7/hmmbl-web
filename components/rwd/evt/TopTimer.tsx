import Img from '@/components/common/ui/image/Img';
import React from 'react';

export const TopTimer = () => {
  return (
    <div className="flex py-4  px-6  flex-col items-center gap-3 rounded-xl bg-bg-purple-100 border border-outline-300 drop-shadow-md">
      <div className="w-full py-1 px-1.5 text-xs bg-white rounded-full">
        <span className="flex items-center justify-center gap-0.5">
          <Img src="/icons/common/ic_clock_16.svg" width={16} height={16} /> 기간 한정! 더 높은
          포인트
        </span>
      </div>
      <div className="flex items-center gap-4 text-xxs text-font-400">
        <div className="flex items-end gap-1">
          <span className="text-2xl text-primary-700 font-bold leading-[1]">03</span>일
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl text-primary-700 font-bold leading-[1]">12</span>시
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl text-primary-700 font-bold leading-[1]">33</span>분
        </div>
        <div className="flex items-end gap-1">
          <span className="text-2xl text-primary-700 font-bold leading-[1]">44</span>초
        </div>
      </div>
    </div>
  );
};
