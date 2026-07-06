'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useAutoCharge() { const { data } = useQuery({ queryKey: ['pay', 'charge', 'auto'], queryFn: () => apiClient.get('/pay/charge/auto') }); const { mutate: update } = useMutation({ mutationFn: (settings: unknown) => apiClient.post('/pay/charge/auto', settings) }); return { settings: data, update }; }
