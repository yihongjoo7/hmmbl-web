import { apiClient } from '@/lib/api/apiClient';
export const cultureApi = { list: () => apiClient.get('/use/culture'), detail: (id: string) => apiClient.get(`/use/culture/${id}`) };
export const cultureQueryKeys = { list: () => ['use', 'culture', 'list'] as const, detail: (id: string) => ['use', 'culture', id] as const };
