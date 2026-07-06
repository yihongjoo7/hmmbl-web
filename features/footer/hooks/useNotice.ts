'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useNotice() { const { data, isLoading } = useQuery({ queryKey: ['footer', 'notice'], queryFn: () => apiClient.get<{ notices: { id: string; title: string; date: string; isImportant?: boolean }[] }>('/footer/notices') }); return { notices: data?.notices ?? [], isLoading }; }
