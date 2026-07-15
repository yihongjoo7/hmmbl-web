'use client';

import {
  CouponCard,
  CustomBadge,
  CustomButton,
  CustomCheckbox,
  CustomIconButton,
  EventListCard,
  NoticeList,
  PrdItem,
} from '@/components/common/ui';
import { CustomDivider } from '@/components/common/ui/divider/CustomDivider';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { CommentItem } from '@/components/rwd/evt/CommentItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Parallax } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import Img from '@/components/common/ui/image/Img';
import { FixedTopTimer } from '@/components/rwd/evt/FixedTopTimer';
import { TopTimer } from '@/components/rwd/evt/TopTimer';
// swiper
const SLIDES = [
  { bg: 'bg-bg-900', label: '카드1' },
  { bg: 'bg-bg-800', label: '카드2' },
  { bg: 'bg-bg-700', label: '카드3' },
];

// 추천 굿즈
const prdData = [
  {
    id: 1,
    brand: '대한한공 마일리지몰',
    title: '프린세스 애니메이터돌 인형 12종 [택1]',
    originalPrice: '10980',
    discountRate: '27',
    price: '7980',
    imageUrl: '/images/image_ratio_prd.png',
  },
  {
    id: 2,
    brand: '대한한공 마일리지몰',
    title: '프린세스 애니메이터돌 인형 12종 [택1]',
    originalPrice: '10980',
    discountRate: '27',
    price: '7980',
    imageUrl: '/images/image_ratio_prd.png',
  },
];

