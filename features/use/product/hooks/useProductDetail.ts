'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useProductDetail(id: string) { const { data, isLoading } = useQuery({ queryKey: ['use', 'product', id], queryFn: () => apiClient.get<{ brand: string; title: string; price: number; point: number; description?: string }>(`/use/products/${id}`) }); const { mutate: purchase } = useMutation({ mutationFn: () => apiClient.post(`/use/products/${id}/purchase`) }); return { product: data, isLoading, purchase }; }
