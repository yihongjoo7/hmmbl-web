'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useCardList() { const { data, isLoading } = useQuery({ queryKey: ['pay', 'card', 'list'], queryFn: () => apiClient.get<{ cards: { id: string; name: string; last4: string; isPrimary: boolean }[] }>('/pay/cards') }); return { cards: data?.cards ?? [], isLoading }; }
