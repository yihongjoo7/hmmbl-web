'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useMerchantList() { const { data, isLoading } = useQuery({ queryKey: ['pay', 'brand-payment', 'merchants'], queryFn: () => apiClient.get('/pay/brand-payment/merchants') }); return { merchants: data, isLoading }; }
