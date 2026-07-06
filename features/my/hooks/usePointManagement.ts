'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function usePointManagement() { const { data, isLoading } = useQuery({ queryKey: ['my', 'point'], queryFn: () => apiClient.get<{ totalPoint: number; expiringPoint: number; expiringDate: string }>('/my/point') }); return { summary: data, isLoading }; }
