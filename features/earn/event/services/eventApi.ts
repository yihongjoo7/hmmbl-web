import { apiClient } from '@/lib/api/apiClient';
export const eventApi = { list: () => apiClient.get('/earn/events'), detail: (id: string) => apiClient.get(`/earn/events/${id}`), participate: (id: string) => apiClient.post(`/earn/events/${id}/participate`), dailyFortune: () => apiClient.get('/earn/daily-fortune') };
export const eventQueryKeys = { list: () => ['earn', 'event', 'list'] as const, detail: (id: string) => ['earn', 'event', id] as const, fortune: () => ['earn', 'daily-fortune'] as const };
