'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { Checkbox as AntdCheckbox } from 'antd';
import { VariantProps } from 'class-variance-authority';
import { checkboxVariants, checkboxGroupVariants } from './CustomCheckbox.styles';
import Img from '../image/Img';

export interface CheckboxOption {
  label: React.ReactNode;
  value: string | number;
  disabled?: boolean;
}

interface StyleProps {
  variant?: VariantProps<typeof checkboxVariants>['variant'];
  size?: VariantProps<typeof checkboxVariants>['size'];
  vertical?: boolean;
}

// 왼쪽, 오른쪽 아이콘 이미지명(string) 속성 정의
interface IconProps {
  leftIcon?: string;
  rightIcon?: string;
}

const StyleContext = createContext<StyleProps & IconProps>({});

type AntdCheckboxProps = React.ComponentProps<typeof AntdCheckbox>;

export interface CustomCheckboxProps
  extends Omit<AntdCheckboxProps, 'size'>, StyleProps, IconProps {
  children?: React.ReactNode;
}

// 아이콘 이미지명으로 Img 컴포넌트를 생성하는 헬퍼 함수
const renderIconHelper = (variant: string | null | undefined, iconName: string | undefined) => {
  if (variant !== 'chip' || !iconName) return null;
  return <Img src={`/icons/common/${iconName}.svg`} className="w-[1rem] h-[1rem]" />;
};

// 1. 단일 Checkbox 컴포넌트
export const CustomCheckbox = React.forwardRef<
  React.ComponentRef<typeof AntdCheckbox>,
  CustomCheckboxProps
>(
  (
    { children, className, variant, size, vertical: _vertical, leftIcon, rightIcon, ...props },
    ref
  ) => {
    const context = useContext(StyleContext);
    const mergedVariant = variant || context.variant;
    const mergedSize = size || context.size;

    const mergedLeftIcon = leftIcon || context.leftIcon;
    const mergedRightIcon = rightIcon || context.rightIcon;

    return (
      <AntdCheckbox
        {...props}
        ref={ref}
        className={checkboxVariants({
          variant: mergedVariant,
          size: mergedSize,
          className,
        })}
      >
        <span className="checkbox-content inline-flex items-center gap-x-1">
          {renderIconHelper(mergedVariant, mergedLeftIcon)}
          {children}
          {renderIconHelper(mergedVariant, mergedRightIcon)}
        </span>
      </AntdCheckbox>
    );
  }
);

CustomCheckbox.displayName = 'CustomCheckbox';

export interface CustomCheckboxGroupProps
  extends React.ComponentProps<typeof AntdCheckbox.Group>, StyleProps, IconProps {
  children?: React.ReactNode;
  options?: CheckboxOption[];
}

// 2. Checkbox Group 컴포넌트
export const CustomCheckboxGroup = React.forwardRef<HTMLDivElement, CustomCheckboxGroupProps>(
  (
    { children, options, variant, vertical, size, className, leftIcon, rightIcon, ...props },
    ref
  ) => {
    const groupClassName = checkboxGroupVariants({ vertical, className });

    const contextValue = useMemo(
      () => ({ variant, size, vertical, leftIcon, rightIcon }),
      [variant, size, vertical, leftIcon, rightIcon]
    );

    const renderedOptions = useMemo(() => {
      if (!options) return undefined;

      return options.map((option) => ({
        ...option,
        label: (
          <span className="checkbox-content inline-flex items-center gap-x-1">
            {renderIconHelper(variant, leftIcon)}
            {option.label}
            {renderIconHelper(variant, rightIcon)}
          </span>
        ),
      }));
    }, [options, variant, leftIcon, rightIcon]);

    return (
      <div ref={ref}>
        <StyleContext.Provider value={contextValue}>
          {options ? (
            <AntdCheckbox.Group
              {...props}
              options={renderedOptions}
              className={`${checkboxVariants({ variant, size })} ${groupClassName}`}
            />
          ) : (
            <AntdCheckbox.Group {...props} className={groupClassName}>
              {children}
            </AntdCheckbox.Group>
          )}
        </StyleContext.Provider>
      </div>
    );
  }
);

CustomCheckboxGroup.displayName = 'CustomCheckboxGroup';

type CompoundedComponent = typeof CustomCheckbox & {
  Group: typeof CustomCheckboxGroup;
};

export const Checkbox = Object.assign(CustomCheckbox, {
  Group: CustomCheckboxGroup,
}) as CompoundedComponent;
