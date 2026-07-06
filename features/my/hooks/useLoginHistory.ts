'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useLoginHistory() { const { data, isLoading } = useQuery({ queryKey: ['my', 'login-history'], queryFn: () => apiClient.get<{ history: { id: string; device: string; ip: string; loggedAt: string; isCurrent?: boolean }[] }>('/my/login-history') }); return { history: data?.history ?? [], isLoading }; }
