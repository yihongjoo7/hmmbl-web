'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useCs() {
  const { data: faqs, isLoading } = useQuery({ queryKey: ['footer', 'faq'], queryFn: () => apiClient.get<{ faqs: { id: string; question: string; answer: string }[] }>('/footer/faq') });
  const { mutate: submitInquiry } = useMutation({ mutationFn: (data: unknown) => apiClient.post('/footer/inquiry', data) });
  return { faqs: faqs?.faqs ?? [], isLoading, submitInquiry };
}
