'use client';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useInstantCharge() { const { mutate: charge, isPending } = useMutation({ mutationFn: (amount: number) => apiClient.post('/pay/charge/instant', { amount }) }); return { charge, isLoading: isPending }; }
