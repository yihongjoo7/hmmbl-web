'use client';
/**
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  [개발자 레퍼런스]  ExamplePage.tsx                              │
 * │                                                                  │
 * │  역할 : 데이터 페칭 + 상태 관리 컨테이너                        │
 * │  작업자: 개발자                                                  │
 * │                                                                  │
 * │  이 파일이 담당하는 것                                           │
 * │  - React Query 로 서버 데이터 페칭                               │
 * │  - 로딩 / 에러 / 빈 데이터 분기 → View 에 props 전달            │
 * │  - URL 파라미터 처리 (useParams, useSearchParams)                │
 * │  - 사용자 액션 핸들러 정의 (클릭, 필터 변경, 페이지 이동 등)    │
 * │  - 라우터 이동 (useRouter)                                       │
 * │                                                                  │
 * │  이 파일이 담당하지 않는 것                                      │
 * │  - HTML/CSS 레이아웃  → ExampleView.tsx 에서 처리                │
 * │  - API 호출 직접 작성 → services/exampleApi.ts 에서 처리         │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * 연관 파일
 *   ExampleView.tsx          — UI 컴포넌트 (퍼블리셔 작성)
 *   hooks/useExampleList.ts  — 목록 데이터 + 필터 상태
 *   hooks/useExampleDetail.ts — 상세 데이터
 *   hooks/useExampleMutation.ts — 쓰기 작업 (좋아요, 삭제 등)
 *   services/exampleApi.ts   — API 엔드포인트 정의
 *   types/index.ts           — 도메인 타입
 */

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { ExampleView } from './ExampleView';
import { useExampleList } from './hooks/useExampleList';

// ─────────────────────────────────────────────────────────────────────────────
// 목록 화면 (List Page)
// ─────────────────────────────────────────────────────────────────────────────

export default function ExamplePage() {
  const router = useRouter();

  // ── URL 파라미터 ─────────────────────────────────────────────────────────
  // 동적 라우트 예: /earn/coupon/[id] → id 를 가져올 때
  // const params = useParams<{ id: string }>();

  // 쿼리 파라미터 예: /earn/coupon?filter=food
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') ?? 'all';

  // ── 데이터 페칭 ─────────────────────────────────────────────────────────
  // 커스텀 훅에서 React Query + 필터 상태를 모두 관리한다.
  // 이 Page 는 훅이 반환하는 값을 View 에 그대로 전달하기만 한다.
  const {
    items,
    filters,
    selectedFilter,
    isLoading,
    isError,
    error,
    setFilter,
    fetchNextPage,   // 무한 스크롤 / 더보기
    hasNextPage,
  } = useExampleList(initialFilter);

  // ── 이벤트 핸들러 ────────────────────────────────────────────────────────

  /** 아이템 클릭 → 상세 화면으로 이동 */
  function handleItemClick(id: string) {
    router.push(`/earn/example/${id}`);
  }

  /** 필터 변경 → URL 쿼리 파라미터 업데이트 (선택 사항) */
  function handleFilterChange(filterId: string) {
    setFilter(filterId);
    // URL 에 필터를 반영해야 한다면:
    // router.replace(`?filter=${filterId}`, { scroll: false });
  }

  /** 더보기 버튼 클릭 → 다음 페이지 페칭 */
  function handleLoadMore() {
    if (hasNextPage) fetchNextPage();
  }

  // ── 렌더 ─────────────────────────────────────────────────────────────────
  // Page 는 View 에 값을 전달하는 역할만 한다.
  // 레이아웃·스타일 코드를 여기에 작성하지 않는다.
  return (
    <ExampleView
      items={items}
      filters={filters}
      selectedFilter={selectedFilter}
      isLoading={isLoading}
      // 에러 발생 시 문자열 메시지로 변환해서 전달
      // View 는 에러 객체를 알 필요가 없다.
      errorMessage={isError ? (error?.message ?? '오류가 발생했습니다') : undefined}
      onItemClick={handleItemClick}
      onFilterChange={handleFilterChange}
      onLoadMore={hasNextPage ? handleLoadMore : undefined}
    />
  );
}
