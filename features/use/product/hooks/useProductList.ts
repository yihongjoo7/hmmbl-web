'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useProductList() { const { data, isLoading } = useQuery({ queryKey: ['use', 'product', 'list'], queryFn: () => apiClient.get<{ products: { id: string; brand: string; title: string; price: number; point: number }[] }>('/use/products') }); return { products: data?.products ?? [], isLoading }; }
