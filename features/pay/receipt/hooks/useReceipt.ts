'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useReceipt() { const { data, isLoading } = useQuery({ queryKey: ['pay', 'receipt', 'list'], queryFn: () => apiClient.get<{ receipts: { id: string; storeName: string; amount: number; paidAt: string }[] }>('/pay/receipts') }); return { receipts: data?.receipts ?? [], isLoading }; }
