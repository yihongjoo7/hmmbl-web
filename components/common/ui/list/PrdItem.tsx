'use client';
import React from 'react';

interface PrdItemProps {
  brand: string;
  title: string;
  originalPrice: string;
  discountRate: string;
  price: string;
  imageUrl: string;
}

export const PrdItem = ({
  brand,
  title,
  originalPrice,
  discountRate,
  price,
  imageUrl,
}: PrdItemProps) => {
  return (
    <div className="flex flex-col gap-2">
      {/* thumb img */}
      <div className="overflow-hidden w-full h-[10rem] aspect-video bg-white rounded-xl border border-outline-200">
        <img src={imageUrl} alt="" className="w-full h-full object-cover" />
      </div>

      {/* text area */}
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-body-s text-font-500">[{brand}]</span>
          <p className="text-title-s text-font-700 line-clamp-2 font-bold">{title}</p>
        </div>
        <div className="flex flex-col">
          <span className="text-body-m text-font-400 line-through">
            {Number(originalPrice).toLocaleString()}원
          </span>
          <div className="flex items-center gap-1 font-bold">
            <span className="text-title-l text-tertiary-800">{discountRate}%</span>
            <span className="text-title-l">
              {Number(price).toLocaleString()}
              <em className="text-title-s text-font-800">원</em>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
