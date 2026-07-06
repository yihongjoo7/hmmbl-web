'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useBadge() { const { data, isLoading } = useQuery({ queryKey: ['my', 'badge'], queryFn: () => apiClient.get<{ badges: { id: string; title: string; isAcquired: boolean; acquiredAt?: string }[] }>('/my/badges') }); return { badges: data?.badges ?? [], isLoading }; }
