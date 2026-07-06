'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useHealthContent() { const { data, isLoading } = useQuery({ queryKey: ['earn', 'point-work', 'health'], queryFn: () => apiClient.get('/earn/point-work/health-content') }); return { contents: data, isLoading }; }
