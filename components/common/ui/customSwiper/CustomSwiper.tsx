'use client';
import type { ReactNode } from 'react';
import { Swiper, SwiperSlide, type SwiperProps } from 'swiper/react';
import 'swiper/css';

interface CustomSwiperProps extends SwiperProps {
  slides: ReactNode[];
}

export function CustomSwiper({ slides, ...props }: CustomSwiperProps) {
  return (
    <Swiper
      {...props}
      className={['rounded-2xl border border-slate-200 bg-slate-50 p-3', props.className]
        .filter(Boolean)
        .join(' ')}
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>{slide}</SwiperSlide>
      ))}
    </Swiper>
  );
}

export { SwiperSlide };
