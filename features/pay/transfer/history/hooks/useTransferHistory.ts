'use client';
// [개발자] transfer-history 목록 조회 훅

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';

export function useTransferHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ['pay', 'transfer-history', 'list'] as const,
    queryFn: () => apiClient.get<{ items: unknown[] }>('transfer-history'),
  });
  return { items: data?.items ?? [], isLoading };
}
