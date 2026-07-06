'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useSubscriptionCoupon() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['use', 'subscription', 'list'], queryFn: () => apiClient.get<{ coupons: { id: string; title: string; brand: string; discountRate: number; monthlyFee: number; isSubscribed?: boolean }[] }>('/use/subscriptions') });
  const { mutate: subscribe } = useMutation({ mutationFn: (id: string) => apiClient.post(`/use/subscriptions/${id}/subscribe`), onSuccess: () => qc.invalidateQueries({ queryKey: ['use', 'subscription', 'list'] }) });
  return { coupons: data?.coupons ?? [], isLoading, subscribe };
}
