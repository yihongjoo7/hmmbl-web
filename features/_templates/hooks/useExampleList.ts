'use client';
/**
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  [개발자 레퍼런스]  hooks/useExampleList.ts                      │
 * │                                                                  │
 * │  역할 : 목록 데이터 페칭 + 클라이언트 필터 상태 관리             │
 * │  사용처: ExamplePage.tsx                                         │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * 패턴 선택 가이드
 *   - 단순 목록 (페이지 없음)  → useQuery (아래 ① 참고)
 *   - 더보기 / 무한 스크롤    → useInfiniteQuery (아래 ② 참고)
 *   - 필터/정렬이 있는 목록   → queryKey 에 필터 포함 (캐시 자동 분리)
 */

import { useState } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { exampleApi } from '../services/exampleApi';
import type { ExampleItem, FilterOption } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// Query Key 팩토리
// 같은 도메인의 모든 키를 한 곳에서 관리 → invalidate 시 실수 방지
// ─────────────────────────────────────────────────────────────────────────────

export const exampleQueryKeys = {
  /** 모든 example 쿼리의 루트 키 */
  all: ['example'] as const,
  /** 목록 쿼리 (필터 포함) */
  list: (filter: string) => [...exampleQueryKeys.all, 'list', filter] as const,
  /** 상세 쿼리 */
  detail: (id: string) => [...exampleQueryKeys.all, 'detail', id] as const,
};

// ─────────────────────────────────────────────────────────────────────────────
// 필터 옵션 (서버에서 받아오는 경우 별도 useQuery 사용)
// ─────────────────────────────────────────────────────────────────────────────

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all',     label: '전체' },
  { id: 'food',    label: '식음료' },
  { id: 'culture', label: '문화' },
  { id: 'beauty',  label: '뷰티' },
];

// ─────────────────────────────────────────────────────────────────────────────
// ① 단순 목록 훅 (페이지네이션 없음)
// ─────────────────────────────────────────────────────────────────────────────

export function useExampleList(initialFilter = 'all') {
  // 클라이언트 필터 상태 — 변경 시 queryKey 가 바뀌어 자동 재요청
  const [selectedFilter, setFilter] = useState(initialFilter);

  const { data, isLoading, isError, error } = useQuery({
    // queryKey 에 selectedFilter 포함 → 필터별로 캐시 독립 관리
    queryKey: exampleQueryKeys.list(selectedFilter),
    queryFn: () => exampleApi.list({ filter: selectedFilter }),

    // staleTime: 이 시간 동안은 캐시된 데이터를 "신선"으로 간주 → 재요청 없음
    // 자주 바뀌지 않는 데이터는 높게 설정 (예: 5분)
    staleTime: 1000 * 60 * 5,

    // gcTime(구 cacheTime): 컴포넌트 언마운트 후 캐시 보존 시간
    // gcTime: 1000 * 60 * 10,

    // 에러 시 재시도 횟수 (기본 3회 → 네트워크 에러가 잦은 모바일에서는 1~2회 권장)
    retry: 1,
  });

  return {
    items: data?.items ?? [],         // View 에 전달할 목록
    filters: FILTER_OPTIONS,          // 필터 탭 옵션
    selectedFilter,
    isLoading,
    isError,
    error: error as Error | null,
    setFilter,
    // 더보기/무한스크롤이 필요하면 아래 ② 패턴으로 교체
    fetchNextPage: () => {},
    hasNextPage: false,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ② 무한 스크롤 훅 (더보기 버튼 또는 IntersectionObserver 방식)
//    단순 목록이 필요 없다면 위 훅을 삭제하고 이 훅으로 교체
// ─────────────────────────────────────────────────────────────────────────────

export function useExampleInfiniteList(initialFilter = 'all') {
  const [selectedFilter, setFilter] = useState(initialFilter);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: exampleQueryKeys.list(selectedFilter),
    queryFn: ({ pageParam = 1 }) =>
      exampleApi.listPaged({ filter: selectedFilter, page: pageParam as number }),

    // 다음 페이지 번호를 결정하는 함수
    // 서버 응답에 nextPage 필드가 있으면 그 값을, 없으면 undefined 반환
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,

    initialPageParam: 1,
    staleTime: 1000 * 60 * 5,
  });

  // useInfiniteQuery 는 pages 배열로 데이터를 반환 → 평탄화(flatten) 필요
  const items: ExampleItem[] = data?.pages.flatMap((page) => page.items) ?? [];

  return {
    items,
    filters: FILTER_OPTIONS,
    selectedFilter,
    isLoading,
    isError,
    error: error as Error | null,
    setFilter,
    fetchNextPage,
    hasNextPage: !!hasNextPage,
    isFetchingNextPage,
  };
}
