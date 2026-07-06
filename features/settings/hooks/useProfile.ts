'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useProfile() {
  const qc = useQueryClient();
  const { data: profile, isLoading } = useQuery({ queryKey: ['settings', 'profile'], queryFn: () => apiClient.get<{ name: string; phone: string; email: string }>('/settings/profile') });
  const { mutate: update } = useMutation({ mutationFn: (data: unknown) => apiClient.put('/settings/profile', data), onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'profile'] }) });
  return { profile, isLoading, update };
}
