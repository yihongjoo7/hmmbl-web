import { apiClient } from '@/lib/api/apiClient';
export const quizApi = { list: () => apiClient.get('/earn/quizzes'), detail: (id: string) => apiClient.get(`/earn/quizzes/${id}`), answer: (id: string, answer: string) => apiClient.post(`/earn/quizzes/${id}/answer`, { answer }) };
export const quizQueryKeys = { list: () => ['earn', 'quiz', 'list'] as const, detail: (id: string) => ['earn', 'quiz', id] as const };
