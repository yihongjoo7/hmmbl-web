'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function usePurchaseHistory() { const { data, isLoading } = useQuery({ queryKey: ['my', 'purchase'], queryFn: () => apiClient.get<{ purchases: { id: string; title: string; category: string; price: number; purchasedAt: string }[] }>('/my/purchases') }); return { purchases: data?.purchases ?? [], isLoading }; }
