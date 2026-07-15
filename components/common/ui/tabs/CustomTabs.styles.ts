import { cva } from 'class-variance-authority';

export const tabsVariants = cva(
  [
    'custom-antd-tabs w-full',

    // ❌ [수정] Antd 내장 스크롤과 충돌하는 !overflow-x-auto를 완전히 제거합니다.
    // 💡대신 브라우저 고유 스크롤바가 지저분하게 노출되는 것을 막기 위해 scrollbar-none을 적용합니다.
    '[&_.ant-tabs-nav-wrap]:scrollbar-none',

    '[&_.ant-tabs-nav]:!mx-0 [&_.ant-tabs-nav]:!px-6 [&_.ant-tabs-nav:before]:border-b-outline-300',
    '[&_.ant-tabs-tab_svg]:!mr-1 [&_.ant-tabs-tab_svg]:!shrink-0',
    '[&_.ant-tabs-ink-bar]:!h-[4px] [&_.ant-tabs-ink-bar]:!bg-[#424249]',

    // 폰트 및 액티브 스타일
    '[&_.ant-tabs-tab_.ant-tabs-tab-btn]:text-title-m [&_.ant-tabs-tab_.ant-tabs-tab-btn]:text-font-700',
    '[&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-font-900 [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:font-bold',

    // 개별 탭 찌그러짐 방지 및 최소 너비 확보 유지
    '[&_.ant-tabs-tab]:!shrink-0 [&_.ant-tabs-tab]:min-w-max',
  ].join(' '),
  {
    variants: {
      tabType: {
        auto: '[&_.ant-tabs-nav-list]:!justify-start',

        // equal 구조도 완전히 격리하여 모바일에서는 auto처럼 유연하게 스크롤 길을 열어줍니다.
        equal:
          'md:[&_.ant-tabs-nav-list]:!w-full md:[&_.ant-tabs-tab]:!m-0 md:[&_.ant-tabs-tab]:!flex-1 md:[&_.ant-tabs-tab]:!justify-center',
      },
    },
    defaultVariants: {
      tabType: 'auto',
    },
  }
);
