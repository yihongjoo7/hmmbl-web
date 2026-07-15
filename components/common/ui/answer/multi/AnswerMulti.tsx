'use client';

import { Checkbox, ConfigProvider, Radio } from 'antd';
import { AnswerMultiVariants } from './AnswerMulti.styles';

export interface AnswerMulti {
  id: string | number;
  text: string;
  type?: 'radio' | 'checkbox';
  checked?: boolean;
  hasIcon?: boolean;
  disabled?: boolean;
  onChangeHandler?: (checked: any) => void;
}

export default function AnswerMulti({
  id,
  text,
  type = 'radio',
  checked = false,
  hasIcon = false,
  disabled = false,
  onChangeHandler,
}: AnswerMulti) {
  const InputComponent = type === 'radio' ? Radio : Checkbox;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: disabled && checked ? '#ebdffd' : '#8741f5',
        },
      }}
    >
      <InputComponent
        className={AnswerMultiVariants({ checked, hasIcon, disabled })}
        checked={checked}
        onChange={(e) => {
          if (!disabled) {
            onChangeHandler?.(e.target.checked);
          }
        }}
      >
        <span className="inline-block translate-y-[1px] leading-none">{text}</span>
      </InputComponent>
    </ConfigProvider>
  );
}
