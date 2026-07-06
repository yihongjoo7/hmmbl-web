'use client';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useTransferTo() { const { mutate: transfer, isPending } = useMutation({ mutationFn: (data: { partnerId: string; amount: number }) => apiClient.post('/pay/transfer', data) }); return { transfer, isLoading: isPending }; }
