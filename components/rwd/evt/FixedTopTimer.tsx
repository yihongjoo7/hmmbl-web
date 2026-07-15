import React from 'react';
import { createPortal } from 'react-dom';

export const FixedTopTimer = () => {
  if (typeof window === 'undefined') return null;
  return createPortal(
    <div className="!z-99999999  fixed top-0 left-0 right-0 flex items-center justify-center w-[calc(100%_+_3rem)] -mx-6 py-4 px-6  bg-bg-purple-100 drop-shadow-sm">
      <div className="flex items-center gap-1 text-sm text-font-700 font-bold leading-[1]">
        종료까지
        <div className="flex items-end text-xxs text-font-400 font-normal">
          <span className="text-base text-primary-700 font-bold leading-[1]">03</span>일
        </div>
        <div className="flex items-end text-xxs text-font-400 font-normal">
          <span className="text-base text-primary-700 font-bold leading-[1]">12</span>시
        </div>
        <div className="flex items-end text-xxs text-font-400 font-normal">
          <span className="text-base text-primary-700 font-bold leading-[1]">33</span>분
        </div>
        <div className="flex items-end text-xxs text-font-400 font-normal">
          <span className="text-base text-primary-700 font-bold leading-[1]">44</span>초
        </div>
        남았어요!
      </div>
    </div>,
    document.body
  );
};
