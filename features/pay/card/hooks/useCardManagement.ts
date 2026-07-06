'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useCardManagement() {
  const qc = useQueryClient();
  const inv = () => qc.invalidateQueries({ queryKey: ['pay', 'card', 'list'] });
  const { mutate: registerCard } = useMutation({ mutationFn: (data: unknown) => apiClient.post('/pay/cards', data), onSuccess: inv });
  const { mutate: deleteCard }   = useMutation({ mutationFn: (id: string) => apiClient.delete(`/pay/cards/${id}`), onSuccess: inv });
  const { mutate: setPrimary }   = useMutation({ mutationFn: (id: string) => apiClient.post(`/pay/cards/${id}/primary`), onSuccess: inv });
  return { registerCard, deleteCard, setPrimary };
}
