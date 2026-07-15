import React from 'react';
import { Tabs as AntdTabs } from 'antd';
import { VariantProps } from 'class-variance-authority';
import { tabsVariants } from './CustomTabs.styles';

export interface TabItem {
  key: string;
  label: React.ReactNode;
  disabled?: boolean;
  children: React.ReactNode;
}

type AntdTabsProps = React.ComponentProps<typeof AntdTabs>;

export interface CustomTabsProps
  extends
    Omit<AntdTabsProps, 'items' | 'activeKey' | 'onChange' | 'tabType' | 'onTabScroll'>,
    VariantProps<typeof tabsVariants> {
  items?: TabItem[];
  activeKey?: string;
  onChange?: (key: string) => void;
  activeLineMode?: 'full' | 'auto';
  onTabScroll?: (info: { direction: 'left' | 'right' | 'top' | 'bottom' }) => void;
  tabPlacement?: AntdTabsProps['tabPlacement'];
}

export const CustomTabs = ({
  items,
  className,
  children,
  tabType = 'auto',
  activeLineMode = 'auto',
  activeKey,
  onChange,
  onTabScroll,
  tabPlacement = 'top',
  ...props
}: CustomTabsProps) => {
  const combinedClassName = tabsVariants({ className, tabType });

  const antdItems = items?.map((item) => ({
    key: item.key,
    label: item.label,
    disabled: item.disabled,
    children: item.children,
  }));

  const isHorizontal = tabPlacement === 'top' || tabPlacement === 'bottom';

  return (
    <AntdTabs
      className={`${combinedClassName} ${
        isHorizontal ? 'w-full [&_.ant-tabs-nav-list]:flex-nowrap [&_.ant-tabs-tab]:shrink-0' : ''
      }`}
      items={antdItems}
      activeKey={activeKey}
      onChange={onChange}
      centered={tabType === 'equal' && (items ? items.length < 5 : true)}
      onTabScroll={onTabScroll}
      tabPlacement={tabPlacement}
      tabBarStyle={{
        width: '100%',
      }}
      indicator={
        activeLineMode === 'full' ? { size: (origin) => origin, align: 'center' } : undefined
      }
      {...props}
    >
      {!items ? children : undefined}
    </AntdTabs>
  );
};
