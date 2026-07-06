'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { mainQueryKeys } from '../services/queryKeys';

interface NotifItem { id: string; title: string; body: string; isRead: boolean; createdAt: string; }

export function useNotification() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: mainQueryKeys.notifications(),
    queryFn: () => apiClient.get<{ items: NotifItem[] }>('/main/notifications'),
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: (id: string) => apiClient.post(`/main/notifications/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: mainQueryKeys.notifications() }),
  });

  return { items: data?.items ?? [], isLoading, markAsRead };
}
