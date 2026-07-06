import { apiClient } from '@/lib/api/apiClient';
export const missionApi = { list: () => apiClient.get('/earn/missions'), detail: (id: string) => apiClient.get(`/earn/missions/${id}`), participate: (id: string) => apiClient.post(`/earn/missions/${id}/participate`) };
export const missionQueryKeys = { list: () => ['earn', 'mission', 'list'] as const, detail: (id: string) => ['earn', 'mission', id] as const };
