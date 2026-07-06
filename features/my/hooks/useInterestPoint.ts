'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useInterestPoint() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['my', 'interest-point'], queryFn: () => apiClient.get<{ points: { id: string; name: string; address: string; category: string }[] }>('/my/interest-points') });
  const { mutate: remove } = useMutation({ mutationFn: (id: string) => apiClient.delete(`/my/interest-points/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['my', 'interest-point'] }) });
  return { points: data?.points ?? [], isLoading, remove };
}
