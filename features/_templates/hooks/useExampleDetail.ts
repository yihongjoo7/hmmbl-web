'use client';
/**
 * ┌──────────────────────────────────────────────────────────────────┐
 * │  [개발자 레퍼런스]  hooks/useExampleDetail.ts                    │
 * │                                                                  │
 * │  역할 : 상세 단건 데이터 페칭                                    │
 * │  사용처: ExampleDetailPage.tsx                                   │
 * └──────────────────────────────────────────────────────────────────┘
 */

import { useQuery } from '@tanstack/react-query';
import { exampleApi } from '../services/exampleApi';
import { exampleQueryKeys } from './useExampleList';

export function useExampleDetail(id: string) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: exampleQueryKeys.detail(id),
    queryFn: () => exampleApi.detail(id),

    // id 가 없으면 요청 자체를 막는다.
    // enabled 가 false 이면 isLoading 은 false, data 는 undefined 로 유지.
    enabled: !!id,

    staleTime: 1000 * 60 * 5,
  });

  return {
    item: data ?? null,
    isLoading,
    isError,
    error: error as Error | null,
  };
}