export default function EventDetailPage() {
  // const [isPlaying, setIsPlaying] = useState(true);
  const controlSwiperRef = useRef<SwiperType | null>(null);

  const toggleAutoplay = () => {
    const swiper = controlSwiperRef.current;
    if (!swiper) return;
    if (isPlaying) {
      swiper.autoplay.stop();
    } else {
      swiper.autoplay.start();
    }
    setIsPlaying((prev) => !prev);
  };
  const [selectedFruits, setSelectedFruits] = useState<string[]>([]);

  // 확인하세요
  const noticeData1 = [
    { id: 1, text: '본 이벤트는 기간 내 1인 1회 참여 가능합니다.' },
    {
      id: 2,
      text: '무료 음료 쿠폰은 랜덤으로 지급되며, 음료 종류는 선택할 수 없습니다.',
    },
    {
      id: 3,
      text: '1개 쿠폰당 1회 사용 가능하며, 쿠폰 등록 유효기간 만료 혹은 참여 횟수를 초과한 쿠폰번호는 등록할 수 없습니다.',
    },
  ];
  const noticeData2 = [
    {
      id: 1,
      text: '상품권은 상품 가입하신 고객님의 연락처로 상품 가입 완료 후 10일 이내에 개별 MMS 발송됩니다.',
    },
    {
      id: 2,
      text: '혜택은 LG U+의 사정에 따라 변경/중단될 수 있습니다.',
    },
    {
      id: 3,
      text: 'h.point 혜택 선택시 가입월 익월 10일 지급됩니다.',
    },
  ];

  // 카운트다운 모듈
  const [isPlaying, setIsPlaying] = useState(false);
  //스크롤 감지를 위한 상태 및 ref 추가
  const [isFixed, setIsFixed] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="pt-4 px-6 bg-white">
      <div className="!z-99999999 relative flex flex-col gap-6">
        {/* 카운트다운 모듈  */}
        {!isFixed ? <TopTimer /> : <FixedTopTimer />}

        {/* header */}
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              {/* logo */}
              <Img src="/logo_thumb.svg" width={16} height={16} />
              {/* 참여사명 */}
              <span className="text-title-s text-font-700">현대아울렛 가든파이브점​</span>
            </div>
            <p className="text-xl font-bold text-font-900">해피니스 가든 무료 음료 쿠폰 증정 ①</p>
          </div>
          <div className="flex items-center gap-2">
            <CustomBadge color="gray" size="sm">
              D-3
            </CustomBadge>
            <p className="text-title-xs text-font-400">2026.03.26 ~ 2026.04.30</p>
          </div>
        </div>

        {/* 이미지 모듈 */}
        <div className="relative rounded-t-4 overflow-hidden h-[184px]">
          <Image src="/images/thumb_event.png" fill alt="" style={{ objectFit: 'cover' }} />
        </div>

        {/* 구분선 모듈 */}
        <CustomDivider />

        {/* 텍스트 모듈 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-title-m text-font-800 font-bold">이벤트 안내</h2>
          <ul className="flex flex-col gap-1">
            <li className="flex items-start text-body-m">
              <span className="flex items-center justify-center w-4 h-4.5  shrink-0 text-icon-500 select-none">
                •
              </span>
              <span className="text-font-700">이벤트 기간 내 참여하기 버튼을 눌러주세요</span>
            </li>
            <li className="flex items-start text-body-m">
              <span className="flex items-center justify-center w-4 h-4.5  shrink-0 text-icon-500 select-none">
                •
              </span>
              <span className="text-font-700">이벤트 기간 내 참여하기 버튼을 눌러주세요</span>
            </li>
            <li className="flex items-start text-body-m">
              <span className="flex items-center justify-center w-4 h-4.5  shrink-0 text-icon-500 select-none">
                •
              </span>
              <span className="text-font-700">이벤트 기간 내 참여하기 버튼을 눌러주세요</span>
            </li>
          </ul>
        </div>

        {/* 버튼 모듈 */}
        <CustomButton variant="default" size="md" className="w-full">
          이벤트 장소 미리 보기
        </CustomButton>

        {/* 구분선 모듈 */}
        <CustomDivider color="#8741F5" height="5" />

        {/* 텍스트 모듈 */}
        <div className="flex flex-col gap-2">
          <h2 className="text-title-m text-font-800 font-bold">무료 음료 종류</h2>
          <ul className="flex flex-col gap-1">
            <li className="flex items-start text-body-m">
              <span className="flex items-center justify-center w-4 h-4.5  shrink-0 text-icon-500 select-none">
                •
              </span>
              <span className="text-font-700">아이스 아메리카노 1잔</span>
            </li>
            <li className="flex items-start text-body-m">
              <span className="flex items-center justify-center w-4 h-4.5  shrink-0 text-icon-500 select-none">
                •
              </span>
              <span className="text-font-700">아이스 아메리카노 1잔</span>
            </li>
            <li className="flex items-start text-body-m">
              <span className="flex items-center justify-center w-4 h-4.5  shrink-0 text-icon-500 select-none">
                •
              </span>
              <span className="text-font-700">아이스 아메리카노 1잔</span>
            </li>
          </ul>
        </div>

        {/* 셀렉트 모듈 */}
        <CustomButton
          variant="default"
          size="md"
          className="w-full [&_span]:w-full [&_span]:justify-between [&_span]:font-normal"
          rightIcon="ic_arrow_down_solid_16"
        >
          음료 종류 선택
        </CustomButton>

        {/* 약관동의 모듈 */}
        <div className="flex flex-col gap-2">
          {/* gap : 8px */}
          <h3 className="text-title-m text-font-800 font-bold">광고성 정보 수신 동의</h3>
          <div className="flex flex-col gap-4">
            {/* gap : 16px */}
            {/* 안내 문구 */}
            <ul className="flex flex-col gap-1 list-outside">
              <li className="relative flex items-start text-body-m text-font-700 gap-x-1.5 before:content-[''] before:block before:w-[4px] before:h-[14px] before:bg-bg-400 before:rounded-1 before:mt-[2px] before:shrink-0">
                광고성 정보 수신 동의하시고 쿠폰 받아가세요.
              </li>
            </ul>
            {/* 약관 내용 */}
            <div>
              <CustomCheckbox size="lg">전체 동의</CustomCheckbox>
              <div className="flex flex-col gap-3 pl-7.5 justify-start ml-7">
                {/* 필수약관 */}
                <div className="flex items-center justify-between">
                  <CustomCheckbox variant="ghost" size="sm">
                    <div className="flex gap-1">
                      <span className="shink-0">[필수]</span>
                      <p className="flex-1">광고성 정보 수신을 위한 개인정보 수집 이용 동의</p>
                    </div>
                  </CustomCheckbox>
                  <CustomIconButton
                    ariaLabel="약관보기"
                    variant="default"
                    size="sm"
                    icon="ic_arrow_front2_16"
                    className="shrink-0"
                  />
                </div>

                {/* 선택약관 */}
                <div className="flex items-center justify-between">
                  <CustomCheckbox variant="ghost" size="sm">
                    <div className="flex gap-1">
                      <span className="shink-0">[선택]</span>
                      <p className="flex-1">App push를 통한 광고성 정보 수신에 동의합니다.</p>
                    </div>
                  </CustomCheckbox>
                </div>
              </div>
              <div className="flex items-center gap-2 py-3 px-2.5 ml-7 mt-1.5 bg-bg-100 rounded-sm">
                <CustomCheckbox size="sm">sm 체크박스</CustomCheckbox>
                <CustomCheckbox size="sm">sm 체크박스</CustomCheckbox>
                <CustomCheckbox size="sm">sm 체크박스</CustomCheckbox>
              </div>
            </div>
            {/* 안내 문구 */}
            <ul className="flex flex-col gap-1 list-outside">
              <li className="relative flex items-start text-body-m text-font-700 gap-x-1.5 before:content-[''] before:block before:w-[4px] before:h-[14px] before:bg-bg-400 before:rounded-1 before:mt-[2px] before:shrink-0">
                광고성 정보 수신 동의하시고 쿠폰 받아가세요.
              </li>
            </ul>
          </div>
        </div>

        {/* 구분선 모듈 */}
        <CustomDivider />

        {/* 쿠폰 모듈 */}
        <div className="flex flex-col gap-2">
          <h3 className="text-title-m text-font-800 font-bold">함께 받아가세요</h3>
          <div className="flex flex-col gap-2">
            <CouponCard />
            <CouponCard />
            <CouponCard />
          </div>
        </div>

        {/* 추천 굿즈 모듈 */}
        <div className="flex flex-col gap-2">
          <h3 className="text-title-m text-font-800 font-bold">추천 굿즈</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {prdData.map((product) => (
              <PrdItem key={product.id} {...product} />
            ))}
          </div>
        </div>

        {/* 구분선 모듈 */}
        <CustomDivider color="#EDF0F6" />

        {/* CTA 버튼 모듈 */}
        <div className="z-50 sticky bottom-[12px] left-0 right-0 flex flex-col justify-center items-center gap-4">
          <CustomBadge
            color="purple"
            size="md"
            icon={
              <Image src="/images/icons/common/ic_fire_12.svg" width={12} height={12} alt="fire" />
            }
          >
            <span>34</span>명 참여중
          </CustomBadge>
          <CustomButton variant="primary" size="lg" className="w-full">
            참여하기
          </CustomButton>
        </div>
      </div>
      <div className="flex flex-col gap-6 my-6">
        <NoticeList items={noticeData1} title="꼭 알아두실 사항" />
        <NoticeList items={noticeData2} title="가입 혜택 안내" />
      </div>

      {/* 구분선 모듈 */}
      <CustomDivider className="m-0 -mx-6 !w-[calc(100%+3rem)]" color="#EDF0F6" height="8" />

      {/* 댓글 */}
      <CommentItem />

      {/* 추천 이벤트
      <div className="swiper-dot-pagination w-full min-w-0 overflow-hidden">
        <Swiper
          slidesPerView={1}
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="w-full"
        >
          {SLIDES.map(({ bg, label }) => (
            <SwiperSlide key={label}>
              <EventListCard />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>*/}
    </div>
  );
}
