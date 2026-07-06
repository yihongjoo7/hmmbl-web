import { apiClient } from '@/lib/api/apiClient';
export const surveyApi = { list: () => apiClient.get('/earn/surveys'), detail: (id: string) => apiClient.get(`/earn/surveys/${id}`), submit: (id: string, answers: unknown) => apiClient.post(`/earn/surveys/${id}/submit`, { answers }) };
export const surveyQueryKeys = { list: () => ['earn', 'survey', 'list'] as const, detail: (id: string) => ['earn', 'survey', id] as const };
