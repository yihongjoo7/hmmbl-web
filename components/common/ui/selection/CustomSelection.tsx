'use client';
import React, { useState, useEffect } from 'react';
import { CustomButton } from '../button/CustomButton';
import { CustomPopup } from '../popup/CustomPopup';
import { Space } from 'antd';
import { CustomCheckbox } from '../checkbox/CustomCheckbox';
import { selectionVariants } from './CustomSelection.styles';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface BaseProps {
  options: SelectOption[];
  placeholder?: string;
  borderIndent?: 'bordered' | 'borderless';
}

interface SingleProps extends BaseProps {
  type: 'single';
  value: string | null;
  onChange: (value: string | null) => void;
}

interface MultipleProps extends BaseProps {
  type: 'multiple';
  value: string[];
  onChange: (value: string[]) => void;
}

type CustomSelectProps = SingleProps | MultipleProps;

export const CustomSelection = (props: CustomSelectProps) => {
  const { options, type, value, placeholder = '선택', borderIndent = 'bordered', onChange } = props;

  const [isOpen, setIsOpen] = useState(false);

  // 팝업 내부에서 실시간으로 바뀔 임시 상태 (확인 버튼을 누를 때 최종 반영)
  const [tempValue, setTempValue] = useState<string | null | string[]>(value);

  // 외부 value가 변경되면 임시 상태도 동기화
  useEffect(() => {
    setTempValue(value);
  }, [value, isOpen]);

  // 내부 체크 변경 핸들러
  const handleCheck = (checked: boolean, itemValue: string) => {
    if (type === 'single') {
      // 단일 선택: 체크 해제 시 null, 체크 시 해당 값만 설정
      setTempValue(checked ? itemValue : null);
      return;
    }

    // 다중 선택 로직
    const currentValues = Array.isArray(tempValue) ? tempValue : [];
    setTempValue(
      checked ? [...currentValues, itemValue] : currentValues.filter((v) => v !== itemValue)
    );
  };

  // 내부 체크 여부 판단
  const isChecked = (itemValue: string) => {
    if (type === 'single') return tempValue === itemValue;
    return Array.isArray(tempValue) && tempValue.includes(itemValue);
  };

  // 버튼 UI 노출용 계산값 (최종 반영된 외부 value 기준)
  const selectedCount = type === 'multiple' && Array.isArray(value) ? value.length : 0;
  const isSelected = type === 'single' ? value !== null : selectedCount > 0;

  const getButtonText = () => {
    if (type === 'single' && value !== null) {
      const selectedOption = options.find((item) => item.value === value);
      if (selectedOption) return selectedOption.label;
    }
    return placeholder;
  };

  // '확인' 버튼 클릭 시 부모에게 최종 전달
  const handleConfirm = () => {
    if (type === 'single') {
      (onChange as (value: string | null) => void)(tempValue as string | null);
    } else {
      (onChange as (value: string[]) => void)((tempValue as string[]) || []);
    }
    setIsOpen(false);
  };

  return (
    <>
      <CustomButton
        size="xs"
        fullRadius
        rightIcon={<img src="/images/icons/common/icon_arr_down.svg" alt="옵션보기" />}
        className={`h-[28px] px-2.5 py-[6px] ${borderIndent === 'bordered' ? 'border border-outline-400' : 'border-none'} ${
          isSelected ? 'bg-bg-900 text-font-0' : 'text-font-700'
        }`}
        onClick={() => setIsOpen(true)}
      >
        {getButtonText()}
        {type === 'multiple' && selectedCount > 0 && (
          <span className="ml-[2px] text-font-200 text-xs">{selectedCount}</span>
        )}
      </CustomButton>

      <CustomPopup
        title={placeholder}
        visible={isOpen}
        position="bottom"
        closeOnSwipe={true}
        noTitle={false}
        buttons={[{ text: '확인', variant: 'primary', onClick: handleConfirm }]}
        onClose={() => setIsOpen(false)}
        onMaskClick={() => setIsOpen(false)} // 마스크 클릭 시 적용 안 하고 닫기
      >
        <div className="overscroll-contain max-h-[60vh] overflow-y-auto pb-4 select-none">
          <Space orientation="vertical" style={{ width: '100%' }}>
            {options.map((item) => (
              <div key={item.value} className="flex items-center gap-2">
                <CustomCheckbox
                  checked={isChecked(item.value)}
                  disabled={item.disabled}
                  onChange={(e) => handleCheck(e.target.checked, item.value)}
                  className={selectionVariants({ variant: type })}
                >
                  {item.label}
                </CustomCheckbox>
              </div>
            ))}
          </Space>
        </div>
      </CustomPopup>
    </>
  );
};
