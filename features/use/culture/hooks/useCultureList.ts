'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useCultureList() { const { data, isLoading } = useQuery({ queryKey: ['use', 'culture', 'list'], queryFn: () => apiClient.get<{ items: { id: string; title: string; category: string; price: number; point: number }[] }>('/use/culture') }); return { items: data?.items ?? [], isLoading }; }
