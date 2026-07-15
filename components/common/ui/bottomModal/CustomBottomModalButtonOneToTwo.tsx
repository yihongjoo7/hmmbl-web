'use client';
// popup = bottom sheet
import React from 'react';
import { Drawer as VaulDrawer } from 'vaul';
import { CustomButton } from '../button/CustomButton';
import { cn } from '../lib/utils';
import { BottomModalContentVariants, BottomModalOverlayVariants } from './CustomBottomModal.styles';

// footer 내 버튼 interface
export interface CustomBottomModalButtonOneToTwoButtonProps {
  text1: string;
  text2: string;
  button1_variant?: 'default' | 'primary'; // button 컴포넌트 스타일
  button2_variant?: 'default' | 'primary'; // button 컴포넌트 스타일
  button1_icon?: string; // 왼쪽 버튼 아이콘용
  onClick1?: () => void;
  onClick2?: () => void;
  disabled1?: boolean;
  disabled2?: boolean;
}

// popup interface
export interface CustomBottomModalButtonOneToTwoProps {
  children?: React.ReactNode;
  visible?: boolean;
  title?: React.ReactNode;
  noTitle?: boolean;
  headerAction?: React.ReactNode;
  buttons?: CustomBottomModalButtonOneToTwoButtonProps;
  showSwiperHandle?: boolean;
  closeOnSwipe?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onClose?: () => void;
  onMaskClick?: () => void;
  className?: string;
  bodyStyle?: React.CSSProperties;
}

export const CustomBottomModalButtonOneToTwo = ({
  title, // 제목
  headerAction, // 타이틀 옆 버튼
  noTitle = false, // 타이틀 유무
  buttons,
  className,
  children,
  visible,
  onClose,
  onMaskClick,
  position = 'bottom',
  showSwiperHandle = true,
  closeOnSwipe = true,
  bodyStyle,
}: CustomBottomModalButtonOneToTwoProps) => {
  const handleOpenChange = (open: boolean) => {
    if (open) return;
    onClose?.();
    onMaskClick?.();
  };

  return (
    <VaulDrawer.Root
      open={visible}
      onOpenChange={handleOpenChange}
      direction={position}
      dismissible={closeOnSwipe}
    >
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className={BottomModalOverlayVariants()} />
        <VaulDrawer.Content className={cn(BottomModalContentVariants(), className)}>
          {/* noTitle일 땐 접근성용 타이틀만 화면에 숨겨서 렌더링 */}
          {noTitle ? (
            <VaulDrawer.Title className="sr-only">
              {typeof title === 'string' ? title : 'bottom sheet'}
            </VaulDrawer.Title>
          ) : null}
          <VaulDrawer.Description className="sr-only" />

          {/* 상단 바 */}
          {showSwiperHandle && (
            <VaulDrawer.Handle className="!w-10 !h-[5px] !bg-outline-600 mx-auto mt-3 mb-1 shrink-0" />
          )}

          {/* header */}
          {!noTitle && (
            <div className="w-full px-6">
              <div className="flex items-center justify-between py-2 border-b border-outline-300">
                <VaulDrawer.Title asChild>
                  <h1 className="w-full text-title-l text-font-900 font-bold">{title}</h1>
                </VaulDrawer.Title>
                <div className="shrink-0">{headerAction}</div>
              </div>
            </div>
          )}

          {/* body */}
          <div
            className="flex-1 overflow-y-auto overscroll-contain p-6 pb-0 pt-5"
            style={bodyStyle}
          >
            {children}
          </div>

          {/* footer */}
          {/* button 2:8 */}
          <div className={'flex items-center justify-between gap-2 px-6 mt-3'}>
            <CustomButton
              variant={buttons?.button1_variant || 'default'}
              size="lg"
              onClick={buttons?.onClick1}
              disabled={buttons?.disabled1}
              icon={
                buttons?.button1_icon ? (
                  <img
                    src={`/images/icons/common/${buttons.button1_icon}.svg`}
                    alt=""
                    className="w-4 h-4 object-contain"
                  />
                ) : undefined
              }
              className="!w-[110px] !shrink-0"
            >
              {buttons?.text1}
            </CustomButton>
            <CustomButton
              variant={buttons?.button2_variant || 'default'}
              size="lg"
              onClick={buttons?.onClick2}
              disabled={buttons?.disabled2}
              className="!flex-1 !min-w-0"
            >
              {buttons?.text2}
            </CustomButton>
          </div>

          <div className="pb-[env(safe-area-inset-bottom)]" />
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
};
