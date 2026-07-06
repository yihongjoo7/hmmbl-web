'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useEventList() { const { data, isLoading } = useQuery({ queryKey: ['earn', 'event', 'list'], queryFn: () => apiClient.get<{ events: { id: string; title: string; badge?: string; expiresAt?: string }[] }>('/earn/events') }); return { events: data?.events ?? [], isLoading }; }
