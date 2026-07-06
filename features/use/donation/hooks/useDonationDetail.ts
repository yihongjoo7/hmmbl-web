'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useDonationDetail(id: string) { const { data, isLoading } = useQuery({ queryKey: ['use', 'donation', id], queryFn: () => apiClient.get<{ title: string; organization: string; description?: string; minPoint?: number }>(`/use/donations/${id}`) }); const { mutate: donate } = useMutation({ mutationFn: (amount: number) => apiClient.post(`/use/donations/${id}/donate`, { amount }) }); return { donation: data, isLoading, donate }; }
