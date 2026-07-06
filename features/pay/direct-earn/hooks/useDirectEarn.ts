'use client';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useDirectEarn() { const { mutate: submit, isPending } = useMutation({ mutationFn: (data: { type: string; payload: unknown }) => apiClient.post('/pay/direct-earn', data) }); return { submit, isLoading: isPending }; }
