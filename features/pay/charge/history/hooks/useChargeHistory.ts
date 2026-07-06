'use client';
// [개발자] charge-history 목록 조회 훅
// 의존: @tanstack/react-query, apiClient
// queryKey 구조: ['pay', 'charge-history', 'list']
// TODO: 섹션명 = earn | use | pay | member | my | footer | settings | main 중 하나

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
// TODO: 타입 확정 후 아래 import 활성화
// import type { charge-historyItem } from '../types';

export function useChargeHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ['pay', 'charge-history', 'list'] as const, // TODO: 섹션명·기능명 변경
    queryFn: () =>
      apiClient.get<{ items: { id: string }[] }>('charge-history'), // TODO: 엔드포인트·응답 타입 변경
  });

  return {
    items: data?.items ?? [], // TODO: 응답 키명 확인
    isLoading,
  };
}
