'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useMissionList() {
  const { data, isLoading } = useQuery({ queryKey: ['earn', 'mission', 'list'], queryFn: () => apiClient.get<{ missions: { id: string; title: string; reward: number; progress: number; total: number; isCompleted: boolean }[] }>('/earn/missions') });
  return { missions: data?.missions ?? [], isLoading };
}
