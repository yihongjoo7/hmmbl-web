'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useQuizList() { const { data, isLoading } = useQuery({ queryKey: ['earn', 'quiz', 'list'], queryFn: () => apiClient.get('/earn/quizzes') }); return { quizzes: data ?? [], isLoading }; }
