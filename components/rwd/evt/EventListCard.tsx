'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CustomBadge, CustomIconButton } from '@/components/common/ui';

export const EventListCard = () => {
  // 즐겨찾기 상태관리
  const [isFavorite, setIsFavorite] = useState(false);
  return (
    <div>
      {/* thumb area */}
      <div className="relative">
        {/* thumb Image */}
        <div className="relative rounded-t4 overflow-hidden h-[184px]">
          <Image src="/images/image_ratio.png" fill alt="" style={{ objectFit: 'cover' }} />
        </div>

        {/* badge */}
        <div className="absolute top-[0.75rem]  right-[0.75rem]">
          <CustomBadge
            color="purple"
            size="md"
            icon={
              <Image src="/images/icons/common/ic_fire_12.svg" width={12} height={12} alt="fire" />
            }
          >
            <span>34</span>명 참여중
          </CustomBadge>
        </div>

        {/* 카운트다운 모듈  */}
        <div className="absolute bottom-0 left-0 right-0">
          <p
            className="flex items-center justify-center gap-0.5 text-title-xs text-font-700 py-1.5 px-3 text-center"
            style={{
              background:
                'linear-gradient(0deg, rgba(255, 255, 255, 0.80) 0%, rgba(255, 255, 255, 0.80) 100%), linear-gradient(180deg, rgba(255, 255, 255, 0.00) 33.93%, #FFF 100%)',
            }}
          >
            <Image
              src="/images/icons/common/ic_clock_16.svg"
              width={16}
              height={16}
              alt=""
              className="mr-0.5"
            />
            종료까지
            <span className="text-primary-700 font-bold">3일 10시간 10분 10초 </span>
            남았습니다!
          </p>
        </div>
      </div>

      {/* text area */}
      <div className="flex flex-col gap-4 bg-bg-purple-100 p-3 rounded-b4">
        <div className="flex flex-col gap-1">
          <span className="text-title-s text-font-500">현대아울렛 가든파이브점</span>
          <p className="max-h-10 text-title-m text-font-800 font-bold line-clamp-2">
            해피니스 가든 무료 음료 쿠폰 증정 HAPPINESS GARDEN 해피니스 가든 무료 음료 쿠폰 증정
            HAPPINESS GARDEN해피니스 가든 무료 음료 쿠폰 증정 HAPPINESS GARDEN해피니스 가든 무료
            음료 쿠폰 증정 HAPPINESS GARDEN해피니스 가든 무료 음료 쿠폰 증정 HAPPINESS GARDEN 음료
            쿠폰 증정 HAPPINESS GARDEN해피니스 가든 무료 음료 쿠폰 증정 HAPPINESS GARDEN
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CustomBadge color="pink" size="md">
              D-30
            </CustomBadge>
            <CustomBadge color="gray" size="sm">
              D-30
            </CustomBadge>
            <span className="text-title-xs text-font-400">2026.03.26 ~ 2026.04.30</span>
          </div>
          <div className="flex items-center gap-2">
            <CustomIconButton
              ariaLabel="즐겨찾기"
              size="xs"
              icon="ic_favority_20"
              className={`transition-colors duration-200 active:text-bg-400 text-xl  ${isFavorite ? 'text-tertiary-800' : 'text-bg-400'}`}
              onClick={() => setIsFavorite(!isFavorite)}
            />
            <CustomIconButton
              ariaLabel="공유"
              size="xs"
              icon="ic_share_16"
              className="text-icon-400 active:text-icon-400 text-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
