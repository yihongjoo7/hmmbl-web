'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useHistory() { const { data, isLoading } = useQuery({ queryKey: ['my', 'history'], queryFn: () => apiClient.get<{ items: { id: string; category: string; title: string; date: string; amount: number }[] }>('/my/history') }); return { items: data?.items ?? [], isLoading }; }
