'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useNotificationSettings() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['settings', 'notification'], queryFn: () => apiClient.get<{ settings: { id: string; label: string; enabled: boolean }[] }>('/settings/notifications') });
  const { mutate: toggle } = useMutation({ mutationFn: (id: string) => apiClient.post(`/settings/notifications/${id}/toggle`), onSuccess: () => qc.invalidateQueries({ queryKey: ['settings', 'notification'] }) });
  return { settings: data?.settings ?? [], isLoading, toggle };
}
