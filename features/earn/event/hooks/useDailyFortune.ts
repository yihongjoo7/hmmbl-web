'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useDailyFortune() { const { data, isLoading } = useQuery({ queryKey: ['earn', 'daily-fortune'], queryFn: () => apiClient.get('/earn/daily-fortune') }); return { fortune: data, isLoading }; }
