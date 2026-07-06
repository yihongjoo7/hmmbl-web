'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function usePointWork() { const { data, isLoading } = useQuery({ queryKey: ['earn', 'point-work', 'dashboard'], queryFn: () => apiClient.get<{ steps: number; todayPoint: number; totalPoint: number; goalSteps: number }>('/earn/point-work/dashboard') }); return { dashboard: data, isLoading }; }
