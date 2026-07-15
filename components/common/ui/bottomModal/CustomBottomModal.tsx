'use client';
// popup = bottom sheet
import React from 'react';
import { Drawer as VaulDrawer } from 'vaul';
import { CustomButton } from '../button/CustomButton';
import { cn } from '../lib/utils';
import { BottomModalContentVariants, BottomModalOverlayVariants } from './CustomBottomModal.styles';

// footer 내 버튼 interface
export interface CustomBottomModalButtonProps {
  text: string;
  variant?: 'default' | 'primary';
  onClick?: () => void;
  disabled?: boolean;
}

// 스크롤 영역 아래 노출되는 선택항목 칩
export interface CustomBottomModalSelectedItem {
  label: string;
  onRemove?: () => void;
}

// popup interface
export interface CustomBottomModalProps {
  children?: React.ReactNode;
  visible?: boolean;
  title?: React.ReactNode;
  noTitle?: boolean;
  headerAction?: React.ReactNode;
  buttons?: CustomBottomModalButtonProps;
  selectedItems?: CustomBottomModalSelectedItem[];
  showSwiperHandle?: boolean;
  closeOnSwipe?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onClose?: () => void;
  onMaskClick?: () => void;
  className?: string;
  bodyStyle?: React.CSSProperties;
}

export const CustomBottomModal = ({
  title, // 제목
  headerAction, // 타이틀 옆 버튼
  noTitle = false, // 타이틀 유무
  buttons,
  selectedItems,
  className,
  children,
  visible,
  onClose,
  onMaskClick,
  position = 'bottom',
  showSwiperHandle = true,
  closeOnSwipe = true,
  bodyStyle,
}: CustomBottomModalProps) => {
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

          {/* 선택항목 */}
          {selectedItems && selectedItems.length > 0 && (
            <div className="w-full flex items-center gap-4 overflow-x-auto px-6 py-3 border-t border-outline-200">
              {selectedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 shrink-0 text-sm font-medium text-primary-700"
                >
                  <span>{item.label}</span>
                  <button
                    type="button"
                    onClick={item.onRemove}
                    className="shrink-0 text-outline-600 leading-none"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* footer */}
          <div className={'w-full px-6 mt-3'}>
            <CustomButton
              variant={buttons?.variant || 'default'}
              size="lg"
              onClick={buttons?.onClick}
              disabled={buttons?.disabled}
            >
              {buttons?.text}
            </CustomButton>
          </div>

          <div className="pb-[env(safe-area-inset-bottom)]" />
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
};
