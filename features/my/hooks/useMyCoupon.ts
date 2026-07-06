'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useMyCoupon() { const { data, isLoading } = useQuery({ queryKey: ['my', 'coupon'], queryFn: () => apiClient.get<{ coupons: { id: string; title: string; brand: string; expiresAt: string; status: 'available' | 'used' | 'expired' }[] }>('/my/coupons') }); return { coupons: data?.coupons ?? [], isLoading }; }
