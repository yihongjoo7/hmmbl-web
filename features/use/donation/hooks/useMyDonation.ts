'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useMyDonation() { const { data, isLoading } = useQuery({ queryKey: ['use', 'donation', 'my'], queryFn: () => apiClient.get('/use/donations/my') }); return { myDonation: data, isLoading }; }
