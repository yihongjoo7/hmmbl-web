'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useGiftSend() {
  const [step, setStep] = useState(1);
  const { mutate: submit, isPending } = useMutation({ mutationFn: (data: unknown) => apiClient.post('/use/gift/send', data) });
  return { step, goNext: () => setStep(s => Math.min(s + 1, 3)), goPrev: () => setStep(s => Math.max(s - 1, 1)), submit, isLoading: isPending };
}
