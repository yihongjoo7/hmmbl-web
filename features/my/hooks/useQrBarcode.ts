'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useQrBarcode() { const { data, isLoading } = useQuery({ queryKey: ['my', 'qr'], queryFn: () => apiClient.get<{ barcode: string }>('/my/qr') }); return { barcode: data?.barcode, isLoading }; }
