'use client';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useRoulette() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<{ reward: number; label: string } | null>(null);
  const { data } = useQuery({ queryKey: ['earn', 'roulette', 'status'], queryFn: () => apiClient.get<{ canSpin: boolean }>('/earn/roulette/status') });
  const { mutate: spin } = useMutation({
    mutationFn: () => apiClient.post<{ reward: number; label: string }>('/earn/roulette/spin'),
    onMutate: () => setIsSpinning(true),
    onSuccess: (data) => { setTimeout(() => { setResult(data); setIsSpinning(false); }, 2000); },
    onError: () => setIsSpinning(false),
  });
  return { isSpinning, result, spin, canSpin: data?.canSpin ?? false };
}
