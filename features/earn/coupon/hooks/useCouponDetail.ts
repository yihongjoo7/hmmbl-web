'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
import { couponQueryKeys } from '../services/queryKeys';

export function useCouponDetail(id: string) {
  const { data, isLoading } = useQuery({ queryKey: couponQueryKeys.detail(id), queryFn: () => apiClient.get<{ id: string; brand: string; title: string; discount: string; description?: string; expiresAt: string; barcode?: string }>(`/earn/coupons/${id}`) });
  const { mutate: use } = useMutation({ mutationFn: () => apiClient.post(`/earn/coupons/${id}/use`) });
  return { coupon: data, isLoading, use };
}
