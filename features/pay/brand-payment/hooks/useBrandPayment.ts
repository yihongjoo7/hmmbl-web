'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useBrandPayment() {
  const [barcode, setBarcode] = useState<string>();
  const { data, isLoading } = useQuery({ queryKey: ['pay', 'brand-payment', 'merchants'], queryFn: () => apiClient.get<{ merchants: { id: string; name: string; logoUrl?: string }[] }>('/pay/brand-payment/merchants') });
  const { mutate: requestBarcode } = useMutation({ mutationFn: () => apiClient.post<{ barcode: string }>('/pay/brand-payment/barcode'), onSuccess: d => setBarcode(d.barcode) });
  return { merchants: data?.merchants ?? [], barcode, isLoading, requestBarcode };
}
