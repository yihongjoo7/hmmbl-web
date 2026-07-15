'use client';

import { Switch as AntdSwitch, ConfigProvider } from 'antd';
import { SwitchVariants } from './CustomSwitch.styles';
import { VariantProps } from 'class-variance-authority';

export interface CustomSwitchProps
  extends
    Omit<React.ComponentProps<typeof AntdSwitch>, 'size'>,
    VariantProps<typeof SwitchVariants> {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 *
 * @param {
 *  size?: 'sm' | 'md' | 'lg'; // switch 사이즈 (기본값 : lg)
 *  className?: string; // tailwind css 문법 추가시 사용
 * }
 * @returns
 */
export default function CustomSwitch({ size = 'lg', className, ...props }: CustomSwitchProps) {
  const sizeTokens = {
    sm: { trackHeight: 20, trackMinWidth: 36, handleSize: 16 },
    md: { trackHeight: 24, trackMinWidth: 40, handleSize: 20 },
    lg: { trackHeight: 28, trackMinWidth: 50, handleSize: 24 },
  }[size];

  return (
    <ConfigProvider
      theme={{
        components: {
          Switch: {
            // 크기 수정
            trackHeight: sizeTokens.trackHeight,
            trackMinWidth: sizeTokens.trackMinWidth,
            handleSize: sizeTokens.handleSize,
          },
        },
      }}
    >
      <AntdSwitch className={SwitchVariants({ className })} {...props} />
    </ConfigProvider>
  );
}
