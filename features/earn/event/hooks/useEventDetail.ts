'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useEventDetail(id: string) { const { data, isLoading } = useQuery({ queryKey: ['earn', 'event', id], queryFn: () => apiClient.get<{ title: string; description?: string; expiresAt?: string; isParticipated?: boolean }>(`/earn/events/${id}`) }); const { mutate: participate } = useMutation({ mutationFn: () => apiClient.post(`/earn/events/${id}/participate`) }); return { event: data, isLoading, participate }; }
