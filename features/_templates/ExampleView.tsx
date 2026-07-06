/**
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  [퍼블리셔 레퍼런스]  ExampleView.tsx                            │
 * │                                                                  │
 * │  역할 : UI 전담 컴포넌트 (순수 표현층)                           │
 * │  작업자: 퍼블리셔                                                │
 * │                                                                  │
 * │  계층 구조                                                       │
 * │  app/…/page.tsx  (Next.js 라우트, 개발자 작성)                   │
 * │      └─ ExamplePage.tsx  (데이터 컨테이너, 개발자 작성)          │
 * │              └─ ExampleView.tsx  ← 이 파일                      │
 * │                                                                  │
 * │  규칙                                                            │
 * │  ✅ Tailwind 유틸리티 클래스로 스타일링                          │
 * │  ✅ next/image 사용  (img 태그 직접 사용 금지)                   │
 * │  ✅ props 를 통해서만 데이터 수신                                │
 * │  ✅ 콜백 props 는 optional (?) 로 선언 — 목업 단독 렌더 가능    │
 * │  ❌ useState / useEffect / fetch 등 사이드 이펙트 금지           │
 * │  ❌ apiClient / React Query 직접 호출 금지                       │
 * │  ❌ useRouter / useParams 사용 금지  (Page 담당)                 │
 * └──────────────────────────────────────────────────────────────────┘
 */

import Image from 'next/image';

// ─────────────────────────────────────────────────────────────────────────────
// 1. 타입 정의
//    - 이 View 가 표시할 데이터 구조를 명시한다.
//    - 개발자와 협의 후 확정; 먼저 목업 작업이 필요하면 임시 타입으로 시작해도 됨.
// ─────────────────────────────────────────────────────────────────────────────

/** 목록 아이템 1개 */
interface ExampleItem {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  /** 배지 텍스트 (예: "NEW", "HOT"). 없으면 표시 안 함 */
  badge?: string;
}

/** 탭·필터 1개 */
interface FilterOption {
  id: string;
  label: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Props 인터페이스
//    - Page → View 로 내려오는 모든 값을 여기서 선언한다.
//    - 콜백(onClick 류)은 모두 optional 로 선언 → Storybook/목업 단독 실행 가능.
//    - 데이터 props 도 optional + 기본값 제공을 권장 → 목업 더미 데이터로 작동.
// ─────────────────────────────────────────────────────────────────────────────

interface ExampleViewProps {
  // ── 데이터 ─────────────────────────────────────────────────────────────────
  /** 목록 아이템 배열 */
  items?: ExampleItem[];
  /** 필터 옵션 배열 */
  filters?: FilterOption[];
  /** 현재 선택된 필터 id */
  selectedFilter?: string;

  // ── 상태 ───────────────────────────────────────────────────────────────────
  /**
   * true 이면 로딩 스켈레톤 표시.
   * 서버 응답 대기 중일 때 Page 가 전달한다.
   */
  isLoading?: boolean;
  /**
   * 에러 메시지 문자열.
   * 있으면 에러 UI 표시, 없으면 정상 렌더.
   */
  errorMessage?: string;

