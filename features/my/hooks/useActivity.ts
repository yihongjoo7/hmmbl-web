'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useActivity() { const { data, isLoading } = useQuery({ queryKey: ['my', 'activity'], queryFn: () => apiClient.get<{ items: { id: string; type: string; title: string; date: string; reward?: number }[] }>('/my/activity') }); return { items: data?.items ?? [], isLoading }; }
