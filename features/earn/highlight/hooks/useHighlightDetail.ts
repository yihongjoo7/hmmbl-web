'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useHighlightDetail(id: string) { const { data, isLoading } = useQuery({ queryKey: ['earn', 'highlight', id], queryFn: () => apiClient.get<{ title: string; brand: string; description?: string; reward: number; expiresAt: string; isClaimed: boolean }>(`/earn/highlights/${id}`) }); const { mutate: claim } = useMutation({ mutationFn: () => apiClient.post(`/earn/highlights/${id}/claim`) }); return { highlight: data, isLoading, claim }; }
