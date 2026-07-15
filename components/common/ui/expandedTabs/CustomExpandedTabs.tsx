'use client';

import React, { useRef, useState } from 'react';
import { CustomTabs } from '../tabs/CustomTabs';
import { CustomIconButton } from '../iconButton/CustomIconButton';
import { ExpandedBottomsheet } from '../bottomsheet/ExpandedBottomsheet';

//외부에서 주입받을 데이터 타입
interface ExpandedTabItem {
  label: string;
  value: string;
  index: number;
  children: React.ReactNode;
}

//컴포넌트가 받을 props 타입
interface CustomExpandedTabsProps {
  items: ExpandedTabItem[];
}
export const CustomExpandedTabs = ({ items }: CustomExpandedTabsProps) => {
  //활성화된 탭 관리
  const [activeKey, setActiveKey] = useState(items[0]?.value || '1');

  //스와이프 컨테이너 제어를 위한 ref
  const scrollRef = useRef<HTMLDivElement>(null);

  // 탭 클릭시 스크롤 컨테이너 연동
  const handleTabChange = (key: string) => {
    setActiveKey(key);
    const targetItem = items.find((item) => item.value === key);
    const container = scrollRef.current;
    if (targetItem && container) {
      const slide = container.children[targetItem.index] as HTMLElement | undefined;
      slide?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
  };

  // 스크롤 위치 변화 시 탭 인덱스 동기화
  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || container.clientWidth === 0) return;
    const index = Math.round(container.scrollLeft / container.clientWidth);
    const targetItem = items.find((item) => item.index === index);
    if (targetItem && targetItem.value !== activeKey) {
      setActiveKey(targetItem.value);
    }
  };

  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <div className="pr-[30px]">
        <CustomTabs
          items={items}
          tabType="auto"
          activeLineMode="full"
          activeKey={activeKey}
          onChange={handleTabChange}
        ></CustomTabs>
      </div>
      <div className="absolute top-[6px] right-4 flex-shrink-0 z-[1001]">
        <CustomIconButton
          ariaLabel={visible ? '메뉴 닫기' : '메뉴 펼쳐보기'}
          size="sm"
          // icon={<DownOutlined />}
          className={`text-outline-900 text-[24px] transition-transform duration-300 transform-gpu will-change-transform [&_svg]:backface-hidden ${visible ? 'rotate-180' : 'rotate-0'}`}
          onClick={() => setVisible(!visible)}
        />
      </div>

      {/* 스와이프 영역 */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div key={item.value} className="w-full shrink-0 snap-start">
            <div className="flex h-[500px] items-center justify-center bg-bg-900 text-white">
              {item.label} 컨텐츠
            </div>
          </div>
        ))}
      </div>

      {/* 바텀시트 컴포넌트 */}
      <ExpandedBottomsheet
        visible={visible}
        onClose={() => setVisible(false)}
        items={items}
        onSelect={handleTabChange}
      />
    </div>
  );
};
