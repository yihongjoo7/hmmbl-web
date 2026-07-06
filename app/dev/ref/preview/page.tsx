'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PubLayout } from '@/pub/_mock/PubLayout';
import { ExampleView } from '@/features/_templates/ExampleView';

// ─── 목업 데이터 ──────────────────────────────────────────────────────────────

const MOCK_FILTERS = [
  { id: 'all',     label: '전체' },
  { id: 'food',    label: '식음료' },
  { id: 'culture', label: '문화' },
  { id: 'beauty',  label: '뷰티' },
];

const MOCK_ITEMS = [
  {
    id: '1',
    title: '스타벅스 아메리카노 50% 할인 쿠폰',
    description: '전국 스타벅스 매장에서 사용 가능한 아메리카노 50% 할인 쿠폰입니다.',
    thumbnailUrl: '',
    badge: 'NEW',
  },
  {
    id: '2',
    title: '롯데시네마 영화 관람권',
    description: '전국 롯데시네마에서 사용 가능한 일반 영화 관람권입니다.',
    thumbnailUrl: '',
    badge: 'HOT',
  },
  {
    id: '3',
    title: 'GS25 편의점 1,000원 할인',
    description: '5,000원 이상 구매 시 사용 가능한 편의점 할인 쿠폰입니다.',
    thumbnailUrl: '',
  },
  {
    id: '4',
    title: '올리브영 3,000원 할인권',
    description: '올리브영 온·오프라인 매장에서 사용 가능한 할인권입니다.',
    thumbnailUrl: '',
  },
  {
    id: '5',
    title: '배스킨라빈스 싱글 레귤러 교환권',
    description: '전국 배스킨라빈스 매장에서 싱글 레귤러 아이스크림으로 교환 가능합니다.',
    thumbnailUrl: '',
    badge: 'NEW',
  },
];

// 필터별 목업 (food / culture / beauty 는 각각 일부만 노출)
const FILTER_MAP: Record<string, typeof MOCK_ITEMS> = {
  all:     MOCK_ITEMS,
  food:    MOCK_ITEMS.filter((_, i) => [0, 2, 4].includes(i)),
  culture: MOCK_ITEMS.filter((_, i) => [1].includes(i)),
  beauty:  MOCK_ITEMS.filter((_, i) => [3].includes(i)),
};

// ─── 상태 시나리오 탭 ─────────────────────────────────────────────────────────

type Scenario = 'normal' | 'loading' | 'empty' | 'error';

const SCENARIOS: { id: Scenario; label: string }[] = [
  { id: 'normal',  label: '정상' },
  { id: 'loading', label: '로딩' },
  { id: 'empty',   label: '빈 상태' },
  { id: 'error',   label: '에러' },
];

// ─── 페이지 컴포넌트 ──────────────────────────────────────────────────────────

export default function RefPreviewPage() {
  const router = useRouter();
  const [scenario, setScenario] = useState<Scenario>('normal');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const items = scenario === 'normal' ? (FILTER_MAP[selectedFilter] ?? []) : [];

  return (
    <div className="flex flex-col items-center gap-4 py-6 px-4">

      {/* 뒤로가기 + 제목 */}
      <div className="w-full max-w-[480px] flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-800"
        >
          ← 뒤로
        </button>
        <h1 className="text-base font-bold text-gray-900">ExampleView 미리보기</h1>
      </div>

      {/* 시나리오 전환 탭 */}
      <div className="flex gap-2 w-full max-w-[480px]">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setScenario(s.id)}
            className={[
              'flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors',
              scenario === s.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            ].join(' ')}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 모바일 프레임 */}
      <PubLayout title="ExampleView">
        <ExampleView
          items={items}
          filters={MOCK_FILTERS}
          selectedFilter={selectedFilter}
          isLoading={scenario === 'loading'}
          errorMessage={scenario === 'error' ? '데이터를 불러오지 못했습니다' : undefined}
          onItemClick={(id) => alert(`클릭: item #${id}`)}
          onFilterChange={setSelectedFilter}
          onLoadMore={scenario === 'normal' ? () => alert('더보기 클릭') : undefined}
        />
      </PubLayout>

    </div>
  );
}
