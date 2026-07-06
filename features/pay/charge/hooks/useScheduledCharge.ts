'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useScheduledCharge() { const { data } = useQuery({ queryKey: ['pay', 'charge', 'scheduled'], queryFn: () => apiClient.get('/pay/charge/scheduled') }); const { mutate: schedule } = useMutation({ mutationFn: (s: unknown) => apiClient.post('/pay/charge/scheduled', s) }); const { mutate: cancel } = useMutation({ mutationFn: () => apiClient.post('/pay/charge/scheduled/cancel') }); return { scheduled: data, schedule, cancel }; }