  // ── 이벤트 콜백 ────────────────────────────────────────────────────────────
  /** 아이템 클릭 → Page 가 라우터 이동 처리 */
  onItemClick?: (id: string) => void;
  /** 필터 변경 → Page 가 쿼리 파라미터 또는 상태 업데이트 */
  onFilterChange?: (filterId: string) => void;
  /** 더보기 버튼 클릭 (페이지네이션 또는 무한스크롤 트리거) */
  onLoadMore?: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. 메인 컴포넌트
// ─────────────────────────────────────────────────────────────────────────────

export function ExampleView({
  items = [],
  filters = [],
  selectedFilter,
  isLoading = false,
  errorMessage,
  onItemClick,
  onFilterChange,
  onLoadMore,
}: ExampleViewProps) {

  // ── 3-1. 로딩 상태 ─────────────────────────────────────────────────────────
  // 데이터 페칭 중일 때 표시.
  // animate-pulse 로 Tailwind 기본 스켈레톤을 구현하거나,
  // 공용 <Skeleton /> 컴포넌트가 있으면 교체.
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4 animate-pulse">
        {/* 필터 스켈레톤 */}
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-16 rounded-full bg-gray-200" />
          ))}
        </div>
        {/* 카드 스켈레톤 */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-16 h-16 rounded-xl bg-gray-200 shrink-0" />
            <div className="flex-1 flex flex-col gap-2 justify-center">
              <div className="h-3 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── 3-2. 에러 상태 ─────────────────────────────────────────────────────────
  // Page 가 errorMessage 를 넘길 때 표시.
  // 공용 <ErrorPage /> 컴포넌트가 있으면 교체해도 됨.
  if (errorMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center px-6">
        {/* 에러 아이콘 자리 (SVG 또는 이미지로 교체) */}
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-2xl">
          ⚠️
        </div>
        <p className="text-sm text-gray-500">{errorMessage}</p>
        {/* 재시도 버튼이 필요하면 onRetry 콜백 props 추가 */}
      </div>
    );
  }

  // ── 3-3. 빈 상태 ───────────────────────────────────────────────────────────
  // 로딩 완료 후 데이터가 0개일 때 표시.
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center px-6">
        {/* 빈 상태 일러스트 자리 */}
        <div className="w-20 h-20 rounded-full bg-gray-100" />
        <p className="text-sm font-medium text-gray-700">항목이 없습니다</p>
        <p className="text-xs text-gray-400">조건을 변경해 다시 시도해 보세요</p>
      </div>
    );
  }

  // ── 3-4. 정상 렌더 ─────────────────────────────────────────────────────────
  return (
    // 최상위: 세로 스크롤 전체 컨테이너
    // pb-safe: 홈 인디케이터 영역 확보 (iOS safe-area)
    <div className="flex flex-col min-h-screen pb-safe">

      {/* ── 섹션: 필터 탭 ───────────────────────────────────────────────── */}
      {/* sticky: 스크롤 시 상단 고정. z-10 으로 리스트 아이템보다 위에 위치. */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => onFilterChange?.(filter.id)}
              // 선택된 필터: 파란 배경 / 미선택: 회색 배경
              // 디자인 시스템 토큰이 있으면 bg-primary, text-on-primary 등으로 교체
              className={[
                'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium',
                'transition-colors duration-150',
                selectedFilter === filter.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
              ].join(' ')}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 섹션: 아이템 목록 ────────────────────────────────────────────── */}
      <ul className="flex flex-col divide-y divide-gray-100 px-4">
        {items.map((item) => (
          // 아이템 카드 1개 — 별도 컴포넌트(<ExampleCard />)로 분리 가능
          <li
            key={item.id}
            onClick={() => onItemClick?.(item.id)}
            // active: 터치 피드백 (모바일 UX)
            className="flex items-center gap-4 py-4 cursor-pointer active:bg-gray-50"
          >
            {/* 썸네일 */}
            {/* Image: width/height 는 Tailwind 클래스가 아닌 next/image 속성으로 제공 */}
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
              <Image
                src={item.thumbnailUrl || '/images/placeholder.png'}
                alt={item.title}
                fill
                className="object-cover"
                // 외부 이미지 도메인은 next.config.js images.domains 에 등록 필요
              />
              {/* 배지 (있을 때만 표시) */}
              {item.badge && (
                <span className="absolute top-1 left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
              )}
            </div>

            {/* 텍스트 영역 */}
            {/* min-w-0: flex 자식의 truncate 가 동작하려면 반드시 필요 */}
            <div className="flex-1 min-w-0">
              {/* 제목: 1줄 말줄임 */}
              <p className="font-medium text-gray-900 truncate">{item.title}</p>
              {/* 설명: 2줄 말줄임 */}
              <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* 우측 화살표 (선택) */}
            <svg
              className="w-4 h-4 text-gray-300 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </li>
        ))}
      </ul>

      {/* ── 섹션: 더보기 버튼 ────────────────────────────────────────────── */}
      {/* onLoadMore 가 있을 때만 표시 (페이지네이션 방식) */}
      {/* 무한 스크롤 방식이면 이 버튼 대신 <IntersectionObserver /> 패턴 사용 */}
      {onLoadMore && (
        <div className="px-4 py-6">
          <button
            type="button"
            onClick={onLoadMore}
            className="w-full py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            더보기
          </button>
        </div>
      )}

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. 퍼블리셔 체크리스트
//
//  [ ] 로딩 스켈레톤이 실제 레이아웃과 모양이 비슷한가?
//  [ ] 빈 상태 일러스트/문구가 기획서와 일치하는가?
//  [ ] 에러 상태 문구가 기획서와 일치하는가?
//  [ ] 아이템 썸네일 비율이 깨지지 않는가? (object-cover / object-contain 확인)
//  [ ] truncate / line-clamp 가 긴 텍스트에서 정상 동작하는가?
//  [ ] 모바일 safe-area (pb-safe) 가 iOS 홈 인디케이터를 가리지 않는가?
//  [ ] 필터 탭이 가로 스크롤 시 scrollbar 가 보이지 않는가? (scrollbar-hide)
//  [ ] 터치 피드백 (active:bg-*) 이 각 인터랙션 요소에 적용되어 있는가?
// ─────────────────────────────────────────────────────────────────────────────
