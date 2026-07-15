'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { cn } from '../lib/utils';
import { Radio as AntdRadio } from 'antd';
import { VariantProps } from 'class-variance-authority';
import { radiobuttonVariants } from './CustomRadioButton.styles';

export interface RadioOption {
  label: React.ReactNode;
  value: string | number;
  disabled?: boolean;
}

// 부모의 스타일 및 비활성화 상태를 자식들한테 전파할 Context 인터페이스
interface StyleContextProps {
  variant?: VariantProps<typeof radiobuttonVariants>['variant'];
  size?: VariantProps<typeof radiobuttonVariants>['size'];
  vertical?: boolean;
  disabled?: boolean;
}
const StyleContext = createContext<StyleContextProps>({});

// radio group props
interface CustomRadioGroupProps
  extends Omit<React.ComponentProps<typeof AntdRadio.Group>, 'size'>,
    Omit<StyleContextProps, 'disabled'> {
  children?: React.ReactNode;
  options?: RadioOption[];
  className?: string;
  style?: React.CSSProperties;
}

export const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  children,
  variant,
  options,
  className = '',
  style,
  size,
  vertical = false,
  disabled,
  ...props
}) => {
  const contextValue = useMemo(
    () => ({ variant, size, vertical, disabled }),
    [variant, size, vertical, disabled]
  );

  return (
    <AntdRadio.Group {...props} disabled={disabled}>
      <StyleContext.Provider value={contextValue}>
        <div
          className={cn(
            'flex gap-2',
            vertical ? 'flex-col items-stretch w-full' : 'items-center',
            className
          )}
          style={style}
        >
          {options
            ? options.map(({ label, value, disabled: optionDisabled, ...rest }) => (
                <CustomRadioButton
                  key={value}
                  value={value}
                  disabled={disabled || optionDisabled}
                  {...rest}
                >
                  {label}
                </CustomRadioButton>
              ))
            : children}
        </div>
      </StyleContext.Provider>
    </AntdRadio.Group>
  );
};

type AntdRadioProps = React.ComponentProps<typeof AntdRadio>;

export interface CustomRadioProps
  extends Omit<AntdRadioProps, 'size'>, Omit<StyleContextProps, 'disabled'> {
  children?: React.ReactNode;
  disabled?: boolean;
}

export const CustomRadioButton: React.FC<CustomRadioProps> & { Group: typeof CustomRadioGroup } = ({
  children,
  className,
  variant,
  size,
  vertical,
  disabled,
  ...props
}) => {
  const context = useContext(StyleContext);

  // 부모 Group의 스타일과 단일 prop의 스타일을 안전하게 결합
  const mergeVariant = variant || context.variant;
  const mergeSize = size || context.size;
  const mergeVertical = vertical ?? context.vertical ?? false;
  const mergeDisabled = disabled || context.disabled;

  return (
    <AntdRadio
      {...props}
      disabled={mergeDisabled}
      className={radiobuttonVariants({
        variant: mergeVariant,
        size: mergeSize,
        vertical: mergeVertical,
        className,
      })}
    >
      <span className="radio-content">{children}</span>
    </AntdRadio>
  );
};
CustomRadioButton.Group = CustomRadioGroup;
