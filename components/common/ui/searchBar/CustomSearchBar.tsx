import React, { useState } from 'react';
import { Input as AntdInput } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { VariantProps } from 'class-variance-authority';
import { SearchBarVariants } from './CustomSearchBar.styles';

export interface SearchBarItem {
  label: string;
  value: string;
}

type AntdInputProps = React.ComponentProps<typeof AntdInput>;

export interface CustomSearchBarProps
  extends
    Omit<AntdInputProps, 'className' | 'placeholder' | 'value' | 'onChange' | 'variant'>,
    VariantProps<typeof SearchBarVariants> {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
}

export const CustomSearchBar = ({
  className,
  placeholder,
  value,
  onChange,
  onSearch,
  onFocus,
  onBlur,
  variant: _variant,
  hasValue: _hasValue,
  isFocused: _isFocusedVariant,
  ...props
}: CustomSearchBarProps) => {
  const [innerValue, setInnerValue] = useState(value ?? '');
  const [isFocused, setIsFocused] = useState(false);

  const searchValue = value ?? innerValue;

  const combinedClassName = SearchBarVariants({
    className,
    hasValue: !!searchValue,
    isFocused,
  });

  return (
    <div className={combinedClassName} style={{ padding: '0', position: 'relative', border: 'none' }}>
      <AntdInput
        placeholder={placeholder}
        value={searchValue}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        onChange={(e) => {
          setInnerValue(e.target.value);
          onChange?.(e.target.value);
        }}
        onPressEnter={() => onSearch?.(searchValue)}
        allowClear
        suffix={
          <button
            type="button"
            className="search-bar-icon-btn"
            onClick={() => onSearch?.(searchValue)}
          >
            <SearchOutlined />
          </button>
        }
        {...props}
      />
    </div>
  );
};
