'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useWishlist() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['my', 'wishlist'], queryFn: () => apiClient.get<{ items: { id: string; title: string; type: 'event' | 'coupon'; imageUrl?: string }[] }>('/my/wishlist') });
  const { mutate: remove } = useMutation({ mutationFn: (id: string) => apiClient.delete(`/my/wishlist/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['my', 'wishlist'] }) });
  return { items: data?.items ?? [], isLoading, remove };
}
