'use client';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';
export function useSurveyList() { const { data, isLoading } = useQuery({ queryKey: ['earn', 'survey', 'list'], queryFn: () => apiClient.get<{ surveys: unknown[] }>('/earn/surveys') }); return { surveys: data?.surveys ?? [], isLoading }; }
