'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useCultureDetail(id: string) { const { data, isLoading } = useQuery({ queryKey: ['use', 'culture', id], queryFn: () => apiClient.get<{ title: string; category: string; description?: string; point: number; audioUrl?: string }>(`/use/culture/${id}`) }); return { item: data, isLoading }; }
