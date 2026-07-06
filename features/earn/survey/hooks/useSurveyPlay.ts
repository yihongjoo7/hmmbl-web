'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useSurveyPlay(surveyId: string) {
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data, isLoading } = useQuery({ queryKey: ['earn', 'survey', surveyId], queryFn: () => apiClient.get(`/earn/surveys/${surveyId}`) });
  const { mutate: submit } = useMutation({ mutationFn: () => apiClient.post(`/earn/surveys/${surveyId}/submit`, { answers }) });
  const addAnswer = (qId: string, answer: unknown) => setAnswers(prev => ({ ...prev, [qId]: answer }));
  const next = () => setCurrentIndex(i => i + 1);
  return { survey: data, isLoading, currentIndex, answers, addAnswer, next, submit };
}
