'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useTransferHistory() { const { data, isLoading } = useQuery({ queryKey: ['pay', 'transfer', 'history'], queryFn: () => apiClient.get('/pay/transfer/history') }); return { history: data, isLoading }; }
