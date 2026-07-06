'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useHighlightList() { const { data, isLoading } = useQuery({ queryKey: ['earn', 'highlight', 'list'], queryFn: () => apiClient.get<{ highlights: { id: string; title: string; brand: string; imageUrl?: string; reward: number; expiresAt: string }[] }>('/earn/highlights') }); return { highlights: data?.highlights ?? [], isLoading }; }
