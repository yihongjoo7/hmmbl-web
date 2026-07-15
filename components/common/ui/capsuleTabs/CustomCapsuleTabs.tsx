'use client';

import React, { useState } from 'react';
import { VariantProps } from 'class-variance-authority';
import { CapsuleTabsVariants, capsuleTabButtonVariants } from './CustomCapsuleTabs.styles';

export interface CapsuleTabsItem {
  label: string;
  value: string;
  disabled?: boolean;
  children: React.ReactNode;
}

export interface CustomCapsuleTabsProps extends VariantProps<typeof CapsuleTabsVariants> {
  items?: CapsuleTabsItem[];
  activeKey?: string;
  defaultActiveKey?: string;
  onChange?: (key: string) => void;
  className?: string;
}

export const CustomCapsuleTabs = ({
  items = [],
  activeKey,
  defaultActiveKey,
  onChange,
  className,
}: CustomCapsuleTabsProps): React.JSX.Element => {
  const [innerActiveKey, setInnerActiveKey] = useState(defaultActiveKey ?? items[0]?.value);
  const currentKey = activeKey ?? innerActiveKey;
  const combinedClassName = CapsuleTabsVariants({ className });

  const handleSelect = (key: string) => {
    setInnerActiveKey(key);
    onChange?.(key);
  };

  const activeItem = items.find((item) => item.value === currentKey);

  return (
    <div className={combinedClassName}>
      <div className="flex gap-1 px-1">
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            disabled={item.disabled}
            onClick={() => handleSelect(item.value)}
            className={capsuleTabButtonVariants({ active: item.value === currentKey })}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="capsule-tabs-content">{activeItem?.children}</div>
    </div>
  );
};
