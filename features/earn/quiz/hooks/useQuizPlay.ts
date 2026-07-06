'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useQuizPlay(quizId: string) {
  const [result, setResult] = useState<{ isCorrect: boolean; answer: string; reward?: number } | null>(null);
  const { mutate: submitAnswer, isPending } = useMutation({
    mutationFn: (answer: string) => apiClient.post<{ isCorrect: boolean; answer: string; reward?: number }>(`/earn/quizzes/${quizId}/answer`, { answer }),
    onSuccess: (data) => setResult(data),
  });
  return { result, submitAnswer, isLoading: isPending };
}
