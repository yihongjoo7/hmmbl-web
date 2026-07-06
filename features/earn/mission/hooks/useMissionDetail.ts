'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useMissionDetail(id: string) {
  const { data, isLoading } = useQuery({ queryKey: ['earn', 'mission', id], queryFn: () => apiClient.get<{ title: string; description?: string; reward: number; progress: number; total: number; isCompleted: boolean }>(`/earn/missions/${id}`) });
  const { mutate: participate } = useMutation({ mutationFn: () => apiClient.post(`/earn/missions/${id}/participate`) });
  return { mission: data, isLoading, participate };
}
