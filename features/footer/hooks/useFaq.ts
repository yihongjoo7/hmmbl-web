'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useFaq() { const { data, isLoading } = useQuery({ queryKey: ['footer', 'faq'], queryFn: () => apiClient.get<{ faqs: unknown[] }>('/footer/faq') }); return { faqs: data?.faqs ?? [], isLoading }; }
