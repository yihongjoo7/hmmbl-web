'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useDonationList() { const { data, isLoading } = useQuery({ queryKey: ['use', 'donation', 'list'], queryFn: () => apiClient.get<{ donations: { id: string; title: string; organization: string; totalDonated: number }[] }>('/use/donations') }); return { donations: data?.donations ?? [], isLoading }; }
