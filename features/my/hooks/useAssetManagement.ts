'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useAssetManagement() { const { data, isLoading } = useQuery({ queryKey: ['my', 'asset'], queryFn: () => apiClient.get<{ totalPoint: number; cashBalance: number; chargeHistory?: { date: string; amount: number }[] }>('/my/asset') }); return { asset: data, isLoading }; }
