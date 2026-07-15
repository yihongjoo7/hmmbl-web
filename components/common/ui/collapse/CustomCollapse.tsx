import React from 'react';
import { Collapse as AntdCollapse } from 'antd';
import { VariantProps } from 'class-variance-authority';
import { collapseVariants } from './CustomCollapse.styles';

export interface CollapseItem {
  label: React.ReactNode;
  value: string;
  content?: React.ReactNode;
}

type AntdCollapseProps = React.ComponentProps<typeof AntdCollapse>;

//공통 props 정의
interface BaseCustomCollapseProps extends VariantProps<typeof collapseVariants> {
  items: CollapseItem[];
  arrowIcon?: React.ReactNode | ((active: boolean) => React.ReactNode);
  className?: string;
}

// 아코디언 모드일때 props 정의
interface AccordionCollapseProps extends BaseCustomCollapseProps {
  accordion: true;
  activeKey?: string | null;
  defaultActiveKey?: string;
  onChange: (key: string | null) => void;
}

//일반 모드일때  props 정의
interface NormalCollapseProps extends BaseCustomCollapseProps {
  accordion: false;
  activeKey?: string[] | null;
  defaultActiveKey?: string[];
  onChange: (key: string[] | null) => void;
}

// 두 타입을 유니온으로 합쳐 최종 props 정의
export type CustomCollapseProps = AccordionCollapseProps | NormalCollapseProps;

export const CustomCollapse: React.FC<CustomCollapseProps> = (props) => {
  const {
    items = [],
    arrowIcon = <img src="/images/icons/common/Button_Icon.svg" alt="arrow" className="w-5 h-5" />,
    className,
    accordion,
    activeKey,
    defaultActiveKey,
    onChange,
  } = props;
  const combinedClassName = collapseVariants({ className });

  const collapseItems: AntdCollapseProps['items'] = items.map((item) => ({
    key: item.value,
    label: item.label,
    children: item.content ?? `${item.label}의 상세내용입니다`,
  }));

  const expandIcon: AntdCollapseProps['expandIcon'] =
    typeof arrowIcon === 'function'
      ? ({ isActive }) => arrowIcon(!!isActive)
      : () => arrowIcon;

  return (
    <AntdCollapse
      ghost
      className={combinedClassName}
      items={collapseItems}
      accordion={accordion}
      activeKey={(activeKey ?? undefined) as string | string[] | undefined}
      defaultActiveKey={defaultActiveKey as string | string[] | undefined}
      onChange={onChange as (key: string | string[]) => void}
      expandIcon={expandIcon}
    />
  );
};
