'use client';
import React from 'react';
import { CustomButton } from '../button/CustomButton';

interface EmptyStateProps {
  imageSrc: string;
  title: string;
  description?: React.ReactNode; // 하단 설명 (문자열 또는 <br/>이 포함된 JSX)
  buttonText?: string;
  onButtonClick?: () => void;
  buttonLink?: string; //
  onButtonLinkClick?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  imageSrc,
  title,
  description,
  buttonText,
  onButtonClick,
  buttonLink,
  onButtonLinkClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 text-center py-10 w-full bg-white">
      {/* 이미지 영역 */}
      <div className="w-44 h-44 flex items-center justify-center">
        <img
          src={`/images/icons/common/${imageSrc}`}
          alt=""
          className="w-full h-full object-contain"
        />
      </div>

      {/* 타이틀 영역 */}
      <p className="text-font-800 text-title-l font-bold leading-[1.38rem]">{title}</p>

      {/* 본문 영역 */}
      <p className="text-font-600 text-body-m leading-[1.13rem] whitespace-pre-line">
        {description}
      </p>

      <div className="flex gap-2 items-center">
        {/* 버튼 영역 (buttonText가 있을 때만 렌더링) */}
        {buttonText && (
          <>
            <CustomButton size="sm" onClick={onButtonClick}>
              {buttonText}
            </CustomButton>
          </>
        )}
        {buttonLink && (
          <>
            <CustomButton
              size="sm"
              onClick={onButtonLinkClick}
              rightIcon={
                <img
                  src="/images/icons/common/ic_arrow_front_16.svg"
                  alt="arrow"
                  className="w-5 h-5"
                />
              }
            >
              {buttonLink}
            </CustomButton>
          </>
        )}
      </div>
    </div>
  );
};
