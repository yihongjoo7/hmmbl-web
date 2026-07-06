'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useChallenge(id: string) { const { data, isLoading } = useQuery({ queryKey: ['earn', 'challenge', id], queryFn: () => apiClient.get<{ title: string; description?: string; reward: number; duration: string; isJoined: boolean; progress?: number }>(`/earn/challenges/${id}`) }); const { mutate: join } = useMutation({ mutationFn: () => apiClient.post(`/earn/challenges/${id}/join`) }); return { challenge: data, isLoading, join }; }
