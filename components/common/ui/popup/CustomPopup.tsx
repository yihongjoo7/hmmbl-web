'use client';
// popup = bottom sheet
import React from 'react';
import { Drawer as AntdDrawer } from 'antd';
import { VariantProps } from 'class-variance-authority';
import { PopupVariants } from './CustomPopup.styles';
import { CustomButton } from '../button/CustomButton';

// footer 내 버튼 interface
export interface PopupButtonProps {
  text: string;
  variant?: 'default' | 'primary'; // button 컴포넌트 스타일
  onClick?: () => void;
  disabled?: boolean;
}

// popup interface
export interface CustomPopupProps extends VariantProps<typeof PopupVariants> {
  children?: React.ReactNode;
  visible?: boolean;
  showCloseButton?: boolean;
  title?: React.ReactNode;
  noTitle?: boolean;
  headerAction?: React.ReactNode;
  buttons?: PopupButtonProps[];
  buttonLayout?: 'full' | 'equal' | '1:2';
  showSwiperHandle?: boolean;
  closeOnSwipe?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onClose?: () => void;
  onMaskClick?: () => void;
  className?: string;
  bodyStyle?: React.CSSProperties;
  destroyOnClose?: boolean;
}

export const CustomPopup = ({
  title, // 제목
  headerAction, // 타이틀 옆 버튼
  showCloseButton, // x 버튼
  noTitle = false, // 타이틀 유무
  buttons,
  buttonLayout,
  className,
  children,
  visible,
  onClose,
  onMaskClick,
  position = 'bottom',
  showSwiperHandle = false,
  bodyStyle,
  destroyOnClose = true,
}: CustomPopupProps) => {
  const combinedClassName = PopupVariants({ className });

  const handleClose = () => {
    onClose?.();
    onMaskClick?.();
  };

  return (
    <AntdDrawer
      open={visible}
      placement={position}
      onClose={handleClose}
      closable={showCloseButton}
      destroyOnHidden={destroyOnClose}
      size={position === 'top' || position === 'bottom' ? 'auto' : undefined}
      className={combinedClassName}
      styles={{
        body: {
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh',
          ...bodyStyle,
        },
      }}
    >
      {/* 상단 바 */}
      {showSwiperHandle && (
        <div className="w-full h-[32px] flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-[5px] bg-outline-400 rounded-full pointer-events-none" />
        </div>
      )}

      {/* header */}
      {!noTitle && (
        <div className="w-full flex items-center justify-between p-6 mb-[20px]">
          <h1 className="w-full text-base text-font-900 font-bold py-[12px]  border-b border-outline-200">
            {title}
          </h1>
          <div className="shrink-0">{headerAction}</div>
        </div>
      )}

      {/* body */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-6 pb4">{children}</div>

      {/* footer */}
      {buttons && buttons.length > 0 && (
        <div className="flex items-center justify-between gap-2 p-6">
          {buttons.map((btn, index) => {
            const buttonTotal = buttons.length; // 버튼 갯수
            const layout = buttonLayout || 'equal'; // 버튼 비율

            let wrapperStyle: React.CSSProperties | undefined = undefined;
            let wrapperClass = '';

            // 버튼 1개일때
            if (buttonTotal === 1) {
              wrapperClass = 'w-full';
            } else if (layout === '1:2' && buttonTotal === 2) {
              //버튼 2개일때
              if (index === 0) {
                wrapperStyle = { width: '74px', flexShrink: 0 };
              } else {
                wrapperStyle = { width: 'calc(100% - 82px)', flexGrow: 1 };
              }
            } else {
              wrapperClass = 'flex-1 min-w-0';
            }

            return (
              <div key={index} className={wrapperClass} style={wrapperStyle}>
                <CustomButton
                  variant={btn.variant || (index === 0 && buttonTotal > 1 ? 'default' : 'primary')}
                  size="lg"
                  onClick={btn.onClick}
                  disabled={btn.disabled}
                >
                  {btn.text}
                </CustomButton>
              </div>
            );
          })}
        </div>
      )}
      <div className="pb-[env(safe-area-inset-bottom)]" />
    </AntdDrawer>
  );
};
