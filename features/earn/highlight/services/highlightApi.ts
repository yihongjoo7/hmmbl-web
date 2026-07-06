import { apiClient } from '@/lib/api/apiClient';
export const highlightApi = { list: () => apiClient.get('/earn/highlights'), detail: (id: string) => apiClient.get(`/earn/highlights/${id}`), claim: (id: string) => apiClient.post(`/earn/highlights/${id}/claim`) };
export const highlightQueryKeys = { list: () => ['earn', 'highlight', 'list'] as const, detail: (id: string) => ['earn', 'highlight', id] as const };
